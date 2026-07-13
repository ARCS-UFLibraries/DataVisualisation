const quiz = [
  {
    id: 'reading-excel-1',
    question: 'Which Pandas function is used to read an Excel file?',
    options: [
      'pd.read_csv()',
      'pd.read_excel()',
      'pd.load_excel()',
      'pd.open()'
    ],
    correctAnswer: 'pd.read_excel()',
    hint: 'Think about the function name that mentions Excel directly.',
    explanation:
      'The read_excel() function in Pandas is used to load data from Excel workbooks into a DataFrame.'
  },
  {
    id: 'reading-excel-2',
    question: 'What is one key difference between CSV and Excel files?',
    options: [
      'CSV files can have multiple worksheets; Excel files cannot',
      'Excel files can have multiple worksheets; CSV files typically have one',
      'CSV files support formulas; Excel files do not',
      'CSV files always include charts'
    ],
    correctAnswer: 'Excel files can have multiple worksheets; CSV files typically have one',
    hint: 'Think about how many sheets each format can store.',
    explanation:
      'Excel workbooks can contain several worksheets, while CSV files usually represent a single table.'
  },
  {
    id: 'reading-excel-3',
    question: 'How do you specify which worksheet to load from an Excel file?',
    options: [
      'Use the file_name parameter',
      'Use the sheet_name parameter in pd.read_excel()',
      'Use the worksheet parameter in pd.read_excel()',
      'It is not possible to choose a worksheet'
    ],
    correctAnswer: 'Use the sheet_name parameter in pd.read_excel()',
    hint: 'Look for the parameter that mentions “sheet” by name.',
    explanation:
      'The sheet_name parameter lets you select a specific worksheet from an Excel workbook when calling read_excel().'
  },
  {
    id: 'reading-excel-4',
    question: 'What does df.head() do after you read an Excel file into a DataFrame?',
    options: [
      'Deletes the first five rows',
      'Displays the first five rows',
      'Displays only the column names',
      'Saves the DataFrame to an Excel file'
    ],
    correctAnswer: 'Displays the first five rows',
    hint: 'Think about previewing the top of the dataset.',
    explanation:
      'The head() method shows the first few rows of a DataFrame, letting you quickly inspect the data.'
  },
  {
    id: 'reading-excel-5',
    question: 'Which dependency might be needed to read Excel files in some Python environments?',
    options: [
      'pandas',
      'numpy',
      'openpyxl',
      'matplotlib'
    ],
    correctAnswer: 'openpyxl',
    hint: 'It is a library commonly used as an Excel engine.',
    explanation:
      'Some environments require openpyxl as an engine for reading Excel files. If needed, it can be installed with pip.'
  }
];

export default quiz;