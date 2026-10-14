import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function HistogramPlayground({
  title = 'Edit the Code and Watch the Histogram Change',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive histogram…</div>}>
      {() => {
        const HistogramPlaygroundClient = require('./HistogramPlaygroundClient').default;
        return <HistogramPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}