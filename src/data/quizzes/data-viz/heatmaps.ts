const quiz = [
  {
    id: 'heatmaps-1',
    question: 'What does a heatmap mainly use to represent values?',
    options: [
      'Line thickness',
      'Bar height',
      'Color intensity',
      'Point size only'
    ],
    correctAnswer: 'Color intensity',
    hint: 'Think about what changes across the cells.',
    explanation:
      'A heatmap represents values through color, where intensity or shade helps show lower and higher values.'
  },
  {
    id: 'heatmaps-2',
    question: 'When is a heatmap especially useful?',
    options: [
      'When comparing only two categories with one value each',
      'When showing exact values only with no pattern',
      'When data can be arranged in a matrix and patterns need to be spotted quickly',
      'When plotting one variable over time as a continuous line'
    ],
    correctAnswer: 'When data can be arranged in a matrix and patterns need to be spotted quickly',
    hint: 'Think about grids of values and pattern recognition.',
    explanation:
      'Heatmaps are especially useful for matrix-like data where color helps reveal patterns, clusters, and intensity differences quickly.'
  },
  {
    id: 'heatmaps-3',
    question: 'Which Python library provides a common heatmap() function?',
    options: [
      'NumPy',
      'Seaborn',
      'Requests',
      'OpenCV'
    ],
    correctAnswer: 'Seaborn',
    hint: 'This library is often used for higher-level statistical visualizations.',
    explanation:
      'Seaborn provides the heatmap() function, which is commonly used to create readable heatmaps in Python.'
  },
  {
    id: 'heatmaps-4',
    question: 'What does annot=True do in a Seaborn heatmap?',
    options: [
      'It removes all labels',
      'It adds the numeric values inside the cells',
      'It changes the color palette automatically',
      'It sorts the rows and columns'
    ],
    correctAnswer: 'It adds the numeric values inside the cells',
    hint: 'Think about annotations in a chart.',
    explanation:
      'Using annot=True tells Seaborn to display the underlying values as text inside the heatmap cells.'
  },
  {
    id: 'heatmaps-5',
    question: 'What is one common use of a heatmap in data analysis?',
    options: [
      'Showing the correlation matrix between numerical variables',
      'Replacing all histograms',
      'Displaying only categorical labels with no values',
      'Drawing a trend line over time'
    ],
    correctAnswer: 'Showing the correlation matrix between numerical variables',
    hint: 'Think about relationships between multiple numerical columns.',
    explanation:
      'A common use of a heatmap is to visualize a correlation matrix so that stronger and weaker relationships are easier to detect.'
  }
];

export default quiz;