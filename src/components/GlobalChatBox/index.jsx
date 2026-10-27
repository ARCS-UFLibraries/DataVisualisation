import React, { useState, useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './GlobalChatBox.module.css';

const QUICK_SUGGESTIONS = [
  'Box plot vs Histogram?',
  'How to handle missing values in Pandas?',
  'Best plot for 2 continuous variables?',
  'How to add titles in Seaborn?',
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
                  onClick={() => {
                    navigator.clipboard?.writeText(code);
                  }}
                >
                  Copy
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
                  <ul key={pIdx} style={{ margin: '6px 0', paddingLeft: '20px' }}>
                    {items.map((it, iIdx) => (
                      <li key={iIdx} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(it) }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={pIdx}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(p) }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(str) {
  let escaped = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="' + styles.inlineCode + '">$1</code>');
  escaped = escaped.replace(/\n/g, '<br/>');

  return escaped;
}

export default function GlobalChatBox() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const apiUrl = siteConfig.customFields?.chatApiUrl || 'https://datavisualisation-6nju.onrender.com';

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I am your AI Data Viz Tutor. Ask me any question about Python, Pandas, Matplotlib, or choosing the right chart for your data!",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (questionText) => {
    const text = (questionText || inputVal).trim();
    if (!text || busy) return;

    setInputVal('');
    setError('');

    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
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
          body: JSON.stringify({ question: text, current_page: location.pathname }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Streaming failed, fallback to JSON');
        }
      } catch (streamErr) {
        usedStream = false;
        response = await fetch(`${cleanUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text, current_page: location.pathname }),
        });
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.detail || 'Could not retrieve answer.');
      }

      if (usedStream && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamedContent = '';
        let sources = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
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
            } else if (eventType === 'error') {
              try {
                const parsed = JSON.parse(rawData);
                throw new Error(parsed.detail || 'Streaming encountered an error.');
              } catch (e) {
                throw new Error(e.message);
              }
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
      setError(err.message || 'Error communicating with AI service.');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                content: 'Sorry, I ran into an error connecting to the service. Please make sure the AI service is running or try again shortly.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.floatingContainer}>
      {!isOpen && (
        <button
          type="button"
          className={styles.floatingTrigger}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <span className={styles.pulseDot} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Ask AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Data Visualisation AI Assistant">
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.headerAvatar}>🤖</div>
              <div>
                <div className={styles.headerTitle}>Data Viz Assistant</div>
                <div className={styles.headerSubtitle}>Instant guidance & code help</div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                title="Clear conversation"
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content: "✨ New conversation started! What would you like to explore or debug today?",
                    },
                  ]);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                title="Close"
                onClick={() => setIsOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="6"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === 'user' ? styles.userRow : styles.assistantRow
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                  }`}
                >
                  {msg.content ? (
                    <FormattedContent text={msg.content} />
                  ) : (
                    msg.isStreaming && (
                      <div className={styles.typingIndicator}>
                        <div className={styles.typingDot} />
                        <div className={styles.typingDot} />
                        <div className={styles.typingDot} />
                      </div>
                    )
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className={styles.messageSources}>
                      <span style={{ fontWeight: 700, opacity: 0.8 }}>Relevant Docs:</span>
                      {msg.sources.map((s, idx) => {
                        const docPath = s.path.replace(/\.mdx?$/, '').replace(/\/index$/, '');
                        return (
                          <Link
                            key={idx}
                            to={`/docs/${docPath}`}
                            className={styles.sourceTag}
                          >
                            📄 {s.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--ifm-color-emphasis-700)', margin: '4px 0' }}>
                  Quick questions to try:
                </p>
                <div className={styles.quickPrompts}>
                  {QUICK_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.quickPromptChip}
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.chatFooter}>
            <form
              className={styles.inputForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className={styles.chatInput}
                placeholder="Ask a question or explain code…"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={busy}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={busy || !inputVal.trim()}
                aria-label="Send"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
            <div className={styles.footerNote}>
              Grounded in UF Data Visualisation Guide
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
