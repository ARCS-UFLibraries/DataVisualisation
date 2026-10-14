import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';


const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

function parseMatrix(input: string): number[][] | null {
  const trimmed = input.trim();

  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  try {
    const normalized = trimmed.replace(/\s+/g, ' ');
    const parsed = JSON.parse(normalized);

    if (!Array.isArray(parsed) || !parsed.every(Array.isArray)) {
      return null;
    }

    const rowLength = parsed[0]?.length ?? 0;
    if (rowLength === 0) return null;

    const valid = parsed.every(
      (row) =>
        Array.isArray(row) &&
        row.length === rowLength &&
        row.every((value) => typeof value === 'number' && !Number.isNaN(value))
    );

    return valid ? parsed : null;
  } catch {
    return null;
  }
}

function parseStringList(input: string): string[] | null {
  const trimmed = input.trim();

  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every((item) => typeof item === 'string')) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function HeatmapPlaygroundClient({
  title = 'Edit the Code and Watch the Heatmap Change',
}: Props) {
  const [matrixInput, setMatrixInput] = useState(
    '[[65, 70, 75], [68, 72, 78], [66, 74, 80]]'
  );
  const [rowsInput, setRowsInput] = useState('["Math", "Reading", "Writing"]');
  const [colsInput, setColsInput] = useState('["Test 1", "Test 2", "Test 3"]');
  const [showValues, setShowValues] = useState(true);
  const [palette, setPalette] = useState('Blues');

  const matrix = useMemo(() => parseMatrix(matrixInput), [matrixInput]);
  const rowLabels = useMemo(() => parseStringList(rowsInput), [rowsInput]);
  const colLabels = useMemo(() => parseStringList(colsInput), [colsInput]);

  const isValid =
    matrix !== null &&
    rowLabels !== null &&
    colLabels !== null &&
    matrix.length === rowLabels.length &&
    matrix[0].length === colLabels.length;

  const safeMatrix = isValid
    ? matrix
    : [
        [65, 70, 75],
        [68, 72, 78],
        [66, 74, 80],
      ];

  const safeRows = isValid ? rowLabels : ['Math', 'Reading', 'Writing'];
  const safeCols = isValid ? colLabels : ['Test 1', 'Test 2', 'Test 3'];

  const colorscale =
    palette === 'coolwarm'
      ? [
          [0, '#3b4cc0'],
          [0.5, '#f7f7f7'],
          [1, '#b40426'],
        ]
      : palette === 'Viridis'
      ? 'Viridis'
      : 'Blues';

  const data = useMemo(
    () => [
      {
        z: safeMatrix,
        x: safeCols,
        y: safeRows,
        type: 'heatmap',
        colorscale,
        text: showValues
          ? safeMatrix.map((row) => row.map((value) => String(value)))
          : undefined,
        texttemplate: showValues ? '%{text}' : undefined,
        textfont: { color: '#111827', size: 13 },
        hoverongaps: false,
      },
    ],
    [safeMatrix, safeCols, safeRows, palette, showValues]
  );

  const generatedCode = `import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame(
    ${matrixInput},
    index=${rowsInput},
    columns=${colsInput}
)

sns.heatmap(df, annot=${showValues ? 'True' : 'False'}, cmap="${palette}")
plt.title("Scores Across Tests")
plt.show()`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the matrix and labels below. When you change the values, the heatmap
          updates so you can see how color represents magnitude across a grid.
        </p>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>heatmap_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import seaborn as sns</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import pandas as pd</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import matplotlib.pyplot as plt</span>
          </div>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>data = </span>
            <textarea
              className={styles.codeTextarea}
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              spellCheck={false}
              rows={4}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>rows = </span>
            <input
              className={styles.codeInput}
              value={rowsInput}
              onChange={(e) => setRowsInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>columns = </span>
            <input
              className={styles.codeInput}
              value={colsInput}
              onChange={(e) => setColsInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className={styles.codeLine}>
            <span className={styles.staticCode}>df = pd.DataFrame(data, index=rows, columns=columns)</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>sns.heatmap(df, annot=True, cmap="Blues")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.title("Scores Across Tests")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.show()</span>
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            Show annotations
          </label>

          <label className={styles.paletteLabel}>
            Color palette
            <select
              className={styles.select}
              value={palette}
              onChange={(e) => setPalette(e.target.value)}
            >
              <option value="Blues">Blues</option>
              <option value="Viridis">Viridis</option>
              <option value="coolwarm">coolwarm</option>
            </select>
          </label>
        </div>

        <p className={styles.helperText}>
          Try increasing values across columns to create a left-to-right pattern, or change one cell sharply to create a standout hotspot.
        </p>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure the matrix is a valid list of equal-length rows, and that row and column labels match the matrix shape.
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
            margin: { t: 20, r: 20, b: 60, l: 80 },
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div className={styles.outputPanel}>
        <h4>Seaborn code</h4>
        <pre className={styles.generatedCode}>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}