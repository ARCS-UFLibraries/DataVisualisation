const quiz = [
  {
    id: 'seaborn-comparisons-1',
    question: 'Why is Seaborn often preferred for statistical visualisation?',
    options: [
      'It replaces Python completely',
      'It offers cleaner defaults and a higher-level interface for common plots',
      'It only works without Matplotlib',
      'It can only create heatmaps'
    ],
    correctAnswer: 'It offers cleaner defaults and a higher-level interface for common plots',
    hint: 'Think about ease of use and chart design.',
    explanation:
      'Seaborn is often preferred because it provides cleaner default styling and a higher-level interface for common statistical charts.'
  },
  {
    id: 'seaborn-comparisons-2',
    question: 'Which Seaborn plot is best for comparing category counts?',
    options: [
      'sns.barplot()',
      'sns.countplot()',
      'sns.boxplot()',
      'sns.scatterplot()'
    ],
    correctAnswer: 'sns.countplot()',
    hint: 'This plot counts how many observations fall in each category.',
    explanation:
      'sns.countplot() is designed to show the number of observations in each categorical group.'
  },
  {
    id: 'seaborn-comparisons-3',
    question: 'Which Seaborn plot is commonly used to compare average values across categories?',
    options: [
      'sns.barplot()',
      'sns.countplot()',
      'sns.heatmap()',
      'sns.histplot()'
    ],
    correctAnswer: 'sns.barplot()',
    hint: 'Think about group summaries rather than raw counts.',
    explanation:
      'sns.barplot() is commonly used to compare a summary statistic, often the mean, across categories.'
  },
  {
    id: 'seaborn-comparisons-4',
    question: 'What does the hue argument usually add to a Seaborn plot?',
    options: [
      'A second categorical grouping shown with color',
      'A second y-axis',
      'Automatic data cleaning',
      'A histogram overlay'
    ],
    correctAnswer: 'A second categorical grouping shown with color',
    hint: 'It helps separate categories visually.',
    explanation:
      'The hue argument uses color to represent a second categorical grouping, adding another layer of comparison.'
  },
  {
    id: 'seaborn-comparisons-5',
    question: 'Which Seaborn plot is most appropriate for comparing score distributions across groups?',
    options: [
      'sns.countplot()',
      'sns.boxplot()',
      'sns.lineplot()',
      'sns.heatmap()'
    ],
    correctAnswer: 'sns.boxplot()',
    hint: 'Think about median, spread, and outliers.',
    explanation:
      'sns.boxplot() is the best choice when you want to compare the distribution of a numerical variable across groups.'
  }
];

export default quiz;