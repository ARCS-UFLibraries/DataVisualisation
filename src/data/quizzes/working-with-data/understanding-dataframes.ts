const quiz = [
  {
    id: 'understanding-dataframes-1',
    question: 'What is a Pandas DataFrame?',
    options: [
      'A two-dimensional table used to store data',
      'A single number used for calculations',
      'A Python function for printing messages',
      'A file format for images'
    ],
    correctAnswer: 'A two-dimensional table used to store data',
    hint: 'Think about spreadsheets and database tables.',
    explanation:
      'A DataFrame is a two-dimensional tabular data structure similar to a spreadsheet or database table.'
  },
  {
    id: 'understanding-dataframes-2',
    question: 'What does each row in the Students Performance DataFrame represent?',
    options: [
      'One exam subject',
      'One student',
      'One school',
      'One country'
    ],
    correctAnswer: 'One student',
    hint: 'Think about what is being measured in each record.',
    explanation:
      'In the Students Performance dataset, each row represents one student and their related information.'
  },
  {
    id: 'understanding-dataframes-3',
    question: 'What does df.shape return?',
    options: [
      'The first five rows of the DataFrame',
      'The list of column names',
      'The number of rows and columns',
      'The data types of each column'
    ],
    correctAnswer: 'The number of rows and columns',
    hint: 'Think of df.shape as describing the size of the table.',
    explanation:
      'The shape attribute returns a tuple (rows, columns) that describes the dimensions of the DataFrame.'
  },
  {
    id: 'understanding-dataframes-4',
    question: 'Which command shows basic information such as data types and number of entries?',
    options: [
      'df.head()',
      'df.columns',
      'df.info()',
      'df.index'
    ],
    correctAnswer: 'df.info()',
    hint: 'Look for the method that prints a summary of the DataFrame.',
    explanation:
      'The info() method displays a summary including the number of entries, columns, data types, and memory usage.'
  },
  {
    id: 'understanding-dataframes-5',
    question: 'What is the default starting value of the DataFrame index in Pandas?',
    options: [
      '1',
      '10',
      '0',
      '-1'
    ],
    correctAnswer: '0',
    hint: 'Think about zero-based indexing in programming.',
    explanation:
      'By default, Pandas uses zero-based indexing, so the first row has index 0.'
  }
];

export default quiz;