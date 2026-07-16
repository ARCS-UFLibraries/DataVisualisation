import React from 'react';
import styles from './styles.module.css';

type Props = {
  title: string;
  items: string[];
};

export default function ChartInsightCallout({ title, items }: Props) {
  return (
    <div className={styles.callout}>
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}