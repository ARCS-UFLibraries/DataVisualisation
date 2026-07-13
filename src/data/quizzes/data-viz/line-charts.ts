const quiz = [
  {
    id: 'line-charts-1',
    question: 'When is a line chart most useful?',
    options: [
      'When comparing separate categories with no natural order',
      'When showing change over time or an ordered sequence',
      'When showing the distribution of one numerical variable',
      'When counting the number of categories'
    ],
    correctAnswer: 'When showing change over time or an ordered sequence',
    hint: 'Think about trend and sequence.',
    explanation:
      'Line charts are best for showing how values change across time or another meaningful ordered sequence.'
  },
  {
    id: 'line-charts-2',
    question: 'Which Matplotlib function is commonly used to create a line chart?',
    options: [
      'plt.bar()',
      'plt.plot()',
      'plt.hist()',
      'plt.scatter()'
    ],
    correctAnswer: 'plt.plot()',
    hint: 'It is the standard function used earlier for simple plots.',
    explanation:
      'plt.plot() is the main Matplotlib function used to create line charts from x and y values.'
  },
  {
    id: 'line-charts-3',
    question: 'What does a marker do in a line chart?',
    options: [
      'It deletes extra values',
      'It changes the data type',
      'It highlights individual data points',
      'It adds a second y-axis'
    ],
    correctAnswer: 'It highlights individual data points',
    hint: 'Think about what circles or squares on the line represent.',
    explanation:
      'Markers make individual observations easier to see on a line chart, especially when there are only a few points.'
  },
  {
    id: 'line-charts-4',
    question: 'Which statement best describes a fluctuating trend?',
    options: [
      'The values move up and down over the sequence',
      'The values stay exactly the same',
      'The values always increase at the same rate',
      'The categories are unordered'
    ],
    correctAnswer: 'The values move up and down over the sequence',
    hint: 'Fluctuation means variation rather than one smooth direction.',
    explanation:
      'A fluctuating trend means the values rise and fall rather than following a perfectly steady upward or downward path.'
  },
  {
    id: 'line-charts-5',
    question: 'Which chart is usually better for comparing gender categories?',
    options: [
      'Line chart',
      'Bar chart',
      'Histogram',
      'Scatter plot'
    ],
    correctAnswer: 'Bar chart',
    hint: 'Gender is a category, not a time sequence.',
    explanation:
      'Bar charts are usually better for comparing separate categories such as gender, while line charts are better for trends over ordered values.'
  }
];

export default quiz;