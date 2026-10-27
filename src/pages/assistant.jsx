import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './assistant.module.css';

const QUICK_QUESTIONS = [
  'When should I use a box plot instead of a histogram?',
  'How do I create a heatmap with seaborn annotations?',
  'What is the difference between loc and iloc in Pandas?',
  'How can I make an interactive scatter plot with Plotly?',
];

function FormattedContent({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className={styles.proseFormatted}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : 'python';
          const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={index} className={styles.codeBlockWrapper}>
              <div className={styles.codeBlockHeader}>
                <span>{lang}</span>
                <button
                  type="button"
                  className={styles.codeCopyBtn}
                  onClick={() => navigator.clipboard?.writeText(code)}
                >
                  Copy Code
                </button>
              </div>
              <pre className={styles.codeBlockContent}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const paragraphs = part.split(/\n\n+/);
        return (
          <React.Fragment key={index}>
            {paragraphs.map((p, pIdx) => {
              if (!p.trim()) return null;
              if (p.trim().startsWith('* ') || p.trim().startsWith('- ')) {
                const items = p.trim().split(/\n[*|-]\s+/).filter(Boolean);
                return (
                  <ul key={pIdx} className={styles.bulletList}>
                    {items.map((it, iIdx) => (
                      <li key={iIdx} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={pIdx}
                  dangerouslySetInnerHTML={{ __html: renderInline(p) }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderInline(str) {
  let escaped = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="' + styles.inlineCode + '">$1</code>');
  escaped = escaped.replace(/\n/g, '<br/>');
  return escaped;
}

export default function AssistantPage() {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig.customFields?.chatApiUrl || 'https://datavisualisation-6nju.onrender.com';
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Welcome to the **Data Visualisation AI Assistant**! Ask me about Python, Pandas, Matplotlib, Seaborn, Plotly, or how to choose the right chart for your dataset. I ground my answers in the course documentation.',
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(textToSend) {
    const value = (textToSend || question).trim();
    if (!value || busy) return;

    setError('');
    setQuestion('');
    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: value },
      { id: botMsgId, role: 'assistant', content: '', isStreaming: true },
    ]);
    setBusy(true);

    try {
      const cleanUrl = apiUrl.replace(/\/$/, '');
      const streamEndpoint = `${cleanUrl}/api/chat/stream`;

      let response;
      let usedStream = true;

      try {
        response = await fetch(streamEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: value }),
        });
        if (!response.ok || !response.body) throw new Error('Stream failed');
      } catch (_) {
        usedStream = false;
        response = await fetch(`${cleanUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: value }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'The assistant could not answer this question.');
      }

      if (usedStream && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamedContent = '';
        let sources = [];

        while (true) {
          const { done, value: chunkValue } = await reader.read();
          if (done) break;

          buffer += decoder.decode(chunkValue, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            const trimmed = block.trim();
            if (!trimmed) continue;
            const eventMatch = trimmed.match(/^event:\s*(\w+)/m);
            const dataMatch = trimmed.match(/^data:\s*(.*)$/m);
            const eventType = eventMatch ? eventMatch[1] : 'message';
            const rawData = dataMatch ? dataMatch[1] : '';

            if (eventType === 'sources') {
              try {
                sources = JSON.parse(rawData);
              } catch (_) {}
            } else if (eventType === 'token') {
              try {
                const parsed = JSON.parse(rawData);
                streamedContent += parsed.text || '';
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: streamedContent, sources }
                      : msg
                  )
                );
              } catch (_) {}
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, content: streamedContent, sources, isStreaming: false }
              : msg
          )
        );
      } else {
        const result = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content: result.answer,
                  sources: result.sources || [],
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } catch (err) {
      setError(err.message || 'Could not connect to the AI service. Please try again.');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                content: 'Unable to reach the assistant right now. Please verify your connection or try again shortly.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title="AI Assistant" description="Documentation-grounded data visualisation assistant">
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>
            <span className={styles.pulseDot} />
            DOCUMENTATION-GROUNDED AI
          </div>
          <h1>Data Visualisation Assistant</h1>
          <p>
            Ask questions about data cleaning, plotting with Matplotlib & Seaborn, and interactive charts with Plotly. Explanations are directly backed by the UF Data Visualisation Guide.
          </p>

          <div className={styles.quickBar}>
            <span className={styles.quickLabel}>Suggested:</span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.quickBtn}
                onClick={() => sendMessage(q)}
                disabled={busy}
              >
                {q}
              </button>
            ))}
          </div>
        </header>

        <section className={styles.chat} aria-label="Chat with the data visualisation assistant">
          <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.user : styles.assistant
                }`}
              >
                <div className={styles.roleHeader}>
                  <div className={styles.avatarIcon}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <span className={styles.roleName}>
                    {message.role === 'user' ? 'You' : 'Data Viz Tutor'}
                  </span>
                </div>

                <div className={styles.content}>
                  {message.content ? (
                    <FormattedContent text={message.content} />
                  ) : (
                    message.isStreaming && (
                      <div className={styles.typingIndicator}>
                        <div className={styles.typingDot} />
                        <div className={styles.typingDot} />
                        <div className={styles.typingDot} />
                      </div>
                    )
                  )}
                </div>

                {message.sources && message.sources.length > 0 && (
                  <div className={styles.sources}>
                    <strong>Referenced Documentation:</strong>
                    <div className={styles.sourcesList}>
                      {message.sources.map((source, sIdx) => {
                        const docPath = source.path
                          .replace(/\.mdx?$/, '')
                          .replace(/\/index$/, '');
                        return (
                          <Link
                            key={sIdx}
                            to={`/docs/${docPath}`}
                            className={styles.sourceChip}
                          >
                            📖 {source.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              id="assistant-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="e.g. When should I use a box plot instead of a histogram? (Press Enter to send)"
              rows={2}
              maxLength={2000}
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !question.trim()}
              className={styles.sendSubmitBtn}
            >
              {busy ? 'Generating…' : 'Send'}
            </button>
          </form>
          <p className={styles.note}>
            The assistant is trained on course materials and can make mistakes. Verify critical code and findings against the linked documentation.
          </p>
        </section>
      </main>
    </Layout>
  );
}
