const quiz = [
  {
    id: 'cleaning-data-1',
    question: 'Which command creates a new average score column from three exam scores?',
    options: [
      'df["average score"] = df["math score"] + df["reading score"] + df["writing score"]',
      'df["average score"] = (df["math score"] + df["reading score"] + df["writing score"]) / 3',
      'df["average score"] = df["math score"] / 3',
      'df["average score"] = df["reading score"] - df["writing score"]'
    ],
    correctAnswer:
      'df["average score"] = (df["math score"] + df["reading score"] + df["writing score"]) / 3',
    hint: 'Think about computing the mean of three scores.',
    explanation:
      'The expression sums the three exam scores and divides by 3 to create an average score column.'
  },
  {
    id: 'cleaning-data-2',
    question: 'How do you rename "parental level of education" to "parent_education"?',
    options: [
      'df.columns = ["parent_education"]',
      'df.rename(columns={"parental level of education": "parent_education"}, inplace=True)',
      'df["parental level of education"] = "parent_education"',
      'df.rename({"parental level of education": "parent_education"})'
    ],
    correctAnswer:
      'df.rename(columns={"parental level of education": "parent_education"}, inplace=True)',
    hint: 'Use the rename method with a columns dictionary.',
    explanation:
      'The rename method with the columns parameter lets you map old column names to new ones.'
  },
  {
    id: 'cleaning-data-3',
    question: 'Which command counts missing values in each column?',
    options: [
      'df.isnull()',
      'df.isnull().sum()',
      'df.dropna()',
      'df.info()'
    ],
    correctAnswer: 'df.isnull().sum()',
    hint: 'Think about combining a missing-value check with a column-wise total.',
    explanation:
      'df.isnull().sum() returns the number of missing values for each column in the DataFrame.'
  },
  {
    id: 'cleaning-data-4',
    question: 'How can you remove duplicate rows from a DataFrame?',
    options: [
      'df.drop_duplicates()',
      'df.isnull().drop()',
      'df.remove_duplicates()',
      'df.unique()'
    ],
    correctAnswer: 'df.drop_duplicates()',
    hint: 'Look for a method whose name includes "duplicates".',
    explanation:
      'The drop_duplicates() method removes duplicated rows, helping prevent inflated counts and averages.'
  },
  {
    id: 'cleaning-data-5',
    question: 'How do you convert a text date column to a proper datetime type?',
    options: [
      'df["date"] = df["date"].astype(str)',
      'df["date"] = pd.to_datetime(df["date"])',
      'df["date"] = df["date"].astype(int)',
      'df["date"] = df["date"].fillna("1970-01-01")'
    ],
    correctAnswer: 'df["date"] = pd.to_datetime(df["date"])',
    hint: 'Use the Pandas function that creates datetime objects.',
    explanation:
      'pd.to_datetime() converts text or other formats to a datetime dtype, enabling date-based operations.'
  }
];

export default quiz;