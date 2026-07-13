const quiz = [
  {
    id: 'filtering-data-1',
    question: 'Which expression filters students with math scores greater than 90?',
    options: [
      'df["math score"] > 90',
      'df[df["math score"] > 90]',
      'df[df["math score"] == 90]',
      'df["math score"] == 90'
    ],
    correctAnswer: 'df[df["math score"] > 90]',
    hint: 'Think about selecting only the rows that match the condition.',
    explanation:
      'df[df["math score"] > 90] returns a filtered DataFrame containing only rows where the math score is greater than 90.'
  },
  {
    id: 'filtering-data-2',
    question: 'Which comparison operator checks if two values are equal?',
    options: [
      '=',
      '==',
      '!=',
      '>= '
    ],
    correctAnswer: '==',
    hint: 'In Python, assignment and comparison use different symbols.',
    explanation:
      'The == operator checks for equality. The = symbol is used for assignment, not comparison.'
  },
  {
    id: 'filtering-data-3',
    question: 'How do you select female students who scored above 80 in math?',
    options: [
      'df[df["gender"] == "female" & df["math score"] > 80]',
      'df[(df["gender"] == "female") & (df["math score"] > 80)]',
      'df[(df["gender"] = "female") & (df["math score"] > 80)]',
      'df[(df["gender"] == "female") and (df["math score"] > 80)]'
    ],
    correctAnswer: 'df[(df["gender"] == "female") & (df["math score"] > 80)]',
    hint: 'Use parentheses and the & operator between conditions.',
    explanation:
      'For DataFrame filtering, you combine conditions with & and wrap each condition in parentheses.'
  },
  {
    id: 'filtering-data-4',
    question: 'What does the | operator mean when filtering a DataFrame?',
    options: [
      'AND',
      'OR',
      'NOT',
      'EQUAL'
    ],
    correctAnswer: 'OR',
    hint: 'Think about allowing either condition to be true.',
    explanation:
      'The | operator means OR: a row is included if at least one of the conditions is true.'
  },
  {
    id: 'filtering-data-5',
    question: 'How can you select students who did NOT complete the test preparation course?',
    options: [
      'df[df["test preparation course"] != "completed"]',
      'df[~(df["test preparation course"] == "completed")]',
      'df[(df["test preparation course"] == "completed")]',
      'df[(df["test preparation course"] == "not completed")]'
    ],
    correctAnswer: 'df[~(df["test preparation course"] == "completed")]',
    hint: 'Use a NOT operator to invert the condition.',
    explanation:
      'The ~ operator negates the condition, so rows where the course is completed are excluded and all others are kept.'
  }
];

export default quiz;