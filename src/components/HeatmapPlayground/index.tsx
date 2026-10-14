import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function HeatmapPlayground({
  title = 'Edit the Code and Watch the Heatmap Change',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive heatmap…</div>}>
      {() => {
        const HeatmapPlaygroundClient = require('./HeatmapPlaygroundClient').default;
        return <HeatmapPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}