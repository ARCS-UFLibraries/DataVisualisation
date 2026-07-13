const quiz = [
  {
    id: 'intro-dataviz-1',
    question: 'What is the main purpose of data visualisation?',
    options: [
      'To replace datasets completely',
      'To make data easier to explore, understand, and communicate',
      'To avoid using Python code',
      'To remove the need for summary statistics'
    ],
    correctAnswer: 'To make data easier to explore, understand, and communicate',
    hint: 'Think about why charts are used in analysis.',
    explanation:
      'Data visualisation helps analysts explore patterns, understand data more quickly, and communicate findings more clearly.'
  },
  {
    id: 'intro-dataviz-2',
    question: 'Which analytical question is most closely related to a bar chart?',
    options: [
      'How are values distributed?',
      'How do two numerical variables relate?',
      'How do categories compare?',
      'How does a value change continuously over time?'
    ],
    correctAnswer: 'How do categories compare?',
    hint: 'Bar charts are commonly used when comparing groups.',
    explanation:
      'Bar charts are especially useful for comparing values across categories such as gender, lunch type, or department.'
  },
  {
    id: 'intro-dataviz-3',
    question: 'Which chart type is most suitable for studying the distribution of one numerical variable?',
    options: [
      'Histogram',
      'Line chart',
      'Scatter plot',
      'Pie chart'
    ],
    correctAnswer: 'Histogram',
    hint: 'Think about a chart that groups values into ranges or bins.',
    explanation:
      'Histograms show how numerical values are distributed, helping you see concentration, spread, and possible outliers.'
  },
  {
    id: 'intro-dataviz-4',
    question: 'When interpreting a chart, what should you check first?',
    options: [
      'The background color',
      'The title and axes',
      'The notebook theme',
      'The Python version'
    ],
    correctAnswer: 'The title and axes',
    hint: 'Start by understanding what the chart is showing.',
    explanation:
      'The title and axes provide the basic context needed to understand what the chart represents and how to interpret it.'
  },
  {
    id: 'intro-dataviz-5',
    question: 'A scatter plot is most useful for answering which type of question?',
    options: [
      'How categories compare',
      'How a single variable is distributed',
      'How two numerical variables are related',
      'How file formats differ'
    ],
    correctAnswer: 'How two numerical variables are related',
    hint: 'Scatter plots use points to show pairs of values.',
    explanation:
      'Scatter plots help reveal whether two numerical variables show a positive, negative, or weak relationship.'
  }
];

export default quiz;