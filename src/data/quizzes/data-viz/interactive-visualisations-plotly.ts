const quiz = [
  {
    id: 'plotly-interactive-1',
    question: 'What is one major advantage of Plotly charts?',
    options: [
      'They can only create static charts',
      'They support interaction such as hover and zoom',
      'They remove the need for labels',
      'They only work with JavaScript'
    ],
    correctAnswer: 'They support interaction such as hover and zoom',
    hint: 'Think about what makes Plotly different from many static plots.',
    explanation:
      'One major advantage of Plotly charts is that they support built-in interactive features such as hover tooltips, zooming, and panning.'
  },
  {
    id: 'plotly-interactive-2',
    question: 'Which Plotly module is recommended as the starting point for creating common figures?',
    options: [
      'plotly.random',
      'plotly.static',
      'plotly.express',
      'plotly.numpy'
    ],
    correctAnswer: 'plotly.express',
    hint: 'It is the high-level interface in Plotly.',
    explanation:
      'Plotly Express is the recommended high-level starting point for creating most common interactive figures.'
  },
  {
    id: 'plotly-interactive-3',
    question: 'What does hovering over a Plotly chart often help you see?',
    options: [
      'The Python source code',
      'Exact values and extra details',
      'Only the chart title',
      'The file size of the dataset'
    ],
    correctAnswer: 'Exact values and extra details',
    hint: 'Think about tooltips.',
    explanation:
      'Hovering over Plotly chart elements often reveals exact values and additional information through tooltips.'
  },
  {
    id: 'plotly-interactive-4',
    question: 'Why can zooming be useful in an interactive chart?',
    options: [
      'It changes the dataset automatically',
      'It lets the viewer inspect a crowded or detailed region more closely',
      'It removes outliers permanently',
      'It converts a bar chart into a line chart'
    ],
    correctAnswer: 'It lets the viewer inspect a crowded or detailed region more closely',
    hint: 'Think about dense or busy areas in a chart.',
    explanation:
      'Zooming helps the viewer focus on a smaller region of the chart, which is especially useful for dense or detailed data.'
  },
  {
    id: 'plotly-interactive-5',
    question: 'Which statement is most accurate?',
    options: [
      'Interactive charts eliminate the need for good design',
      'Interactivity is useful, but charts still need clear labels and thoughtful design',
      'Plotly should replace every other library',
      'Hover tooltips are enough to explain every chart'
    ],
    correctAnswer: 'Interactivity is useful, but charts still need clear labels and thoughtful design',
    hint: 'Interactivity helps, but it does not replace fundamentals.',
    explanation:
      'Interactive features are useful, but a chart still needs clear titles, labels, and an appropriate design to communicate well.'
  }
];

export default quiz;