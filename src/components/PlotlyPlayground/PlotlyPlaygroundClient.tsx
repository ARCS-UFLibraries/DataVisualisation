import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type ChartType = 'bar' | 'line' | 'scatter';

type Props = {
  title?: string;
};

function parseStringList(input: string): string[] | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function parseNumberList(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export default function PlotlyPlaygroundClient({
  title = 'Edit the Code and Explore the Interactive Chart',
}: Props) {
  const [chartType, setChartType] = useState<ChartType>('scatter');
  const [xInput, setXInput] = useState('["A", "B", "C", "D"]');
  const [yInput, setYInput] = useState('[65, 72, 68, 80]');
  const [hoverInput, setHoverInput] = useState('["Student A", "Student B", "Student C", "Student D"]');
  const [chartTitle, setChartTitle] = useState('Interactive Score Chart');
  const [showHover, setShowHover] = useState(true);

  const xValues = useMemo(() => parseStringList(xInput), [xInput]);
  const yValues = useMemo(() => parseNumberList(yInput), [yInput]);
  const hoverValues = useMemo(() => parseStringList(hoverInput), [hoverInput]);

  const isValid =
    xValues !== null &&
    yValues !== null &&
    xValues.length === yValues.length &&
    (!showHover || (hoverValues !== null && hoverValues.length === yValues.length));

  const safeX = isValid ? xValues! : ['A', 'B', 'C', 'D'];
  const safeY = isValid ? yValues! : [65, 72, 68, 80];
  const safeHover = isValid && hoverValues ? hoverValues : ['Student A', 'Student B', 'Student C', 'Student D'];

  const trace = useMemo(() => {
    const base: any = {
      x: safeX,
      y: safeY,
      type: chartType === 'bar' ? 'bar' : 'scatter',
      mode: chartType === 'line' ? 'lines+markers' : chartType === 'scatter' ? 'markers' : undefined,
      marker: {
        color: chartType === 'bar' ? ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'] : '#2563eb',
        size: chartType === 'scatter' ? 12 : undefined,
      },
      line: {
        color: '#2563eb',
        width: 3,
      },
    };

    if (showHover) {
      base.text = safeHover;
      base.hovertemplate =
        chartType === 'scatter'
          ? '<b>%{text}</b><br>X: %{x}<br>Y: %{y}<extra></extra>'
          : '<b>%{text}</b><br>%{x}: %{y}<extra></extra>';
    }

    return base;
  }, [safeX, safeY, safeHover, chartType, showHover]);

  const generatedCode = `import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "x": ${xInput},
    "y": ${yInput},
    "label": ${hoverInput}
})

fig = px.${chartType}(
    df,
    x="x",
    y="y",
    title="${chartTitle}"${showHover ? `,
    hover_name="label"` : ''}
)

fig.show()`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Change the chart type, edit the values, and hover over the chart to see how Plotly
          makes data exploration more interactive.
        </p>
      </div>

      <div className={styles.controls}>
        <label>
          Chart type
          <select
            className={styles.select}
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="scatter">Scatter</option>
          </select>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showHover}
            onChange={(e) => setShowHover(e.target.checked)}
          />
          Show hover labels
        </label>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>plotly_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import plotly.express as px</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import pandas as pd</span>
          </div>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>x = </span>
            <input
              className={styles.codeInput}
              value={xInput}
              onChange={(e) => setXInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>y = </span>
            <input
              className={styles.codeInput}
              value={yInput}
              onChange={(e) => setYInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>labels = </span>
            <input
              className={styles.codeInput}
              value={hoverInput}
              onChange={(e) => setHoverInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>title = </span>
            <input
              className={styles.codeInput}
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure x, y, and hover label lists are valid and have the same length.
          </p>
        ) : null}
      </div>

      <div className={styles.chartBox}>
        <Plot
          data={[trace] as any}
          layout={{
            autosize: true,
            title: { text: chartTitle },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { t: 50, r: 20, b: 60, l: 50 },
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{ responsive: true }}
        />
      </div>

      <div className={styles.outputPanel}>
        <h4>Plotly Express code</h4>
        <pre className={styles.generatedCode}>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}