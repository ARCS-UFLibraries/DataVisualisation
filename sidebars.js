// @ts-check

const sidebars = {
  tutorialSidebar: [
    "intro",

    {
      type: "category",
      label: "Getting Started",
      link: {
        type: "doc",
        id: "getting-started/index",
      },
      items: [
        "getting-started/why-python",
      ],
    },

    {
      type: "category",
      label: "Python Essentials",
      link: {
        type: "doc",
        id: "python-essentials/index",
      },
      items: [
        "python-essentials/variables",
        "python-essentials/data-types",
        "python-essentials/type-conversion",
        "python-essentials/built-in-functions",
        "python-essentials/input-output",
        "python-essentials/collections",
        "python-essentials/control-flow",
        "python-essentials/functions",
      ],
    },

    {
      type: "category",
      label: "Working with Data",
      link: {
        type: "doc",
        id: "working-with-data/index",
      },
      items: [
          "working-with-data/introduction-to-data-analysis",
          "working-with-data/introduction-to-pandas",
          "working-with-data/installing-importing-libraries",
          "working-with-data/reading-csv-files",
          "working-with-data/reading-excel-files",
          "working-with-data/understanding-dataframes",
          "working-with-data/exploring-data",
          "working-with-data/selecting-rows-columns",
          "working-with-data/filtering-data",
          "working-with-data/sorting-data",
          "working-with-data/cleaning-preparing-data",
          "working-with-data/grouping-summarizing-data",
          "working-with-data/exporting-data",
          ],
        },
    {
      type: "category",
      label: "Data Visualization",
      link: {
        type: "doc",
        id: "data-viz/index",
      },
      collapsed: false,
      items: [
        "data-viz/introduction-to-data-visualisation",
        "data-viz/matplotlib-basics",
        "data-viz/bar-charts",
        "data-viz/line-charts",
        "data-viz/scatter-plots",
        "data-viz/histograms",
        "data-viz/boxplots",
        "data-viz/heatmaps",
        "data-viz/comparative-visualisations-seaborn",
        "data-viz/interactive-visualisations-plotly",
        "data-viz/choosing-the-right-chart",
        "data-viz/designing-effective-visualisations",
      ],
    },

    {
      type: "category",
      label: "Datasets",
      link: {
        type: "doc",
        id: "datasets/index",
      },
      items: [],
    },

    {
      type: "category",
      label: "Learning Resources",
      link: {
        type: "doc",
        id: "learning-resources/index",
      },
      items: [
        "learning-resources/development-tools",
        "learning-resources/git-github",
        "learning-resources/Guided-Projects",
        "learning-resources/practice-projects",
      ],
    },

    {
      type: "category",
      label: "FAQ & Troubleshooting",
      link: {
        type: "doc",
        id: "FAQs/index",
      },
      items: [],
    },
  ],
};

export default sidebars;