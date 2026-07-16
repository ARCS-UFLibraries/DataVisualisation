import React from 'react';
import styles from './styles.module.css';

type Variant = 'tip' | 'warning' | 'why';

type Props = {
  title: string;
  children: React.ReactNode;
  variant?: Variant;
};

export default function InfoCallout({
  title,
  children,
  variant = 'tip',
}: Props) {
  return (
    <div className={`${styles.callout} ${styles[variant]}`}>
      <div className={styles.header}>{title}</div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}