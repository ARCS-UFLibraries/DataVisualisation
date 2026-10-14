import React from "react";
import { courseModules } from "../../data/progress/progressConfig";
import {
  getModuleProgress,
  getOverallProgress,
} from "../../data/progress/progressUtils";
import styles from "./ProgressTracker.module.css";

export default function ProgressTracker({ progress = {} }) {
  const overallProgress = getOverallProgress(progress);

  return (
    <div className={styles.progressTracker}>
      {/* Overall Course Progress */}
      <div className={styles.header}>
        <div className={styles.progressHeader}>
          <span>Course Progress</span>
          <strong>{overallProgress}%</strong>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Module Progress */}
      <div className={styles.modules}>
        {courseModules.map((module) => {
          const moduleProgress = getModuleProgress(
            module.id,
            progress
          );

          return (
            <div
              key={module.id}
              className={styles.module}
            >
              <div className={styles.moduleHeader}>
                <span>{module.title}</span>

                <strong>{moduleProgress}%</strong>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${moduleProgress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Completion */}
      {overallProgress === 100 && (
        <div className={styles.completionMessage}>
          <span className={styles.completionIcon}>
            🎉
          </span>

          <div>
            <strong>Course completed!</strong>

            <p>
              You have completed all required learning activities.
            </p>
          </div>
        </div>
      )}

      {/* Recommended Resources */}
      <div className={styles.optionalResources}>
        <h3>Recommended Learning Resources</h3>

        <p>
          These resources are optional and do not affect your
          course completion, but are recommended for additional
          hands-on practice.
        </p>
      </div>
    </div>
  );
}