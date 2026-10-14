import React, { useId, useState } from 'react';
import { useLocation } from '@docusaurus/router';

import { useProgress } from '@site/src/context/ProgressContext';

type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  explanation?: string;
};

type QuizProps = {
  title?: string;
  questions: QuizQuestion[];
};

export default function Quiz({
  title = 'Check Your Understanding',
  questions,
}: QuizProps) {
  const { completeQuiz } = useProgress();

  const quizInstanceId = useId();
  const location = useLocation();

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  const [submitted, setSubmitted] = useState<
    Record<string, boolean>
  >({});

  /*
   * The final part of the lesson URL becomes our page ID.
   *
   * Example:
   * /python-essentials/variables/
   *
   * becomes:
   * variables
   */
  const pathParts = location.pathname
    .split('/')
    .filter(Boolean);

  const pageId = pathParts[pathParts.length - 1] || '';

  const getQuestionKey = (
    q: QuizQuestion,
    index: number
  ) => q.id ?? `${quizInstanceId}-question-${index}`;

  const handleSelect = (
    questionKey: string,
    optionIndex: number
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionKey]: optionIndex,
    }));
  };

  const handleCheck = (questionKey: string) => {
    const selected = selectedAnswers[questionKey];

    if (selected === undefined) {
      return;
    }

    const question = questions.find(
      (q, index) =>
        getQuestionKey(q, index) === questionKey
    );

    if (!question) {
      return;
    }

    const currentAnswerIsCorrect =
      selected === question.correctAnswer;

    const nextSubmitted = {
      ...submitted,
      [questionKey]: true,
    };

    setSubmitted(nextSubmitted);

    /*
     * We only count the quiz as complete when:
     *
     * 1. The current answer is correct
     * 2. Every other question has already been answered correctly
     */
    if (currentAnswerIsCorrect) {
      const allQuestionsCorrect = questions.every(
        (q, index) => {
          const key = getQuestionKey(q, index);

          if (key === questionKey) {
            return true;
          }

          return (
            nextSubmitted[key] === true &&
            selectedAnswers[key] === q.correctAnswer
          );
        }
      );

      if (allQuestionsCorrect) {
        completeQuiz(pageId, 100);
      }
    }
  };

  const handleTryAgain = (
    questionKey: string
  ) => {
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

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>{title}</h3>

      {questions.map((q, index) => {
        const questionKey = getQuestionKey(q, index);
        const selected = selectedAnswers[questionKey];
        const isSubmitted = submitted[questionKey];
        const isCorrect =
          selected === q.correctAnswer;

        const groupName =
          `${quizInstanceId}-${questionKey}`;

        return (
          <div
            key={questionKey}
            style={{
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <p style={{ fontWeight: 600 }}>
              {index + 1}. {q.question}
            </p>

            <div>
              {q.options.map((option, optionIndex) => {
                const inputId =
                  `${groupName}-option-${optionIndex}`;

                return (
                  <label
                    key={optionIndex}
                    htmlFor={inputId}
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={groupName}
                      value={optionIndex}
                      checked={
                        selected === optionIndex
                      }
                      onChange={() =>
                        handleSelect(
                          questionKey,
                          optionIndex
                        )
                      }
                      disabled={
                        Boolean(
                          isSubmitted && isCorrect
                        )
                      }
                      style={{
                        marginRight: '0.5rem',
                      }}
                    />

                    {option}
                  </label>
                );
              })}
            </div>

            {!isSubmitted ? (
              <button
                onClick={() =>
                  handleCheck(questionKey)
                }
                disabled={
                  selected === undefined
                }
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#0021A5',
                  color: 'white',
                  cursor:
                    selected === undefined
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Check Answer
              </button>
            ) : (
              <div
                style={{
                  marginTop: '0.75rem',
                }}
              >
                {isCorrect ? (
                  <div
                    style={{
                      color: '#137333',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                      }}
                    >
                      Correct
                    </p>

                    {q.explanation && (
                      <p>{q.explanation}</p>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      color: '#b3261e',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                      }}
                    >
                      Not quite
                    </p>

                    {q.hint && (
                      <p>
                        <strong>Hint:</strong>{' '}
                        {q.hint}
                      </p>
                    )}

                    {q.explanation && (
                      <p>{q.explanation}</p>
                    )}

                    <button
                      onClick={() =>
                        handleTryAgain(
                          questionKey
                        )
                      }
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.45rem 0.8rem',
                        borderRadius: '6px',
                        border:
                          '1px solid #d0d7de',
                        background: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}