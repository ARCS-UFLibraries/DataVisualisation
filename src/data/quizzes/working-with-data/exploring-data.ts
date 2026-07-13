const quiz = [
  {
    id: 'exploring-dataset-1',
    question: 'What does df.head() show?',
    options: [
      'The first few rows of the DataFrame',
      'Summary statistics for numerical columns',
      'The number of rows and columns',
      'The list of column names'
    ],
    correctAnswer: 'The first few rows of the DataFrame',
    hint: 'Think about previewing sample records.',
    explanation:
      'The head() method displays the first rows of the DataFrame, which helps you inspect example records.'
  },
  {
    id: 'exploring-dataset-2',
    question: 'Which command is commonly used to see summary statistics for numerical columns?',
    options: [
      'df.info()',
      'df.describe()',
      'df.head()',
      'df.isnull()'
    ],
    correctAnswer: 'df.describe()',
    hint: 'Look for the method that returns statistics like mean and max.',
    explanation:
      'The describe() method calculates summary statistics such as count, mean, min, and max for numerical columns.'
  },
  {
    id: 'exploring-dataset-3',
    question: 'What does df.shape return?',
    options: [
      'The list of column names',
      'The number of missing values',
      'The number of rows and columns',
      'The first and last rows'
    ],
    correctAnswer: 'The number of rows and columns',
    hint: 'Think of df.shape as describing the size of the dataset.',
    explanation:
      'The shape attribute returns a tuple (rows, columns) that describes the dimensions of the DataFrame.'
  },
  {
    id: 'exploring-dataset-4',
    question: 'How can you check for missing values in each column?',
    options: [
      'df.head()',
      'df.info()',
      'df.isnull().sum()',
      'df.columns'
    ],
    correctAnswer: 'df.isnull().sum()',
    hint: 'Think about combining a missing-value check with a sum.',
    explanation:
      'df.isnull().sum() counts the number of missing values in each column and is useful for data quality checks.'
  },
  {
    id: 'exploring-dataset-5',
    question: 'Why should you explore a dataset before analysis?',
    options: [
      'To make the file smaller',
      'To understand its structure and detect issues before running calculations',
      'To convert all values to text',
      'To automatically build charts'
    ],
    correctAnswer:
      'To understand its structure and detect issues before running calculations',
    hint: 'Think about avoiding incorrect assumptions.',
    explanation:
      'Exploration helps you understand the data and identify potential problems, which leads to more reliable analysis.'
  }
];

export default quiz;