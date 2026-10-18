import React, { useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import styles from './styles.module.css';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  title?: string;
};

const PRESETS = [
  {
    name: 'Gender Comparison',
    labels: "['Female', 'Male']",
    values: '[63.6, 68.7]',
    color: '#0021A5',
    orientation: 'v' as const,
  },
  {
    name: 'Lunch Programs',
    labels: "['Standard', 'Free/Reduced']",
    values: '[645, 355]',
    color: '#FA4616',
    orientation: 'v' as const,
  },
  {
    name: 'Parental Education',
    labels: "['High School', 'Some College', 'Bachelors', 'Masters']",
    values: '[62.1, 67.1, 73.3, 75.9]',
    color: '#2563EB',
    orientation: 'v' as const,
  },
  {
    name: 'Balanced Cohort',
    labels: "['Group A', 'Group B', 'Group C']",
    values: '[50, 50, 50]',
    color: '#059669',
    orientation: 'v' as const,
  },
];

function parsePythonList(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  const parts = inner.split(',').map((part) => part.trim());
  const numbers = parts.map((part) => Number(part));
  if (numbers.some((num) => Number.isNaN(num))) return null;
  return numbers;
}

export default function ChartPlaygroundClient({
  title = 'Interactive Bar Chart Studio',
}: Props) {
  const [valuesInput, setValuesInput] = useState('[63.6, 68.7]');
  const [labelsInput, setLabelsInput] = useState("['Female', 'Male']");
  const [color, setColor] = useState('#0021A5');
  const [showLabels, setShowLabels] = useState(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [orientation, setOrientation] = useState<'v' | 'h'>('v');
  const [copied, setCopied] = useState(false);

  const parsedValues = useMemo(() => parsePythonList(valuesInput), [valuesInput]);

  const rawCategories = useMemo(() => {
    const fallback = ['Category A', 'Category B'];
    const trimmed = labelsInput.trim();
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return fallback;
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return fallback;
    return inner
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }, [labelsInput]);

  // Combined sorted data
  const { categories, values } = useMemo(() => {
    const vals = parsedValues ?? [60, 70];
    const cats =
      rawCategories.length === vals.length
        ? rawCategories
        : vals.map((_, index) => `Group ${index + 1}`);

    const paired = cats.map((c, i) => ({ cat: c, val: vals[i] ?? 0 }));

    if (sortOrder === 'asc') {
      paired.sort((a, b) => a.val - b.val);
    } else if (sortOrder === 'desc') {
      paired.sort((a, b) => b.val - a.val);
    }

    return {
      categories: paired.map((p) => p.cat),
      values: paired.map((p) => p.val),
    };
  }, [parsedValues, rawCategories, sortOrder]);

  const data = useMemo(
    () => [
      {
        x: orientation === 'v' ? categories : values,
        y: orientation === 'v' ? values : categories,
        type: 'bar',
        orientation: orientation,
        marker: { color },
        text: showLabels ? values.map((v) => String(v)) : undefined,
        textposition: showLabels ? 'outside' : undefined,
        cliponaxis: false,
      },
    ],
    [categories, values, color, showLabels, orientation]
  );

  const maxValue = Math.max(...values, 10);

  const pythonCode = `# Generated Matplotlib Code
import matplotlib.pyplot as plt

categories = ${labelsInput}
values = ${valuesInput}

plt.figure(figsize=(8, 4))
bars = plt.${orientation === 'v' ? 'bar' : 'barh'}(categories, values, color="${color}")
plt.title("Category Comparison", fontweight="bold")
plt.xlabel("${orientation === 'v' ? 'Category' : 'Value'}")
plt.ylabel("${orientation === 'v' ? 'Value' : 'Category'}")
${showLabels ? 'plt.bar_label(bars, padding=3)' : ''}
plt.tight_layout()
plt.show()`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setLabelsInput(preset.labels);
    setValuesInput(preset.values);
    setColor(preset.color);
    setOrientation(preset.orientation);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3>{title}</h3>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopyCode}
          >
            {copied ? '✓ Code Copied' : 'Copy Python Code'}
          </button>
        </div>
        <p>
          Tweak values, sort order, orientation, or pick a dataset preset. See how code parameters transform the visualization in real-time.
        </p>
      </div>

      {/* Dataset Presets */}
      <div className={styles.presetBar}>
        <span className={styles.presetLabel}>Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={styles.presetBtn}
            onClick={() => applyPreset(p)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.codePanel}>
        <div className={styles.fakeCodeHeader}>
          <span>bar_chart_generator.py</span>
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

        {parsedValues === null ? (
          <p className={styles.errorText}>
            Enter values as a valid Python list of numbers, for example: <code>[64, 69, 72]</code>
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

        <label>
          Sort Order
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className={styles.selectInput}
          >
            <option value="none">Original Order</option>
            <option value="asc">Ascending (Lowest First)</option>
            <option value="desc">Descending (Highest First)</option>
          </select>
        </label>

        <label>
          Orientation
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as any)}
            className={styles.selectInput}
          >
            <option value="v">Vertical (plt.bar)</option>
            <option value="h">Horizontal (plt.barh)</option>
          </select>
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
            margin: { t: 25, r: 25, b: 60, l: 65 },
            yaxis: {
              range: orientation === 'v' ? [0, maxValue + (maxValue * 0.15)] : undefined,
              title: orientation === 'v' ? 'Value' : 'Category',
            },
            xaxis: {
              range: orientation === 'h' ? [0, maxValue + (maxValue * 0.15)] : undefined,
              title: orientation === 'v' ? 'Category' : 'Value',
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