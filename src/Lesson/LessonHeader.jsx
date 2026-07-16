import React from "react";
import styles from "./LessonHeader.module.css";

export default function LessonHeader({
  module,
  title,
  description,
  difficulty,
  duration,
  prerequisites,
}) {
  return (
    <section className={styles.header}>

      <div className={styles.module}>
        {module}
      </div>

      <h1>{title}</h1>

      <p className={styles.description}>
        {description}
      </p>

      <div className={styles.meta}>

        <div className={styles.item}>
          📘
          <span>{difficulty}</span>
        </div>

        <div className={styles.item}>
          ⏱
          <span>{duration}</span>
        </div>

        <div className={styles.item}>
          📚
          <span>{prerequisites}</span>
        </div>

      </div>

    </section>
  );
}