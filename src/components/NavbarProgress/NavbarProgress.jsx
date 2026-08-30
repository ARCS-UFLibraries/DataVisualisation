import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@site/src/context/ProgressContext";
import { getOverallProgress } from "@site/src/data/progress/progressUtils";
import ProgressTracker from "@site/src/components/ProgressTracker/ProgressTracker";
import styles from "./NavbarProgress.module.css";

export default function NavbarProgress() {
  const { progress } = useProgress();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const containerRef = useRef(null);

  const overallProgress = getOverallProgress(progress);

  const isOpen = isHovered || isClicked;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsClicked((previous) => !previous);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={styles.progressButton}
        onClick={handleClick}
        aria-label="View course progress"
        aria-expanded={isOpen}
      >
        <span className={styles.label}>
          Progress
        </span>

        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>

        <span className={styles.percentage}>
          {overallProgress}%
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.popover}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <ProgressTracker progress={progress} />
        </div>
      )}
    </div>
  );
}