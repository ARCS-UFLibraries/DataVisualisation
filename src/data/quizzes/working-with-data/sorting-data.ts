const quiz = [
  {
    id: 'sorting-data-1',
    question: 'Which command sorts the DataFrame by math score in ascending order?',
    options: [
      'df.sort_values("math score")',
      'df.sort_values("math score", ascending=False)',
      'df.sort_values(["math score"], ascending=[False])',
      'df.head().sort_values("math score")'
    ],
    correctAnswer: 'df.sort_values("math score")',
    hint: 'Think about the default sorting direction.',
    explanation:
      'sort_values("math score") sorts in ascending order by default, placing the smallest values first.'
  },
  {
    id: 'sorting-data-2',
    question: 'How do you sort math scores in descending order?',
    options: [
      'df.sort_values("math score")',
      'df.sort_values("math score", ascending=False)',
      'df.sort_values("math score", descending=True)',
      'df.sort_values("math score", order="desc")'
    ],
    correctAnswer: 'df.sort_values("math score", ascending=False)',
    hint: 'Look for the parameter that changes the order.',
    explanation:
      'Setting ascending=False tells Pandas to order values from highest to lowest.'
  },
  {
    id: 'sorting-data-3',
    question: 'Which command sorts by gender and then math score?',
    options: [
      'df.sort_values("gender", "math score")',
      'df.sort_values(["gender", "math score"])',
      'df.sort_values(["gender"])["math score"]',
      'df.sort_values("math score").sort_values("gender")'
    ],
    correctAnswer: 'df.sort_values(["gender", "math score"])',
    hint: 'Think about passing a list of column names.',
    explanation:
      'Providing a list of columns to sort_values sorts first by gender and then by math score.'
  },
  {
    id: 'sorting-data-4',
    question: 'How can you see the top five students in math?',
    options: [
      'df.head(5)',
      'df.sort_values("math score").head(5)',
      'df.sort_values("math score", ascending=False).head(5)',
      'df.sort_values("math score", ascending=False).tail(5)'
    ],
    correctAnswer: 'df.sort_values("math score", ascending=False).head(5)',
    hint: 'First order by highest scores, then preview the first few rows.',
    explanation:
      'Sorting in descending order and using head(5) shows the five highest math scores.'
  },
  {
    id: 'sorting-data-5',
    question: 'Does df.sort_values("math score") change df permanently?',
    options: [
      'Yes, df is always changed',
      'No, it returns a new sorted DataFrame unless you assign it',
      'Yes, but only if ascending=False',
      'No, it only changes the column order'
    ],
    correctAnswer:
      'No, it returns a new sorted DataFrame unless you assign it',
    hint: 'Think about whether the result is stored back into df.',
    explanation:
      'sort_values() returns a sorted copy. The original df stays the same unless you assign the result back to df.'
  }
];

export default quiz;