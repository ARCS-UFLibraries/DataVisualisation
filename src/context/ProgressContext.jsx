import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useUser } from "@clerk/react";
import { SupabaseContext } from "@site/src/lib/supabaseClient";

import { coursePages } from "@site/src/data/progress/progressConfig";
import { isPageComplete } from "@site/src/data/progress/progressUtils";

const ProgressContext = createContext(null);

const STORAGE_KEY = "data-visualisation-progress";

function getModuleIdForPage(pageId) {
  for (const [moduleId, pages] of Object.entries(coursePages)) {
    if (pages.includes(pageId)) {
      return moduleId;
    }
  }

  return null;
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [localProgressLoaded, setLocalProgressLoaded] = useState(false);

  const supabase = useContext(SupabaseContext);
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  const syncedUserId = useRef(null);

  // --------------------------------------------------
  // Load existing progress from the browser
  // --------------------------------------------------
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Unable to load saved progress:", error);
    } finally {
      setLocalProgressLoaded(true);
    }
  }, []);

  // --------------------------------------------------
  // Load progress from Supabase for signed-in users
  // --------------------------------------------------
  useEffect(() => {
    if (!localProgressLoaded) return;
    if (!userLoaded) return;

    if (!isSignedIn || !user || !supabase) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === user.id) return;

    let cancelled = false;

    const loadProgressFromSupabase = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("page_id, quiz_score, colab_completed")
        .eq("student_id", user.id);

      if (error) {
        console.error("Unable to load progress from Supabase:", error);
        return;
      }

      if (cancelled) return;

      // Convert Supabase rows into the same format
      // that the existing ProgressContext uses.
      const databaseProgress = {};

      for (const row of data || []) {
        databaseProgress[row.page_id] = {
          quizScore: row.quiz_score,
          colabCompleted: row.colab_completed,
        };
      }

      // If the account already has saved progress,
      // use it while keeping any local-only pages.
      if (Object.keys(databaseProgress).length > 0) {
        setProgress((currentProgress) => ({
          ...currentProgress,
          ...databaseProgress,
        }));
      } else {
        // First time this user is connecting:
        // save their existing browser progress to Supabase.
        const currentProgress = progress;

        const rows = Object.entries(progress).map(
          ([pageId, pageProgress]) => {
            const moduleId = getModuleIdForPage(pageId);

            const completed =
              moduleId !== null
                ? isPageComplete(
                    moduleId,
                    pageId,
                    progress
                  )
                : false;

            return {
              student_id: user.id,
              page_id: pageId,
              quiz_score:
                typeof pageProgress.quizScore === "number"
                  ? pageProgress.quizScore
                  : null,
              colab_completed:
                pageProgress.colabCompleted === true,
              completed,
              updated_at: new Date().toISOString(),
            };
          }
        );

        if (rows.length > 0) {
          const { error: uploadError } = await supabase
            .from("progress")
            .upsert(rows, {
              onConflict: "student_id,page_id",
            });

          if (uploadError) {
            console.error("Unable to upload existing progress:", uploadError);
            return;
          }
        }
      }

      syncedUserId.current = user.id;
      console.log("Progress synced with Supabase.");
    };

    loadProgressFromSupabase();

    return () => {
      cancelled = true;
    };
  }, [localProgressLoaded, userLoaded, isSignedIn, user, supabase, progress]);

  // --------------------------------------------------
  // Save progress locally and to Supabase
  // --------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Unable to save progress:", error);
    }

    // Do not send anything to Supabase if the student
    // is not signed in or their account has not been synced yet.
    if (
      !userLoaded ||
      !isSignedIn ||
      !user ||
      !supabase ||
      syncedUserId.current !== user.id
    ) {
      return;
    }

    const rows = Object.entries(progress).map(
      ([pageId, pageProgress]) => {
        const moduleId = getModuleIdForPage(pageId);

        const completed =
          moduleId !== null
            ? isPageComplete(moduleId, pageId, progress)
            : false;

        return {
          student_id: user.id,
          page_id: pageId,
          quiz_score:
            typeof pageProgress.quizScore === "number"
              ? pageProgress.quizScore
              : null,
          colab_completed: pageProgress.colabCompleted === true,
          completed,
          updated_at: new Date().toISOString(),
        };
      },
    );

    if (rows.length === 0) return;

    const saveProgressToSupabase = async () => {
      const { error } = await supabase.from("progress").upsert(rows, {
        onConflict: "student_id,page_id",
      });

      if (error) {
        console.error("Unable to save progress to Supabase:", error);
        return;
      }

      console.log("Progress saved to Supabase.");
    };

    saveProgressToSupabase();
  }, [progress, userLoaded, isSignedIn, user, supabase]);

  // --------------------------------------------------
  // Existing progress functions
  // --------------------------------------------------
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
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}
