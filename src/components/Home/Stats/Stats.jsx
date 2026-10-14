import React from "react";
import styles from "./Stats.module.css";

const stats = [
  {
    number: "45+",
    label: "Lessons",
  },
  {
    number: "20+",
    label: "Hands-on Exercises",
  },
  {
    number: "15+",
    label: "Interactive Charts",
  },
  {
    number: "4",
    label: "Learning Modules",
  },
  {
    number: "1",
    label: "Capstone Project",
  },
];

export default function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        {stats.map((item) => (
          <div className={styles.card} key={item.label}>
            <h2>{item.number}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}