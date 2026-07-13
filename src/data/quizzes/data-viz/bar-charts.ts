const quiz = [
  {
    id: 'bar-charts-1',
    question: 'When is a bar chart most useful?',
    options: [
      'When showing the relationship between two numerical variables',
      'When comparing values across categories',
      'When showing changes continuously over time',
      'When displaying the distribution of one numerical variable'
    ],
    correctAnswer: 'When comparing values across categories',
    hint: 'Think about categorical comparisons.',
    explanation:
      'Bar charts are best used to compare values across separate categories such as gender, department, or product type.'
  },
  {
    id: 'bar-charts-2',
    question: 'Which Matplotlib function creates a bar chart?',
    options: [
      'plt.line()',
      'plt.hist()',
      'plt.bar()',
      'plt.scatter()'
    ],
    correctAnswer: 'plt.bar()',
    hint: 'It is the plotting function specifically designed for bars.',
    explanation:
      'plt.bar() creates a bar chart in Matplotlib using category labels and corresponding values.'
  },
  {
    id: 'bar-charts-3',
    question: 'In a bar chart, what usually represents the value being compared?',
    options: [
      'The color of the bars only',
      'The height or length of the bars',
      'The font size of the title',
      'The position of the legend'
    ],
    correctAnswer: 'The height or length of the bars',
    hint: 'Think about what changes visually from one category to another.',
    explanation:
      'The bar height (or length, in a horizontal bar chart) shows the value for each category.'
  },
  {
    id: 'bar-charts-4',
    question: 'If one bar is much taller than another, what does that usually mean?',
    options: [
      'That category has a higher value',
      'That category is always more important',
      'That the chart is incorrect',
      'That the x-axis label is missing'
    ],
    correctAnswer: 'That category has a higher value',
    hint: 'Bar size encodes the category value.',
    explanation:
      'A taller bar indicates a larger value for that category compared with shorter bars.'
  },
  {
    id: 'bar-charts-5',
    question: 'Which is a common mistake when using bar charts?',
    options: [
      'Using them to compare categories',
      'Adding axis labels',
      'Using them for time-based trends that are better shown with a line chart',
      'Writing an interpretation below the chart'
    ],
    correctAnswer: 'Using them for time-based trends that are better shown with a line chart',
    hint: 'Think about choosing the right chart for the question.',
    explanation:
      'Bar charts are best for categorical comparisons, while line charts are often better for showing change over time.'
  }
];

export default quiz;