import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function LinePlayground({
  title = 'Edit the Code and Watch the Line Chart Change',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive line chart…</div>}>
      {() => {
        const LinePlaygroundClient = require('./LinePlaygroundClient').default;
        return <LinePlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}