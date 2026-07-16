import React from 'react';
import styles from './styles.module.css';

type PanelItem = {
  title: string;
  note?: string;
  children: React.ReactNode;
};

type Props = {
  left: PanelItem;
  right: PanelItem;
};

export default function ChartComparePanel({ left, right }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.panel}>
        <h3>{left.title}</h3>
        {left.note ? <p className={styles.note}>{left.note}</p> : null}
        <div className={styles.chartArea}>{left.children}</div>
      </div>
      <div className={styles.panel}>
        <h3>{right.title}</h3>
        {right.note ? <p className={styles.note}>{right.note}</p> : null}
        <div className={styles.chartArea}>{right.children}</div>
      </div>
    </div>
  );
}