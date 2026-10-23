import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './assistant.module.css';

export default function AssistantPage() {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = siteConfig.customFields?.chatApiUrl || 'http://localhost:8000';
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {role: 'assistant', content: 'Hi! Ask me about Python, Pandas, data cleaning, statistics, or choosing the right visualization. I use the guide documentation when relevant.'},
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function sendMessage(event) {
    event.preventDefault();
    const value = question.trim();
    if (!value || busy) return;
    if (!apiUrl) {
      setError('The AI backend URL has not been configured yet. Deploy ai-service and set CHAT_API_URL during the Docusaurus build.');
      return;
    }
    setError('');
    setQuestion('');
    setMessages((previous) => [...previous, {role: 'user', content: value}]);
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: value}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'The assistant could not answer this question.');
      setMessages((previous) => [...previous, {role: 'assistant', content: result.answer, sources: result.sources || []}]);
    } catch (err) {
      setError(err.message || 'Could not connect to the AI service. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title="AI Assistant" description="Documentation-grounded data science assistant">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>DOCUMENTATION-GROUNDED AI</p>
          <h1>Data Science Assistant</h1>
          <p>Ask questions about the guide and get explanations grounded in its documentation, with source pages when available.</p>
        </header>
        <section className={styles.chat} aria-label="Chat with the data science assistant">
          <div className={styles.messages} aria-live="polite">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
                <div className={styles.role}>{message.role === 'user' ? 'You' : 'Assistant'}</div>
                <div className={styles.content}>{message.content}</div>
                {message.sources?.length > 0 && <div className={styles.sources}><strong>Sources</strong>{message.sources.map((source) => {
                  const docPath = source.path.replace(/\.mdx?$/, '').replace(/\/index$/, '');
                  return <div key={`${source.path}-${source.title}`}><Link to={`/docs/${docPath}`}>{source.title}</Link> <span>({source.path})</span></div>;
                })}</div>}
              </article>
            ))}
            {busy && <div className={styles.pending}>Searching the guide and preparing an answer…</div>}
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <form className={styles.form} onSubmit={sendMessage}>
            <label className={styles.srOnly} htmlFor="assistant-question">Your question</label>
            <textarea id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="e.g. When should I use a box plot instead of a histogram?" rows={3} maxLength={2000} />
            <button type="submit" disabled={busy || !question.trim()}>{busy ? 'Thinking…' : 'Ask assistant'}</button>
          </form>
          <p className={styles.note}>The assistant can make mistakes. Verify important statistical decisions against the linked documentation.</p>
        </section>
      </main>
    </Layout>
  );
}
