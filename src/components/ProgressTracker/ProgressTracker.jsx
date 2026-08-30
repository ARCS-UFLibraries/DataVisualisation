import React from "react";
import {
  courseModules,
  coursePages,
} from "../../data/progress/progressConfig";
import {
  getModuleProgress,
  getOverallProgress,
  isPageComplete,
} from "../../data/progress/progressUtils";
import styles from "./ProgressTracker.module.css";

export default function ProgressTracker({ progress = {} }) {
  const overallProgress = getOverallProgress(progress);

  return (
    <div className={styles.progressTracker}>
      <div className={styles.header}>
        <h2>Your Progress</h2>

        <div className={styles.overallProgress}>
          <div className={styles.progressHeader}>
            <span>Course Progress</span>
            <strong>{overallProgress}%</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.modules}>
        {courseModules.map((module) => {
          const moduleProgress = getModuleProgress(
            module.id,
            progress
          );

          const pages = coursePages[module.id] || [];

          const completedPages = pages.filter((pageId) =>
            isPageComplete(module.id, pageId, progress)
          ).length;

          const moduleComplete = moduleProgress === 100;

          return (
            <div
              key={module.id}
              className={`${styles.module} ${
                moduleComplete ? styles.moduleComplete : ""
              }`}
            >
              <div className={styles.moduleHeader}>
                <div>
                  <h3>{module.title}</h3>

                  <span className={styles.pageCount}>
                    {completedPages} / {pages.length} pages complete
                  </span>
                </div>

                <div className={styles.modulePercentage}>
                  {moduleComplete ? "✓" : `${moduleProgress}%`}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>

              <div className={styles.pages}>
                {pages.map((pageId) => {
                  const pageProgress = progress[pageId] || {};

                  const complete = isPageComplete(
                    module.id,
                    pageId,
                    progress
                  );

                  const quizScore = pageProgress.quizScore || 0;

                  const colabComplete =
                    pageProgress.colabCompleted === true;

                  return (
                    <div
                      key={pageId}
                      className={`${styles.page} ${
                        complete ? styles.pageComplete : ""
                      }`}
                    >
                      <div className={styles.pageTitle}>
                        <span className={styles.statusIcon}>
                          {complete ? "✓" : "○"}
                        </span>

                        <span>
                          {formatPageTitle(pageId)}
                        </span>
                      </div>

                      <div className={styles.requirements}>
                        <span
                          className={
                            quizScore === 100
                              ? styles.requirementComplete
                              : styles.requirementIncomplete
                          }
                        >
                          {quizScore === 100 ? "✓" : "○"} Quiz
                          {quizScore > 0 && quizScore < 100
                            ? ` (${quizScore}%)`
                            : ""}
                        </span>

                        {module.colabRequired && (
                          <span
                            className={
                              colabComplete
                                ? styles.requirementComplete
                                : styles.requirementIncomplete
                            }
                          >
                            {colabComplete ? "✓" : "○"} Colab
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {overallProgress === 100 && (
        <div className={styles.completionMessage}>
          <div className={styles.completionIcon}>🎉</div>

          <h3>Congratulations!</h3>

          <p>
            You have completed all required learning activities.
          </p>

          <p className={styles.credentialText}>
            You are now eligible for the Data Visualization
            Foundations credential.
          </p>
        </div>
      )}

      <div className={styles.optionalResources}>
        <h3>Recommended Learning Resources</h3>

        <p>
          These resources are optional and do not affect your
          course completion.
        </p>

        <div className={styles.resourceList}>
          <span>🐙 GitHub</span>
          <span>🧪 Practice Projects</span>
        </div>
      </div>
    </div>
  );
}

function formatPageTitle(pageId) {
  return pageId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}