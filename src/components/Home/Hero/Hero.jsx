import React from "react";
import Link from "@docusaurus/Link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        <div className={styles.left}>

          <span className={styles.badge}>
            DATA VISUALISATION GUIDE
          </span>

          <h1>
            Turn Data Into
            <br />
            Clear Visual Stories
          </h1>

          <p>
            Learn Python, data analysis, and modern data visualization through
            interactive lessons, Google Colab notebooks, real-world datasets,
            quizzes, and guided projects. Whether you're a complete beginner or
            looking to strengthen your analytical skills, this guide helps you
            build confidence one lesson at a time.
          </p>

          <Link
            className={styles.button}
            to="/docs/getting-started/welcome-python"
          >
            Start Learning
          </Link>

        </div>

        <div className={styles.right}>

          <img
            src="src\components\Home\Gallery\Homepage.png"
            alt="Home page Illustration"
          />

        </div>

      </div>
    </section>
  );
}