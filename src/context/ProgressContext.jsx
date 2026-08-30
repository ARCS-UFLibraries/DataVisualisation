import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ProgressContext = createContext(null);

const STORAGE_KEY = "data-visualisation-progress";

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error(
        "Unable to load saved progress:",
        error
      );
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error(
        "Unable to save progress:",
        error
      );
    }
  }, [progress]);

  const updatePageProgress = (pageId, updates) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      [pageId]: {
        ...currentProgress[pageId],
        ...updates,
      },
    }));
  };

  const completeQuiz = (pageId, score) => {
    updatePageProgress(pageId, {
      quizScore: score,
    });
  };

  const completeColab = (pageId) => {
    updatePageProgress(pageId, {
      colabCompleted: true,
    });
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setProgress,
        updatePageProgress,
        completeQuiz,
        completeColab,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error(
      "useProgress must be used inside ProgressProvider"
    );
  }

  return context;
}