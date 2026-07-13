import React from "react";
import styles from "./styles.module.css";

const features = [
  {
    title: "Learn Python",
    description:
      "Build a strong foundation in Python through interactive lessons and hands-on exercises.",
  },
  {
    title: "Work with Real Data",
    description:
      "Learn Pandas by exploring, cleaning, and analyzing real-world datasets.",
  },
  {
    title: "Create Visualizations",
    description:
      "Develop effective charts and visual stories using modern data visualization tools.",
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <div className="col col--4" key={idx}>
              <div className={styles.card}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}