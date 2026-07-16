import React from 'react';
import styles from './styles.module.css';

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function ChartShowcaseCard({ title, description, children }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}