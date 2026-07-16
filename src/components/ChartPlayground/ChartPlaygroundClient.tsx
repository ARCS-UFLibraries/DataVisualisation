import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

function parsePythonList(input: string): number[] | null {
  const trimmed = input.trim();

  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  const parts = inner.split(',').map((part) => part.trim());
  const numbers = parts.map((part) => Number(part));

  if (numbers.some((num) => Number.isNaN(num))) {
    return null;
  }

  return numbers;
}

export default function ChartPlaygroundClient({
  title = 'Change Python Values and Watch the Bars Update',
}: Props) {
  const [valuesInput, setValuesInput] = useState('[64, 69, 72]');
  const [labelsInput, setLabelsInput] = useState("['Group A', 'Group B', 'Group C']");
  const [color, setColor] = useState('#2e6df6');
  const [showLabels, setShowLabels] = useState(true);

  const parsedValues = useMemo(() => parsePythonList(valuesInput), [valuesInput]);

  const categories = useMemo(() => {
    const fallback = ['Group A', 'Group B', 'Group C'];
    const trimmed = labelsInput.trim();

    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return fallback;
    }

    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return fallback;
    }

    return inner
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }, [labelsInput]);

  const values = parsedValues ?? [64, 69, 72];
  const safeCategories =
    categories.length === values.length
      ? categories
      : values.map((_, index) => `Group ${index + 1}`);

  const data = useMemo(
    () => [
      {
        x: safeCategories,
        y: values,
        type: 'bar',
        marker: { color },
        text: showLabels ? values.map((v) => String(v)) : undefined,
        textposition: showLabels ? 'outside' : undefined,
        cliponaxis: false,
      },
    ],
    [safeCategories, values, color, showLabels]
  );

  const maxValue = Math.max(...values, 10);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the Python-style list below to change the data. This helps you see
          how changing values in code changes the output chart.
        </p>
      </div>

      <div className={styles.codePanel}>
        <div className={styles.fakeCodeHeader}>
          <span>bar_chart_demo.py</span>
        </div>

        <div className={styles.codeBlock}>
          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>categories = </span>
            <input
              className={styles.codeInput}
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>values = </span>
            <input
              className={styles.codeInput}
              value={valuesInput}
              onChange={(e) => setValuesInput(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>

        <p className={styles.helperText}>
          Try examples like <code>[20, 45, 90]</code> or <code>[55, 55, 55]</code>.
        </p>

        {parsedValues === null ? (
          <p className={styles.errorText}>
            Enter values as a Python-style list of numbers, for example: <code>[64, 69, 72]</code>
          </p>
        ) : null}
      </div>

      <div className={styles.controls}>
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
            margin: { t: 20, r: 20, b: 60, l: 50 },
            yaxis: {
              range: [0, maxValue + 15],
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