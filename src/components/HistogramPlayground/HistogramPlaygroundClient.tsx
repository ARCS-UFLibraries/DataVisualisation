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

export default function HistogramPlaygroundClient({
  title = 'Edit the Code and Watch the Histogram Change',
}: Props) {
  const [dataInput, setDataInput] = useState('[55, 60, 62, 65, 65, 68, 70, 72, 75, 78, 80, 82]');
  const [binsInput, setBinsInput] = useState('5');
  const [colorInput, setColorInput] = useState('"#2e6df6"');

  const parsedData = useMemo(() => parseNumberList(dataInput), [dataInput]);
  const bins = Number(binsInput.trim());
  const barColor = colorInput.trim().replace(/^['"]|['"]$/g, '') || '#2e6df6';

  const isValid =
    parsedData !== null &&
    parsedData.length > 0 &&
    !Number.isNaN(bins) &&
    bins > 0;

  const safeData = isValid
    ? parsedData
    : [55, 60, 62, 65, 65, 68, 70, 72, 75, 78, 80, 82];

  const safeBins = isValid ? bins : 5;

  const data = useMemo(
    () => [
      {
        x: safeData,
        type: 'histogram',
        nbinsx: safeBins,
        marker: {
          color: barColor,
          line: {
            color: '#ffffff',
            width: 1,
          },
        },
      },
    ],
    [safeData, safeBins, barColor]
  );

  const generatedCode = `import matplotlib.pyplot as plt

scores = ${dataInput}

plt.hist(scores, bins=${binsInput}, color=${colorInput}, edgecolor="black")
plt.title("Score Distribution")
plt.xlabel("Score")
plt.ylabel("Frequency")
plt.show()`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>
          Edit the Python code values below. Change the data list or the number of bins
          and watch how the histogram shape changes.
        </p>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>histogram_demo.py</div>

        <div className={styles.codeEditor}>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>import matplotlib.pyplot as plt</span>
          </div>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>scores = </span>
            <input
              className={styles.codeInput}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              spellCheck={false}
            />
          </label>

          <label className={styles.codeLine}>
            <span className={styles.codeLabel}>bins = </span>
            <input
              className={styles.codeInputSmall}
              value={binsInput}
              onChange={(e) => setBinsInput(e.target.value)}
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
            <span className={styles.staticCode}>plt.hist(scores, bins=bins, color=color, edgecolor="black")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.title("Score Distribution")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.xlabel("Score")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.ylabel("Frequency")</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.staticCode}>plt.show()</span>
          </div>
        </div>

        <p className={styles.helperText}>
          Try changing <code>bins</code> from <code>5</code> to <code>10</code>, or add more low or high values to the list.
        </p>

        {!isValid ? (
          <p className={styles.errorText}>
            Make sure the data uses a Python-style list of numbers and bins is a positive number.
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
            xaxis: { title: 'Score' },
            yaxis: { title: 'Frequency' },
            bargap: 0.05,
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div className={styles.outputPanel}>
        <h4>Matplotlib code</h4>
        <pre className={styles.generatedCode}>
          {generatedCode}
        </pre>
      </div>
    </div>
  );
}