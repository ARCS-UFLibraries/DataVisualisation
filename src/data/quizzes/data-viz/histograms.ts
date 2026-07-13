const quiz = [
  {
    id: 'histograms-1',
    question: 'When should you use a histogram?',
    options: [
      'When comparing categories such as gender or lunch type',
      'When studying the distribution of one numerical variable',
      'When showing the relationship between two numerical variables',
      'When displaying change over time'
    ],
    correctAnswer: 'When studying the distribution of one numerical variable',
    hint: 'Think about distributions, not categories.',
    explanation:
      'A histogram is used to study how the values of one numerical variable are distributed across ranges.'
  },
  {
    id: 'histograms-2',
    question: 'Which Matplotlib function creates a histogram?',
    options: [
      'plt.bar()',
      'plt.scatter()',
      'plt.hist()',
      'plt.plot()'
    ],
    correctAnswer: 'plt.hist()',
    hint: 'Use the function named after the chart type.',
    explanation:
      'plt.hist() creates a histogram by grouping numerical values into bins and showing their frequencies.'
  },
  {
    id: 'histograms-3',
    question: 'What does the y-axis of a histogram usually represent?',
    options: [
      'Categories',
      'Frequency',
      'Correlation',
      'Time'
    ],
    correctAnswer: 'Frequency',
    hint: 'Think about what each bar counts.',
    explanation:
      'In a histogram, the y-axis usually shows frequency, or how many observations fall into each bin.'
  },
  {
    id: 'histograms-4',
    question: 'What are bins in a histogram?',
    options: [
      'Category labels',
      'Ranges of numerical values',
      'Colors used in the chart',
      'Titles placed above the bars'
    ],
    correctAnswer: 'Ranges of numerical values',
    hint: 'Bins group nearby values together.',
    explanation:
      'Bins are intervals or ranges of numerical values used to group the data in a histogram.'
  },
  {
    id: 'histograms-5',
    question: 'What is one common mistake when interpreting a histogram?',
    options: [
      'Reading the overall shape of the distribution',
      'Thinking it is the same as a bar chart for categories',
      'Looking at concentration and spread',
      'Using it for numerical data'
    ],
    correctAnswer: 'Thinking it is the same as a bar chart for categories',
    hint: 'The two charts may look similar, but they serve different purposes.',
    explanation:
      'A histogram shows the distribution of numerical values, while a bar chart compares categories.'
  }
];

export default quiz;