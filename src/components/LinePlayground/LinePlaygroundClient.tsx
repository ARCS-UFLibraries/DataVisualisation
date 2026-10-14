import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

function parseStringList(input: string): string[] | null {
  const trimmed = input.trim();

  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  return inner
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function parseNumberList(input: string): number[] | null {
  const trimmed = input.trim();

  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  const parts = inner.split(',').map((part) => part.trim());
  const values = parts.map((part) => Number(part));

  if (values.some((value) => Number.isNaN(value))) {
    return null;
  }

  return values;
}

export default function LinePlaygroundClient({
  title = 'Edit the Code and Watch the Line Chart Change',
}: Props) {
  const [monthsInput, setMonthsInput] = useState('["Jan", "Feb", "Mar", "Apr"]');
  const [salesInput, setSalesInput] = useState('[50, 55, 52, 60]');
  const [markerInput, setMarkerInput] = useState('"o"');

  const parsedMonths = useMemo(() => parseStringList(monthsInput), [monthsInput]);
  const parsedSales = useMemo(() => parseNumberList(salesInput), [salesInput]);

  const marker = markerInput.trim().replace(/^['"]|['"]$/g, '') || 'o';

  const isValid =
    parsedMonths !== null &&
    parsedSales !== null &&
    parsedMonths.length > 0 &&
    parsedSales.length > 0 &&
    parsedMonths.length === parsedSales.length;

  const xValues = isValid ? parsedMonths : ['Jan', 'Feb', 'Mar', 'Apr'];
  const yValues = isValid ? parsedSales : [50, 55, 52, 60];

  const data = useMemo(
    () => [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#2e6df6', width: 3 },
        marker: { color: '#2e6df6', size: 9, symbol: 'circle' },
      },
    ],
    [xValues, yValues]
  );

  const generatedCode = `import matplotlib.pyplot as plt

months = ${monthsInput}
sales = ${salesInput}

plt.plot(months, sales, marker=${markerInput})
plt.title("Monthly Sales Trend")
plt.xlabel("Month")
plt.ylabel("Sales")
plt.show()`;

  const maxY = Math.max(...yValues, 10);
  const minY = Math.min(...yValues, 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the Python code values below. When you change the lists, the line chart
          updates so you can see how trend data works.
        </p>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>line_chart_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import matplotlib.pyplot as plt</span>
          </div>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>months = </span>
            <input
              className={styles.codeInput}
              value={monthsInput}
              onChange={(e) => setMonthsInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>sales = </span>
            <input
              className={styles.codeInput}
              value={salesInput}
              onChange={(e) => setSalesInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>marker = </span>
            <input
              className={styles.codeInputSmall}
              value={markerInput}
              onChange={(e) => setMarkerInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.plot(months, sales, marker=marker)</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.title("Monthly Sales Trend")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.xlabel("Month")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.ylabel("Sales")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.show()</span>
          </div>
        </div>

        <p className={styles.helperText}>
          Try changing <code>sales</code> to <code>[40, 60, 45, 80]</code> or <code>[70, 68, 66, 64]</code>.
        </p>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure both lists use Python-style brackets and have the same number of values.
          </p>
        ) : null}
      </div>

      <div className={styles.chartBox}>
        <Plot
          data={data as any}
          layout={{
            autosize: true,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { t: 20, r: 20, b: 60, l: 50 },
            xaxis: { title: 'Month' },
            yaxis: { title: 'Sales', range: [Math.min(0, minY - 5), maxY + 10] },
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div className={styles.outputPanel}>
        <h4>Matplotlib code</h4>
        <pre className={styles.generatedCode}>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}