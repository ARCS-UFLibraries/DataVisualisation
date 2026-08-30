import React, { useState } from "react";
import { useProgress } from "@site/src/context/ProgressContext";
import { getOverallProgress } from "@site/src/data/progress/progressUtils";
import ProgressTracker from "@site/src/components/ProgressTracker/ProgressTracker";
import styles from "./NavbarProgress.module.css";

export default function NavbarProgress() {
  const { progress } = useProgress();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={styles.progressButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="View course progress"
        aria-expanded={open}
      >
        <span className={styles.label}>Progress</span>

        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${getOverallProgress(progress)}%`,
            }}
          />
        </div>

        <span className={styles.percentage}>
          {getOverallProgress(progress)}%
        </span>
      </button>

      {open && (
        <div className={styles.popover}>
          <ProgressTracker progress={progress} />
        </div>
      )}
    </div>
  );
}

