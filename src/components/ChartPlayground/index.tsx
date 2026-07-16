import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function ChartPlayground({
  title = 'Explore How Bar Values Change the Chart',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive chart…</div>}>
      {() => {
        const ChartPlaygroundClient = require('./ChartPlaygroundClient').default;
        return <ChartPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}