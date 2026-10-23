from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).resolve().parent.parent / '.env')
load_dotenv(Path(__file__).resolve().parent / '.env')

try:
    from google import genai
except ImportError:
    genai = None

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
DEFAULT_ORIGINS = "https://arcs-uflibraries.github.io,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
ALLOWED_ORIGINS = [x.strip() for x in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",") if x.strip()]

app = FastAPI(title="Data Visualisation Guide AI Assistant", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)


class SourceChunk(BaseModel):
    title: str
    path: str
    excerpt: str


def clean_mdx(text: str) -> str:
    """Convert MDX source to plain text for retrieval without executing any content."""
    text = re.sub(r"^import\s+.*?$", " ", text, flags=re.MULTILINE)
    text = re.sub(r"^export\s+.*?$", " ", text, flags=re.MULTILINE)
    text = re.sub(r"```.*?```", " ", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[`*_>#|]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


CHUNKS_CACHE: list[dict[str, str]] = []

def load_chunks() -> list[dict[str, str]]:
    global CHUNKS_CACHE
    if CHUNKS_CACHE:
        return CHUNKS_CACHE
    chunks: list[dict[str, str]] = []
    if not KNOWLEDGE_DIR.exists():
        return chunks
    for path in KNOWLEDGE_DIR.rglob("*.mdx"):
        try:
            raw = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        title_match = re.search(r"^title:\s*[\"']?(.+?)[\"']?\s*$", raw, flags=re.MULTILINE)
        title = title_match.group(1).strip() if title_match else path.stem.replace("-", " ").replace("_", " ").title()
        for paragraph in re.split(r"\n\s*\n", raw):
            text = clean_mdx(paragraph)
            if len(text) >= 80:
                chunks.append({"title": title, "path": str(path.relative_to(KNOWLEDGE_DIR)).replace("\\", "/"), "text": text[:1800]})
    CHUNKS_CACHE = chunks
    return chunks


def retrieve(question: str, chunks: list[dict[str, str]], limit: int = 3) -> list[dict[str, str]]:
    tokens = set(re.findall(r"[a-zA-Z0-9_+#.-]{2,}", question.lower()))
    if not tokens:
        return []
    scored: list[tuple[int, dict[str, str]]] = []
    for chunk in chunks:
        text_tokens = set(re.findall(r"[a-zA-Z0-9_+#.-]{2,}", (chunk["title"] + " " + chunk["text"]).lower()))
        overlap = len(tokens & text_tokens)
        if overlap:
            scored.append((overlap, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "status": "running",
        "service": "Data Visualisation AI Assistant",
        "endpoints": ["/health", "/api/chat", "/docs"]
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "datalab-ai-assistant"}


@app.post("/api/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    chunks = load_chunks()
    sources = retrieve(request.question, chunks)

    system_prompt = (
        "You are a friendly, expert Data Visualisation & Python tutor for students. "
        "Provide direct, clear, well-formatted answers with practical Python code examples when helpful. "
        "Style and formatting rules: "
        "- Do NOT output robotic metadata sections like '### Distinction', 'Documentation:', or 'Reasoning:'. "
        "- Seamlessly answer the student's question in a clear, conversational, and professional tone. "
        "- Naturally reference relevant course topics if helpful, but avoid stiff bureaucratic disclaimers. "
        "- Keep explanations easy to understand for beginners without unnecessary jargon."
    )

    if sources:
        context = "\n\n".join(
            f"SOURCE: {chunk['title']} (docs/{chunk['path']})\nEXCERPT: {chunk['text']}" for chunk in sources
        )
    else:
        context = "No strongly matching documentation excerpts were retrieved. Answer using standard Python/data visualization guidance."

    # 1. Use Google Gemini if GEMINI_API_KEY is configured
    if gemini_key and genai:
        try:
            client = genai.Client(api_key=gemini_key)
            prompt = (
                f"{system_prompt}\n\n"
                f"RETRIEVED DOCUMENTATION:\n{context}\n\n"
                f"USER QUESTION:\n{request.question}"
            )
            fallback_models = [
                os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite"),
                "gemini-flash-lite-latest",
                "gemini-3.8-flash",
            ]
            last_err = None
            response = None
            for model_name in fallback_models:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                    break
                except Exception as err:
                    last_err = err
                    continue
            if not response:
                raise last_err
            return {
                "answer": response.text,
                "sources": [{"title": s["title"], "path": s["path"]} for s in sources],
            }
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Gemini API error: {str(exc)}") from exc

    # 2. Use OpenAI if OPENAI_API_KEY is configured
    if openai_key and OpenAI:
        try:
            client = OpenAI(api_key=openai_key)
            response = client.responses.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
                instructions=system_prompt,
                input=f"USER QUESTION:\n{request.question}\n\nRETRIEVED DOCUMENTATION:\n{context}",
                max_output_tokens=700,
            )
            return {
                "answer": response.output_text,
                "sources": [{"title": s["title"], "path": s["path"]} for s in sources],
            }
        except Exception as exc:
            raise HTTPException(status_code=502, detail="OpenAI API error. Please try again.") from exc

    # 3. Local offline fallback if neither key is set
    if sources:
        source_titles = ", ".join(s["title"] for s in sources)
        simulated_answer = (
            f"Based on the course guide ({source_titles}):\n\n"
            f"{sources[0]['text'][:450]}...\n\n"
            "*(Assistant running in local documentation-retrieval mode. Add GEMINI_API_KEY in .env for live Gemini answers.)*"
        )
    else:
        simulated_answer = (
            "I am your Data Visualisation Assistant. I can help answer questions on Python, Pandas, "
            "Matplotlib, Seaborn, and choosing charts. "
            "*(Add GEMINI_API_KEY in .env to enable live Gemini answers.)*"
        )
    return {
        "answer": simulated_answer,
        "sources": [{"title": s["title"], "path": s["path"]} for s in sources],
    }
