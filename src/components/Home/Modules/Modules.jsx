import React from "react";
import Link from "@docusaurus/Link";
import styles from "./Modules.module.css";

const modules = [
  {
    title: "Getting Started",
    lessons: "Learn Google Colab, Python basics, and prepare your environment.",
    link: "/docs/getting-started/welcome-python",
  },
  {
    title: "Python Essentials",
    lessons: "Variables, data types, functions, collections, loops, and control flow.",
    link: "/docs/python-essentials/variables",
  },
  {
    title: "Working with Data",
    lessons: "Load, clean, explore, transform, and analyse real-world datasets.",
    link: "/docs/working-with-data/data-visualization",
  },
  {
    title: "Data Visualization",
    lessons: "Create professional charts with Matplotlib, Seaborn, and Plotly.",
    link: "/docs/data-viz/introduction-to-data-visualisation",
  },
];

export default function Modules() {
  return (
    <section className={styles.modules}>
      <div className={styles.container}>

        <div className={styles.heading}>
          <h2>Explore the Guide</h2>
          <p>
            Learn step by step through structured modules designed to build
            practical data science skills.
          </p>
        </div>

        <div className={styles.grid}>
          {modules.map((module) => (
            <div className={styles.card} key={module.title}>
              <h3>{module.title}</h3>

              <p>{module.lessons}</p>

              <Link to={module.link}>
                Explore →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}