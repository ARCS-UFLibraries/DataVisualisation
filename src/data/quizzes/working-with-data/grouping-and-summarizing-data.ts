const quiz = [
  {
    id: 'grouping-data-1',
    question: 'What does df.groupby("gender")["math score"].mean() compute?',
    options: [
      'The overall average math score for all students',
      'The average math score for each gender group',
      'The number of students in each gender group',
      'The maximum math score for each gender group'
    ],
    correctAnswer: 'The average math score for each gender group',
    hint: 'Think about grouping by gender and then averaging math scores.',
    explanation:
      'groupby("gender") creates gender-based groups, and mean() computes the average math score within each group.'
  },
  {
    id: 'grouping-data-2',
    question: 'Which command counts how many students are in each gender group?',
    options: [
      'df.groupby("gender")["math score"].mean()',
      'df.groupby("gender").size()',
      'df["gender"].unique()',
      'df["gender"].nunique()'
    ],
    correctAnswer: 'df.groupby("gender").size()',
    hint: 'Look for the method that returns group sizes.',
    explanation:
      'groupby("gender").size() returns the number of rows in each gender group.'
  },
  {
    id: 'grouping-data-3',
    question: 'How can you quickly count the number of each gender without using groupby?',
    options: [
      'df["gender"].value_counts()',
      'df["gender"].nunique()',
      'df.groupby("gender").mean()',
      'df["gender"].unique()'
    ],
    correctAnswer: 'df["gender"].value_counts()',
    hint: 'Think of a function that counts values in a single column.',
    explanation:
      'value_counts() returns the count of each unique value in the column, such as Female and Male.'
  },
  {
    id: 'grouping-data-4',
    question:
      'Which command computes count, mean, min, and max math scores by gender?',
    options: [
      'df.groupby("gender")["math score"].describe()',
      'df.groupby("gender")["math score"].agg(["count", "mean", "min", "max"])',
      'df.groupby("gender").size()',
      'df["math score"].value_counts()'
    ],
    correctAnswer:
      'df.groupby("gender")["math score"].agg(["count", "mean", "min", "max"])',
    hint: 'Look for agg() with multiple statistics.',
    explanation:
      'agg(["count", "mean", "min", "max"]) computes several summary statistics at once for each gender group.'
  },
  {
    id: 'grouping-data-5',
    question:
      'How do you group by both gender and lunch type to compute average math scores?',
    options: [
      'df.groupby("gender")["math score"].mean()',
      'df.groupby(["gender", "lunch"])["math score"].mean()',
      'df.groupby("lunch")["gender"].mean()',
      'df["math score"].groupby(["gender", "lunch"]).mean()'
    ],
    correctAnswer:
      'df.groupby(["gender", "lunch"])["math score"].mean()',
    hint: 'Think about grouping by two categorical columns at once.',
    explanation:
      'groupby(["gender", "lunch"]) creates groups for each gender–lunch combination, and mean() computes average math scores in each group.'
  }
];

export default quiz;