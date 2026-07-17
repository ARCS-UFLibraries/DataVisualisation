import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

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

export default function ScatterPlaygroundClient({
  title = 'Edit the Code and Watch the Scatter Plot Change',
}: Props) {
  const [xInput, setXInput] = useState('[1, 2, 3, 4, 5]');
  const [yInput, setYInput] = useState('[2, 4, 5, 4, 6]');
  const [sizeInput, setSizeInput] = useState('80');
  const [colorInput, setColorInput] = useState('"#2e6df6"');

  const parsedX = useMemo(() => parseNumberList(xInput), [xInput]);
  const parsedY = useMemo(() => parseNumberList(yInput), [yInput]);

  const pointSize = Number(sizeInput.trim());
  const pointColor = colorInput.trim().replace(/^['"]|['"]$/g, '') || '#2e6df6';

  const isValid =
    parsedX !== null &&
    parsedY !== null &&
    parsedX.length > 0 &&
    parsedY.length > 0 &&
    parsedX.length === parsedY.length &&
    !Number.isNaN(pointSize);

  const xValues = isValid ? parsedX : [1, 2, 3, 4, 5];
  const yValues = isValid ? parsedY : [2, 4, 5, 4, 6];

  const data = useMemo(
    () => [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: pointColor,
          size: pointSize,
        },
      },
    ],
    [xValues, yValues, pointColor, pointSize]
  );

  const generatedCode = `import matplotlib.pyplot as plt

x = ${xInput}
y = ${yInput}

plt.scatter(x, y, s=${sizeInput}, color=${colorInput})
plt.title("Scatter Plot")
plt.xlabel("X Values")
plt.ylabel("Y Values")
plt.show()`;

  const maxX = Math.max(...xValues, 5);
  const minX = Math.min(...xValues, 0);
  const maxY = Math.max(...yValues, 5);
  const minY = Math.min(...yValues, 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the Python code values below. When you change the x and y lists,
          the scatter plot updates so you can study the relationship between two variables.
        </p>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>scatter_plot_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import matplotlib.pyplot as plt</span>
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
            <span className={styles.codeLabel}>size = </span>
            <input
              className={styles.codeInputSmall}
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>color = </span>
            <input
              className={styles.codeInputSmall}
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.scatter(x, y, s=size, color=color)</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.title("Scatter Plot")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.xlabel("X Values")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.ylabel("Y Values")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.show()</span>
          </div>
        </div>

        <p className={styles.helperText}>
          Try changing <code>y</code> to <code>[1, 2, 3, 4, 5]</code> for a positive relationship,
          or <code>[5, 4, 3, 2, 1]</code> for a negative one.
        </p>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure x and y use Python-style lists, have the same number of values,
            and size is a number.
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
            xaxis: {
              title: 'X Values',
              range: [minX - 1, maxX + 1],
            },
            yaxis: {
              title: 'Y Values',
              range: [minY - 1, maxY + 1],
            },
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