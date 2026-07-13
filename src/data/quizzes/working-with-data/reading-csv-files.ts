const quiz = [
  {
    id: 'reading-csv-1',
    question: 'What is a CSV file?',
    options: [
      'A file that stores data in rows and columns, separated by commas',
      'A file that stores only images',
      'A special Python script',
      'A type of chart used in data visualization'
    ],
    correctAnswer: 'A file that stores data in rows and columns, separated by commas',
    hint: 'Think about how records and columns are represented.',
    explanation:
      'CSV stands for Comma-Separated Values and stores tabular data with rows and columns.'
  },
  {
    id: 'reading-csv-2',
    question: 'Which Pandas function is used to read a CSV file?',
    options: [
      'pd.read_table()',
      'pd.load_csv()',
      'pd.read_csv()',
      'pd.open()'
    ],
    correctAnswer: 'pd.read_csv()',
    hint: 'Look at the function name that mentions CSV directly.',
    explanation:
      'The read_csv() function in Pandas is used to load data from CSV files into a DataFrame.'
  },
  {
    id: 'reading-csv-3',
    question: 'After reading a CSV file with pd.read_csv(), what type of object is created?',
    options: [
      'A list',
      'A Series',
      'A DataFrame',
      'A string'
    ],
    correctAnswer: 'A DataFrame',
    hint: 'Think about the tabular structure used in Pandas.',
    explanation:
      'pd.read_csv() returns a DataFrame, which is the main tabular data structure in Pandas.'
  },
  {
    id: 'reading-csv-4',
    question: 'What does df.head() do?',
    options: [
      'Displays the first few rows of the DataFrame',
      'Deletes the first few rows of the DataFrame',
      'Displays only the column names',
      'Saves the DataFrame to a file'
    ],
    correctAnswer: 'Displays the first few rows of the DataFrame',
    hint: 'Think about previewing the start of the dataset.',
    explanation:
      'The head() method shows the first rows of a DataFrame, helping you quickly inspect the data.'
  },
  {
    id: 'reading-csv-5',
    question: 'Which error is likely if the file name is incorrect when calling pd.read_csv()?',
    options: [
      'TypeError',
      'ValueError',
      'FileNotFoundError',
      'IndexError'
    ],
    correctAnswer: 'FileNotFoundError',
    hint: 'Think about what happens when Python cannot locate a file.',
    explanation:
      'If the file name or path is wrong, Pandas raises FileNotFoundError because it cannot find the specified file.'
  }
];

export default quiz;