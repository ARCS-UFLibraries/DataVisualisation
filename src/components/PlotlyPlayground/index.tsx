import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

type Props = {
  title?: string;
};

export default function PlotlyPlayground({
  title = 'Edit the Code and Explore the Interactive Chart',
}: Props) {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading interactive Plotly chart…</div>}>
      {() => {
        const PlotlyPlaygroundClient = require('./PlotlyPlaygroundClient').default;
        return <PlotlyPlaygroundClient title={title} />;
      }}
    </BrowserOnly>
  );
}