export const courseModules = [
  {
    id: "getting-started",
    title: "Getting Started",
    required: true,
    colabRequired: false,
  },
  {
    id: "python-essentials",
    title: "Python Essentials",
    required: true,
    colabRequired: true,
  },
  {
    id: "working-with-data",
    title: "Working with Data",
    required: true,
    colabRequired: true,
  },
  {
    id: "data-visualization",
    title: "Data Visualization",
    required: true,
    colabRequired: true,
  },
];

export const coursePages = {
  "getting-started": [
    "why-python",
  ],

  "python-essentials": [
    "variables",
    "data-types",
    "type-conversion",
    "built-in-functions",
    "input-output",
    "collections",
    "control-flow",
    "functions",
  ],

  "working-with-data": [
    "introduction-to-data-analysis",
    "introduction-to-pandas",
    "installing-importing-libraries",
    "reading-csv-files",
    "reading-excel-files",
    "understanding-dataframes",
    "exploring-data",
    "selecting-rows-columns",
    "filtering-data",
    "sorting-data",
    "cleaning-preparing-data",
    "grouping-summarizing-data",
    "exporting-data",
  ],

  "data-visualization": [
    "introduction-to-data-visualisation",
    "matplotlib-basics",
    "bar-charts",
    "line-charts",
    "scatter-plots",
    "histograms",
    "boxplots",
    "heatmaps",
    "comparative-visualisations-seaborn",
    "interactive-visualisations-plotly",
    "choosing-the-right-chart",
    "designing-effective-visualisations",
  ],
};
