import React, { useState } from 'react';
import styles from './styles.module.css';

type TabItem = {
  label: string;
  title: string;
  description?: string;
  content: React.ReactNode;
};

type Props = {
  items: TabItem[];
};

export default function MiniChartTabs({ items }: Props) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`${styles.tab} ${active === index ? styles.active : ''}`}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        <h3>{current.title}</h3>
        {current.description ? <p className={styles.description}>{current.description}</p> : null}
        <div className={styles.content}>{current.content}</div>
      </div>
    </div>
  );
}