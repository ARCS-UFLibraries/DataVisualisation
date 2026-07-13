const quiz = [
  {
    id: 'intro-pandas-1',
    question: 'What is Pandas?',
    options: [
      'A Python library for working with tabular data',
      'A tool for making presentations',
      'A programming language used instead of Python',
      'A type of chart used in visualizations'
    ],
    correctAnswer: 'A Python library for working with tabular data',
    hint: 'Think about what kind of data it helps you work with.',
    explanation:
      'Pandas is a Python library designed for working with structured or tabular data.'
  },
  {
    id: 'intro-pandas-2',
    question: 'Why is Pandas useful in data analysis?',
    options: [
      'It makes data work easier by helping you load, organize, and summarize data',
      'It only works with images',
      'It replaces all other Python libraries',
      'It is used only for writing text'
    ],
    correctAnswer: 'It makes data work easier by helping you load, organize, and summarize data',
    hint: 'Think about the tasks you would otherwise need to do manually.',
    explanation:
      'Pandas helps you work with data more efficiently by providing tools for loading, filtering, cleaning, and summarizing datasets.'
  },
  {
    id: 'intro-pandas-3',
    question: 'What does a Series store?',
    options: [
      'An entire table',
      'One column of data',
      'Only images',
      'Only labels and titles'
    ],
    correctAnswer: 'One column of data',
    hint: 'A Series is smaller than a full table.',
    explanation:
      'A Series is a one-dimensional structure, so it is often used to represent a single column.'
  },
  {
    id: 'intro-pandas-4',
    question: 'What does a DataFrame store?',
    options: [
      'One row of data only',
      'An entire table',
      'Only text data',
      'Only missing values'
    ],
    correctAnswer: 'An entire table',
    hint: 'Think of a spreadsheet.',
    explanation:
      'A DataFrame is a two-dimensional structure used to store full tabular datasets.'
  },
  {
    id: 'intro-pandas-5',
    question: 'Why do many Python data projects use import pandas as pd?',
    options: [
      'Because pd is a common alias that makes the code shorter and easier to read',
      'Because pd is required and cannot be changed',
      'Because Pandas only works with the letter p',
      'Because it automatically creates charts'
    ],
    correctAnswer: 'Because pd is a common alias that makes the code shorter and easier to read',
    hint: 'Think about convenience and convention.',
    explanation:
      'Using pd is a widely followed convention. It keeps code short while still being easy to recognize.'
  }
];

export default quiz;