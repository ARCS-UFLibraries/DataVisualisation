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

export default function BoxplotPlaygroundClient({
  title = 'Edit the Code and Watch the Boxplot Change',
}: Props) {
  const [mathInput, setMathInput] = useState('[65, 68, 70, 72, 75, 78, 80]');
  const [readingInput, setReadingInput] = useState('[60, 62, 64, 66, 69, 71, 73]');
  const [writingInput, setWritingInput] = useState('[55, 58, 60, 63, 65, 67, 70]');
  const [showOutliers, setShowOutliers] = useState(true);

  const math = useMemo(() => parseNumberList(mathInput), [mathInput]);
  const reading = useMemo(() => parseNumberList(readingInput), [readingInput]);
  const writing = useMemo(() => parseNumberList(writingInput), [writingInput]);

  const isValid =
    math !== null &&
    reading !== null &&
    writing !== null &&
    math.length > 0 &&
    reading.length > 0 &&
    writing.length > 0;

  const safeMath = isValid ? math : [65, 68, 70, 72, 75, 78, 80];
  const safeReading = isValid ? reading : [60, 62, 64, 66, 69, 71, 73];
  const safeWriting = isValid ? writing : [55, 58, 60, 63, 65, 67, 70];

  const data = useMemo(
    () => [
      {
        y: safeMath,
        name: 'Math',
        type: 'box',
        boxpoints: showOutliers ? 'outliers' : false,
        marker: { color: '#2563eb' },
      },
      {
        y: safeReading,
        name: 'Reading',
        type: 'box',
        boxpoints: showOutliers ? 'outliers' : false,
        marker: { color: '#16a34a' },
      },
      {
        y: safeWriting,
        name: 'Writing',
        type: 'box',
        boxpoints: showOutliers ? 'outliers' : false,
        marker: { color: '#f97316' },
      },
    ],
    [safeMath, safeReading, safeWriting, showOutliers]
  );

  const generatedCode = `import matplotlib.pyplot as plt

math_scores = ${mathInput}
reading_scores = ${readingInput}
writing_scores = ${writingInput}

plt.boxplot(
    [math_scores, reading_scores, writing_scores],
    labels=["Math", "Reading", "Writing"],
    showfliers=${showOutliers ? 'True' : 'False'}
)
plt.title("Score Distribution Across Subjects")
plt.ylabel("Score")
plt.show()`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the score lists for Math, Reading, and Writing. The boxplot updates so you
          can see how the median, spread, and outliers change.
        </p>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>boxplot_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import matplotlib.pyplot as plt</span>
          </div>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>math_scores = </span>
            <input
              className={styles.codeInput}
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>reading_scores = </span>
            <input
              className={styles.codeInput}
              value={readingInput}
              onChange={(e) => setReadingInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>writing_scores = </span>
            <input
              className={styles.codeInput}
              value={writingInput}
              onChange={(e) => setWritingInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className={styles.codeLine}>
            <span className={styles.staticCode}>
              plt.boxplot(
              [math_scores, reading_scores, writing_scores],
              labels=["Math", "Reading", "Writing"],
              showfliers={showOutliers ? 'True' : 'False'}
              )
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.title("Score Distribution Across Subjects")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.ylabel("Score")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.show()</span>
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showOutliers}
              onChange={(e) => setShowOutliers(e.target.checked)}
            />
            Show outliers
          </label>
        </div>

        <p className={styles.helperText}>
          Try adding one very low or very high score to a subject and see how the whiskers
          and outlier points change.
        </p>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure each subject uses a Python-style list of numbers with at least one value.
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
            margin: { t: 20, r: 20, b: 60, l: 60 },
            yaxis: { title: 'Score' },
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