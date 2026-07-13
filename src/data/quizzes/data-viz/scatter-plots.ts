const quiz = [
  {
    id: 'scatter-plots-1',
    question: 'When should you use a scatter plot?',
    options: [
      'When comparing categories',
      'When showing change over time only',
      'When studying the relationship between two numerical variables',
      'When counting how many items belong to each group'
    ],
    correctAnswer: 'When studying the relationship between two numerical variables',
    hint: 'Think about relationship questions.',
    explanation:
      'Scatter plots are designed to show the relationship between two numerical variables by plotting paired observations as points.'
  },
  {
    id: 'scatter-plots-2',
    question: 'Which Matplotlib function creates a scatter plot?',
    options: [
      'plt.plot()',
      'plt.bar()',
      'plt.scatter()',
      'plt.hist()'
    ],
    correctAnswer: 'plt.scatter()',
    hint: 'Use the function named after the chart type.',
    explanation:
      'plt.scatter() creates a scatter plot in Matplotlib using x and y values.'
  },
  {
    id: 'scatter-plots-3',
    question: 'What does a positive relationship look like in a scatter plot?',
    options: [
      'Points trend upward from left to right',
      'Points trend downward from left to right',
      'Points form separate bars',
      'Points are arranged in bins'
    ],
    correctAnswer: 'Points trend upward from left to right',
    hint: 'Think about what happens when both variables increase together.',
    explanation:
      'A positive relationship means that as the x-variable increases, the y-variable also tends to increase, creating an upward pattern.'
  },
  {
    id: 'scatter-plots-4',
    question: 'What is an outlier in a scatter plot?',
    options: [
      'A point that lies far from the main cluster of points',
      'A point that is exactly in the center',
      'A category with the highest count',
      'A missing axis label'
    ],
    correctAnswer: 'A point that lies far from the main cluster of points',
    hint: 'Think of a point that looks unusual compared with the rest.',
    explanation:
      'An outlier is an observation that appears far away from the main group of points and may indicate an unusual case or possible error.'
  },
  {
    id: 'scatter-plots-5',
    question: 'Which statement is correct about scatter plots?',
    options: [
      'They prove causation between variables',
      'They show relationships, but not necessarily causation',
      'They should only be used for categorical data',
      'They are best for showing frequency counts'
    ],
    correctAnswer: 'They show relationships, but not necessarily causation',
    hint: 'Relationship does not automatically mean cause.',
    explanation:
      'Scatter plots can reveal relationships between variables, but they do not prove that one variable causes changes in the other.'
  }
];

export default quiz;