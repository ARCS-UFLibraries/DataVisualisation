const quiz = [
  {
    id: 'designing-viz-1',
    question: 'What is the main goal of effective data visualization design?',
    options: [
      'To make charts look complicated',
      'To make charts look decorative',
      'To communicate the data clearly and accurately',
      'To use as many colors as possible'
    ],
    correctAnswer: 'To communicate the data clearly and accurately',
    hint: 'Think about communication, not decoration.',
    explanation:
      'The main goal of effective data visualization design is to communicate the data clearly, accurately, and readably.'
  },
  {
    id: 'designing-viz-2',
    question: 'Which title is the most effective?',
    options: [
      'Chart 1',
      'Scores',
      'Bar Graph',
      'Average Math Score by Gender'
    ],
    correctAnswer: 'Average Math Score by Gender',
    hint: 'A strong title tells the viewer what the chart is showing.',
    explanation:
      'A clear and specific title helps the viewer understand the chart immediately.'
  },
  {
    id: 'designing-viz-3',
    question: 'Why should color be used carefully in charts?',
    options: [
      'Because more random colors always improve the chart',
      'Because color should support meaning and not distract from the data',
      'Because charts should never use color',
      'Because color removes the need for labels'
    ],
    correctAnswer: 'Because color should support meaning and not distract from the data',
    hint: 'Think about clarity and purpose.',
    explanation:
      'Color should help communicate differences, emphasis, or intensity without overwhelming or confusing the viewer.'
  },
  {
    id: 'designing-viz-4',
    question: 'What is clutter in a chart?',
    options: [
      'Helpful labels and titles',
      'Important data points',
      'Unnecessary visual elements that make the chart harder to read',
      'A required part of every graph'
    ],
    correctAnswer: 'Unnecessary visual elements that make the chart harder to read',
    hint: 'Think about items that distract from the main message.',
    explanation:
      'Clutter includes unnecessary elements such as excessive labels, distracting colors, or decorative features that do not improve understanding.'
  },
  {
    id: 'designing-viz-5',
    question: 'What should you do if a chart element does not help the viewer understand the data?',
    options: [
      'Make it bigger',
      'Add more decoration to it',
      'Keep it anyway',
      'Consider removing it'
    ],
    correctAnswer: 'Consider removing it',
    hint: 'Effective design often comes from simplification.',
    explanation:
      'If an element does not improve understanding, it is often better to remove it and keep the chart focused.'
  }
];

export default quiz;