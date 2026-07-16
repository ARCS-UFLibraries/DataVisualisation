import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

export default function ChartPlaygroundClient({
  title = 'Explore How Bar Values Change the Chart',
}: Props) {
  const [valueA, setValueA] = useState(64);
  const [valueB, setValueB] = useState(69);
  const [valueC, setValueC] = useState(72);
  const [color, setColor] = useState('#2e6df6');
  const [showLabels, setShowLabels] = useState(true);

  const categories = ['Group A', 'Group B', 'Group C'];
  const values = [valueA, valueB, valueC];

  const data = useMemo(
    () => [
      {
        x: categories,
        y: values,
        type: 'bar',
        marker: { color },
        text: showLabels ? values.map((v) => String(v)) : undefined,
        textposition: showLabels ? 'outside' : undefined,
        cliponaxis: false,
      },
    ],
    [valueA, valueB, valueC, color, showLabels]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Change the values below and watch how the height of each bar changes.
          This helps you see how a bar chart represents category comparisons.
        </p>
      </div>

      <div className={styles.controls}>
        <label>
          Group A
          <input
            type="range"
            min="0"
            max="100"
            value={valueA}
            onChange={(e) => setValueA(Number(e.target.value))}
          />
          <span>{valueA}</span>
        </label>

        <label>
          Group B
          <input
            type="range"
            min="0"
            max="100"
            value={valueB}
            onChange={(e) => setValueB(Number(e.target.value))}
          />
          <span>{valueB}</span>
        </label>

        <label>
          Group C
          <input
            type="range"
            min="0"
            max="100"
            value={valueC}
            onChange={(e) => setValueC(Number(e.target.value))}
          />
          <span>{valueC}</span>
        </label>

        <label>
          Bar Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          Show value labels
        </label>
      </div>

      <div className={styles.chartBox}>
        <Plot
          data={data as any}
          layout={{
            autosize: true,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { t: 20, r: 20, b: 50, l: 50 },
            yaxis: {
              range: [0, 110],
              title: 'Value',
            },
            xaxis: {
              title: 'Category',
            },
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
}