const quiz = [
  {
    id: 'choosing-chart-1',
    question: 'What should you decide first before choosing a chart?',
    options: [
      'The chart color palette',
      'The exact font size',
      'The analytical question you want to answer',
      'Whether to use dark mode'
    ],
    correctAnswer: 'The analytical question you want to answer',
    hint: 'Start with the purpose, not the styling.',
    explanation:
      'The first step in choosing a chart is identifying the question you want the visualization to answer.'
  },
  {
    id: 'choosing-chart-2',
    question: 'Which chart is usually best for showing change over time?',
    options: [
      'Line chart',
      'Histogram',
      'Boxplot',
      'Heatmap'
    ],
    correctAnswer: 'Line chart',
    hint: 'Think about trends across an ordered sequence.',
    explanation:
      'A line chart is usually the best choice for showing change over time because it helps the viewer follow trends.'
  },
  {
    id: 'choosing-chart-3',
    question: 'Which chart is best for showing the relationship between two numerical variables?',
    options: [
      'Bar chart',
      'Scatter plot',
      'Histogram',
      'Count plot'
    ],
    correctAnswer: 'Scatter plot',
    hint: 'Think about two numeric axes.',
    explanation:
      'A scatter plot is best for showing the relationship between two numerical variables.'
  },
  {
    id: 'choosing-chart-4',
    question: 'Which chart is most appropriate for studying the distribution of one numerical variable?',
    options: [
      'Histogram',
      'Line chart',
      'Pie chart',
      'Count plot'
    ],
    correctAnswer: 'Histogram',
    hint: 'Think about grouped ranges of values.',
    explanation:
      'A histogram is used to study the distribution of one numerical variable by grouping values into bins.'
  },
  {
    id: 'choosing-chart-5',
    question: 'Why is choosing the wrong chart a problem?',
    options: [
      'Because it always causes a coding error',
      'Because it can make the data harder to understand or even misleading',
      'Because it changes the dataset automatically',
      'Because it prevents labels from appearing'
    ],
    correctAnswer: 'Because it can make the data harder to understand or even misleading',
    hint: 'Think about communication and interpretation.',
    explanation:
      'The wrong chart can confuse the viewer or suggest the wrong message, even when the data itself is correct.'
  }
];

export default quiz;