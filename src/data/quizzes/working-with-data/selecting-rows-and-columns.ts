const quiz = [
  {
    id: 'select-rows-cols-1',
    question: 'What does df["math score"] return?',
    options: [
      'A DataFrame with all columns',
      'A Series containing only the math score column',
      'A list of all column names',
      'The number of rows in the DataFrame'
    ],
    correctAnswer: 'A Series containing only the math score column',
    hint: 'Only one column is being selected.',
    explanation:
      'Selecting a single column with df["column name"] returns a Series containing that column’s values.'
  },
  {
    id: 'select-rows-cols-2',
    question: 'How do you select multiple columns: math, reading, and writing scores?',
    options: [
      'df["math score", "reading score", "writing score"]',
      'df[["math score", "reading score", "writing score"]]',
      'df.loc["math score", "reading score", "writing score"]',
      'df.iloc["math score", "reading score", "writing score"]'
    ],
    correctAnswer: 'df[["math score", "reading score", "writing score"]]',
    hint: 'Remember the double square brackets for a list of column names.',
    explanation:
      'To select multiple columns, you pass a list of column names inside double brackets: df[[...]].'
  },
  {
    id: 'select-rows-cols-3',
    question: 'Which command selects the first five rows by position?',
    options: [
      'df.loc[0:4]',
      'df.iloc[0:5]',
      'df.head(5)',
      'df.loc[:5]'
    ],
    correctAnswer: 'df.iloc[0:5]',
    hint: 'Think about zero-based positions and slicing.',
    explanation:
      'df.iloc[0:5] selects rows at positions 0 through 4, which are the first five rows.'
  },
  {
    id: 'select-rows-cols-4',
    question: 'Which command uses labels to select all rows but only gender and math score?',
    options: [
      'df.iloc[:, ["gender", "math score"]]',
      'df.loc[:, ["gender", "math score"]]',
      'df["gender", "math score"]',
      'df.head()[["gender", "math score"]]'
    ],
    correctAnswer: 'df.loc[:, ["gender", "math score"]]',
    hint: 'Look for loc[] and column names.',
    explanation:
      'df.loc[:, ["gender", "math score"]] uses labels to select all rows (:) and only the specified columns.'
  },
  {
    id: 'select-rows-cols-5',
    question: 'What is the main difference between loc[] and iloc[]?',
    options: [
      'loc[] uses labels; iloc[] uses integer positions',
      'loc[] is only for columns; iloc[] is only for rows',
      'loc[] works only with CSV files; iloc[] works only with Excel files',
      'There is no difference; they are identical'
    ],
    correctAnswer: 'loc[] uses labels; iloc[] uses integer positions',
    hint: 'Think about names versus numeric indices.',
    explanation:
      'loc[] selects using labels (index and column names), while iloc[] selects using integer positions.'
  }
];

export default quiz;