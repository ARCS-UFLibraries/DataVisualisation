const quiz = [
  {
    id: 'matplotlib-basics-1',
    question: 'Which import statement is most commonly used for Matplotlib plotting?',
    options: [
      'import matplotlib as plt',
      'import matplotlib.pyplot as plt',
      'import pyplot as matplotlib',
      'import plot as plt'
    ],
    correctAnswer: 'import matplotlib.pyplot as plt',
    hint: 'Think of the standard pyplot alias used in most notebooks.',
    explanation:
      'The most common import pattern is import matplotlib.pyplot as plt, which gives access to plotting functions through the plt alias.'
  },
  {
    id: 'matplotlib-basics-2',
    question: 'Which function is used to create a basic line plot?',
    options: [
      'plt.line()',
      'plt.graph()',
      'plt.plot()',
      'plt.chart()'
    ],
    correctAnswer: 'plt.plot()',
    hint: 'This is the core pyplot function used for many basic plots.',
    explanation:
      'plt.plot() is the standard Matplotlib function for creating a basic line plot from x and y values.'
  },
  {
    id: 'matplotlib-basics-3',
    question: 'What is the purpose of plt.xlabel()?',
    options: [
      'To change the chart color',
      'To label the x-axis',
      'To create a legend',
      'To display the chart'
    ],
    correctAnswer: 'To label the x-axis',
    hint: 'It adds context to the horizontal axis.',
    explanation:
      'plt.xlabel() adds a label to the x-axis so viewers understand what the horizontal values represent.'
  },
  {
    id: 'matplotlib-basics-4',
    question: 'Why are chart titles and axis labels important?',
    options: [
      'They make the chart file larger',
      'They help the viewer understand what the chart shows',
      'They automatically improve the data',
      'They are only needed for colorful charts'
    ],
    correctAnswer: 'They help the viewer understand what the chart shows',
    hint: 'Think about interpretation, not decoration.',
    explanation:
      'Titles and axis labels provide context, helping the viewer understand what the chart represents and how to read it.'
  },
  {
    id: 'matplotlib-basics-5',
    question: 'After creating a plot, what should a student do next?',
    options: [
      'Only change the color',
      'Ignore the chart if it appears correctly',
      'Interpret the pattern or trend shown in the chart',
      'Delete the code cell'
    ],
    correctAnswer: 'Interpret the pattern or trend shown in the chart',
    hint: 'The lesson emphasizes that plotting and interpretation go together.',
    explanation:
      'A chart is most useful when you interpret what it shows, such as an upward trend, a decline, or a stable pattern.'
  }
];

export default quiz;