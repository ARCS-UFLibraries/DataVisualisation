import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function ScatterPlayground({
  title = 'Edit the Code and Watch the Scatter Plot Change',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive scatter plot…</div>}>
      {() => {
        const ScatterPlaygroundClient = require('./ScatterPlaygroundClient').default;
        return <ScatterPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}