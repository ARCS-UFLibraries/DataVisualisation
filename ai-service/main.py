from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any, AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Load environment variables
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

app = FastAPI(title="Data Visualisation Guide AI Assistant", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)
    current_page: str | None = Field(default=None)


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


def retrieve(question: str, chunks: list[dict[str, str]], limit: int = 3, current_page: str | None = None) -> list[dict[str, str]]:
    tokens = set(re.findall(r"[a-zA-Z0-9_+#.-]{2,}", question.lower()))
    if not tokens:
        return []
    scored: list[tuple[float, dict[str, str]]] = []
    page_norm = current_page.strip("/").lower() if current_page else ""
    for chunk in chunks:
        text_tokens = set(re.findall(r"[a-zA-Z0-9_+#.-]{2,}", (chunk["title"] + " " + chunk["text"]).lower()))
        overlap = len(tokens & text_tokens)
        if overlap:
            score = float(overlap)
            # Boost chunks from the page the student is currently reading
            if page_norm and page_norm in chunk["path"].lower():
                score += 2.0
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


SYSTEM_PROMPT = (
    "You are an encouraging, world-class Data Visualisation & Python tutor for university students. "
    "Provide clear, crisp, visually appealing explanations with clean, copy-pasteable Python code blocks when relevant. "
    "Formatting requirements for high visual readability:\n"
    "- Structure with clean markdown headings, short bullet points, and code snippets.\n"
    "- When writing code, use concise, well-commented Python (pandas, matplotlib, seaborn, plotly).\n"
    "- Do NOT output robotic disclaimers or repetitive metadata tags like '### Distinction' or 'Reasoning:'.\n"
    "- Keep explanations practical, concrete, and directly relevant to the student's question."
)

GEMINI_FALLBACK_MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite"),
    "gemini-3.8-flash",
    "gemini-flash-latest",
]


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "status": "running",
        "service": "Data Visualisation AI Assistant",
        "endpoints": ["/health", "/api/chat", "/api/chat/stream", "/docs"]
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "datalab-ai-assistant"}


@app.post("/api/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    openai_key = (os.getenv("OPENAI_API_KEY") or "").strip()

    chunks = load_chunks()
    sources = retrieve(request.question, chunks, limit=3, current_page=request.current_page)

    if sources:
        context = "\n\n".join(
            f"SOURCE: {chunk['title']} (docs/{chunk['path']})\nEXCERPT: {chunk['text']}" for chunk in sources
        )
    else:
        context = "No strongly matching course excerpts found. Answer using standard Python and data visualization principles."

    # 1. Use Google Gemini if configured
    if gemini_key and genai:
        try:
            client = genai.Client(api_key=gemini_key)
            prompt = (
                f"{SYSTEM_PROMPT}\n\n"
                f"RETRIEVED DOCUMENTATION:\n{context}\n\n"
                f"USER QUESTION:\n{request.question}"
            )
            response = None
            last_err = None
            for model_name in GEMINI_FALLBACK_MODELS:
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

    # 2. Use OpenAI if configured
    if openai_key and OpenAI:
        try:
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"USER QUESTION:\n{request.question}\n\nRETRIEVED DOCUMENTATION:\n{context}"}
                ],
                max_tokens=800,
            )
            return {
                "answer": response.choices[0].message.content,
                "sources": [{"title": s["title"], "path": s["path"]} for s in sources],
            }
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"OpenAI API error: {str(exc)}") from exc

    # 3. Offline fallback
    if sources:
        source_titles = ", ".join(s["title"] for s in sources)
        simulated_answer = (
            f"Based on the course guide ({source_titles}):\n\n"
            f"{sources[0]['text'][:450]}...\n\n"
            "*(Add GEMINI_API_KEY in .env to activate live instant AI responses.)*"
        )
    else:
        simulated_answer = (
            "I am your Data Visualisation Assistant. Ask me anything about Python, Pandas, Matplotlib, Seaborn, and choosing charts!\n\n"
            "*(Add GEMINI_API_KEY in .env to activate live instant AI responses.)*"
        )
    return {
        "answer": simulated_answer,
        "sources": [{"title": s["title"], "path": s["path"]} for s in sources],
    }


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """Server-Sent Events endpoint for lightning-fast token streaming."""
    gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    openai_key = (os.getenv("OPENAI_API_KEY") or "").strip()

    chunks = load_chunks()
    sources = retrieve(request.question, chunks, limit=3, current_page=request.current_page)
    clean_sources = [{"title": s["title"], "path": s["path"]} for s in sources]

    if sources:
        context = "\n\n".join(
            f"SOURCE: {chunk['title']} (docs/{chunk['path']})\nEXCERPT: {chunk['text']}" for chunk in sources
        )
    else:
        context = "No strongly matching course excerpts found. Answer using standard Python and data visualization principles."

    async def event_generator() -> AsyncGenerator[str, None]:
        # Send sources first
        yield f"event: sources\ndata: {json.dumps(clean_sources)}\n\n"

        if gemini_key and genai:
            try:
                client = genai.Client(api_key=gemini_key)
                prompt = (
                    f"{SYSTEM_PROMPT}\n\n"
                    f"RETRIEVED DOCUMENTATION:\n{context}\n\n"
                    f"USER QUESTION:\n{request.question}"
                )
                stream_resp = None
                last_err = None
                for model_name in GEMINI_FALLBACK_MODELS:
                    try:
                        stream_resp = client.models.generate_content_stream(
                            model=model_name,
                            contents=prompt,
                        )
                        break
                    except Exception as err:
                        last_err = err
                        continue
                if not stream_resp:
                    raise last_err

                for chunk in stream_resp:
                    if chunk.text:
                        yield f"event: token\ndata: {json.dumps({'text': chunk.text})}\n\n"
                yield "event: done\ndata: {}\n\n"
                return
            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'detail': f'Gemini error: {str(e)}'})}\n\n"
                return

        if openai_key and OpenAI:
            try:
                client = OpenAI(api_key=openai_key)
                stream = client.chat.completions.create(
                    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"USER QUESTION:\n{request.question}\n\nRETRIEVED DOCUMENTATION:\n{context}"}
                    ],
                    max_tokens=800,
                    stream=True,
                )
                for chunk in stream:
                    delta = chunk.choices[0].delta.content if chunk.choices else ""
                    if delta:
                        yield f"event: token\ndata: {json.dumps({'text': delta})}\n\n"
                yield "event: done\ndata: {}\n\n"
                return
            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'detail': f'OpenAI error: {str(e)}'})}\n\n"
                return

        # Fallback simulated response
        yield f"event: token\ndata: {json.dumps({'text': 'I am your Data Visualisation Assistant. Ask me anything about Python, Pandas, Matplotlib, or Seaborn!'})}\n\n"
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
