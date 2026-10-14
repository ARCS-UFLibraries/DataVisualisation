import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function BoxplotPlayground({
  title = 'Edit the Code and Watch the Boxplot Change',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive boxplot…</div>}>
      {() => {
        const BoxplotPlaygroundClient = require('./BoxplotPlaygroundClient').default;
        return <BoxplotPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}