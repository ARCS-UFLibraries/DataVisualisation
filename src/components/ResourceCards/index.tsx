import React from 'react';
import styles from './styles.module.css';

type ResourceItem = {
  title: string;
  description: string;
  href: string;
  label?: string;
};

type Props = {
  items: ResourceItem[];
};

export default function ResourceCards({ items }: Props) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          {item.label ? <span className={styles.label}>{item.label}</span> : null}
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </a>
      ))}
    </div>
  );
}