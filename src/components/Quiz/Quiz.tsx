import React, { useId, useState, useMemo } from 'react';
import { useLocation } from '@docusaurus/router';
import { useProgress } from '@site/src/context/ProgressContext';
import './quiz.css';

export type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number | string;
  hint?: string;
  explanation?: string;
};

type QuizProps = {
  title?: string;
  questions: QuizQuestion[];
};

export default function Quiz({
  title = 'Check Your Understanding',
  questions = [],
}: QuizProps) {
  const { completeQuiz } = useProgress();
  const quizInstanceId = useId();
  const location = useLocation();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageId = pathParts[pathParts.length - 1] || '';

  const getQuestionKey = (q: QuizQuestion, index: number) =>
    q.id ?? `${quizInstanceId}-question-${index}`;

  const getCorrectAnswerIndex = (q: QuizQuestion): number => {
    if (typeof q.correctAnswer === 'number') {
      return q.correctAnswer;
    }
    if (typeof q.correctAnswer === 'string') {
      const target = q.correctAnswer.trim().toLowerCase();
      const matchIdx = q.options.findIndex(
        (opt) => opt.trim().toLowerCase() === target
      );
      if (matchIdx !== -1) {
        return matchIdx;
      }
    }
    return 0;
  };

  const handleSelect = (questionKey: string, optionIndex: number) => {
    if (submitted[questionKey]) {
      return;
    }
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionKey]: optionIndex,
    }));
  };

  const handleCheck = (questionKey: string) => {
    const selected = selectedAnswers[questionKey];
    if (selected === undefined) return;

    const question = questions.find(
      (q, index) => getQuestionKey(q, index) === questionKey
    );
    if (!question) return;

    const correctIdx = getCorrectAnswerIndex(question);
    const currentAnswerIsCorrect = selected === correctIdx;

    const nextSubmitted = {
      ...submitted,
      [questionKey]: true,
    };
    setSubmitted(nextSubmitted);

    if (currentAnswerIsCorrect) {
      const allQuestionsCorrect = questions.every((q, index) => {
        const key = getQuestionKey(q, index);
        if (key === questionKey) return true;
        const qCorrectIdx = getCorrectAnswerIndex(q);
        return nextSubmitted[key] === true && selectedAnswers[key] === qCorrectIdx;
      });

      if (allQuestionsCorrect) {
        completeQuiz(pageId, 100);
      }
    }
  };

  const handleTryAgain = (questionKey: string) => {
    setSubmitted((prev) => ({
      ...prev,
      [questionKey]: false,
    }));
    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionKey];
      return updated;
    });
  };

  const toggleHint = (questionKey: string) => {
    setShowHints((prev) => ({
      ...prev,
      [questionKey]: !prev[questionKey],
    }));
  };

  const correctCount = useMemo(() => {
    return questions.filter((q, index) => {
      const key = getQuestionKey(q, index);
      return (
        submitted[key] &&
        selectedAnswers[key] === getCorrectAnswerIndex(q)
      );
    }).length;
  }, [questions, submitted, selectedAnswers]);

  const totalQuestions = questions.length;
  const isAllMastered = totalQuestions > 0 && correctCount === totalQuestions;
  const progressPercent = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  return (
    <div className="quiz-container">
      {/* Quiz Header with Title & Live Score */}
      <div className="quiz-header">
        <div className="quiz-title-area">
          <span className="quiz-type-badge">Knowledge Check</span>
          <h3 className="quiz-title">{title}</h3>
        </div>
        <div className="quiz-score-pill">
          <span>{correctCount} of {totalQuestions} completed</span>
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="quiz-progress-bar-bg">
        <div
          className="quiz-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Questions List */}
      {questions.map((q, index) => {
        const questionKey = getQuestionKey(q, index);
        const selected = selectedAnswers[questionKey];
        const isSubmitted = submitted[questionKey];
        const correctIdx = getCorrectAnswerIndex(q);
        const isCorrect = isSubmitted && selected === correctIdx;
        const isIncorrect = isSubmitted && selected !== correctIdx;

        let cardClass = 'quiz-question-card';
        if (isCorrect) cardClass += ' answered-correct';
        if (isIncorrect) cardClass += ' answered-incorrect';

        const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

        return (
          <div key={questionKey} className={cardClass}>
            <div className="quiz-question-header">
              <span className="quiz-q-num">Q{index + 1}</span>
              <p className="quiz-q-text">{q.question}</p>
            </div>

            <div className="quiz-options-grid">
              {q.options.map((option, optionIndex) => {
                const isOptionSelected = selected === optionIndex;
                let btnClass = 'quiz-option-btn';

                if (isSubmitted) {
                  if (optionIndex === correctIdx) {
                    btnClass += ' state-correct';
                  } else if (isOptionSelected) {
                    btnClass += ' state-incorrect';
                  }
                } else if (isOptionSelected) {
                  btnClass += ' selected';
                }

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    className={btnClass}
                    onClick={() => handleSelect(questionKey, optionIndex)}
                    disabled={isSubmitted && isCorrect}
                  >
                    <span className="quiz-opt-letter">
                      {isSubmitted && optionIndex === correctIdx
                        ? '✓'
                        : isSubmitted && isOptionSelected
                        ? '✕'
                        : optionLetters[optionIndex] || optionIndex + 1}
                    </span>
                    <span className="quiz-opt-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="quiz-actions-row">
              {!isSubmitted ? (
                <button
                  type="button"
                  className="quiz-btn-submit"
                  onClick={() => handleCheck(questionKey)}
                  disabled={selected === undefined}
                >
                  Check Answer
                </button>
              ) : !isCorrect ? (
                <button
                  type="button"
                  className="quiz-btn-retry"
                  onClick={() => handleTryAgain(questionKey)}
                >
                  Try Again
                </button>
              ) : null}

              {q.hint && (
                <button
                  type="button"
                  className="quiz-btn-hint"
                  onClick={() => toggleHint(questionKey)}
                >
                  {showHints[questionKey] ? 'Hide Hint' : 'View Hint'}
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHints[questionKey] && q.hint && (
              <div className="quiz-hint-box">
                <strong>Hint:</strong> {q.hint}
              </div>
            )}

            {/* Explanation & Feedback */}
            {isSubmitted && (
              <div
                className={`quiz-feedback-box ${
                  isCorrect ? 'is-correct' : 'is-incorrect'
                }`}
              >
                <div className="quiz-feedback-header">
                  <span className="quiz-status-indicator" />
                  <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
                {q.explanation && <p style={{ margin: 0 }}>{q.explanation}</p>}
              </div>
            )}
          </div>
        );
      })}

      {/* Clean Completion Banner */}
      {isAllMastered && (
        <div className="quiz-complete-card">
          <div className="quiz-complete-title">Assessment Complete</div>
          <p style={{ margin: 0, color: 'var(--ifm-font-color-base)' }}>
            All questions answered correctly. Your lesson progress has been recorded.
          </p>
        </div>
      )}
    </div>
  );
}