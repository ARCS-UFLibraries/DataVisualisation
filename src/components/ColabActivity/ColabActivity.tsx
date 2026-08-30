import React from 'react';
import { useProgress } from '@site/src/context/ProgressContext';

type ColabActivityProps = {
  pageId: string;
};

export default function ColabActivity({
  pageId,
}: ColabActivityProps) {
  const { progress, completeColab } = useProgress();

  const isCompleted =
    progress[pageId]?.colabCompleted === true;

  const handleComplete = () => {
    completeColab(pageId);
  };

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        border: '1px solid #d0d7de',
        borderRadius: '8px',
        background: 'var(--ifm-background-surface-color)',
      }}
    >
      {isCompleted ? (
        <div
          style={{
            color: '#137333',
            fontWeight: 600,
          }}
        >
          ✓ Colab activity completed
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '0.75rem' }}>
            After completing the activity in Google Colab,
            mark it as complete below.
          </p>

          <button
            type="button"
            onClick={handleComplete}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#0021A5',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Mark Colab Activity Complete
          </button>
        </>
      )}
    </div>
  );
}