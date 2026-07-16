import React, { useState } from 'react';

type QuizQuestionProps = {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  explanation: string;
};

export default function QuizQuestion({
  questionNumber,
  question,
  options,
  correctAnswer,
  hint,
  explanation,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selected === correctAnswer;

  const handleCheck = () => {
    if (selected !== null) {
      setChecked(true);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="quiz-question">
      <h3 className="quiz-question__title">
        Question {questionNumber}
      </h3>

      <p className="quiz-question__prompt">{question}</p>

      <div className="quiz-question__options">
        {options.map((option, index) => (
          <label key={index} className="quiz-question__option">
            <input
              type="radio"
              name={`question-${questionNumber}`}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="quiz-question__actions">
        <button type="button" onClick={handleCheck} disabled={selected === null}>
          Check Answer
        </button>
        <button type="button" onClick={handleRetry}>
          Try Again
        </button>
      </div>

      {checked && (
        <div className={`quiz-question__feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
          {isCorrect ? (
            <>
              <p><strong>Correct.</strong></p>
              <p>{explanation}</p>
            </>
          ) : (
            <>
              <p><strong>Not quite.</strong></p>
              {hint && <p><em>Hint:</em> {hint}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}