const controlFlowQuiz = [
  {
    id: 'control-flow-q1',
    question: 'What does a comparison operator return in Python?',
    options: ['A string', 'A Boolean value', 'A list', 'A loop'],
    correctAnswer: 1,
    hint: 'Think about whether the result tells you yes/no.',
    explanation:
      'Comparison operators return Boolean values: either True or False.',
  },
  {
    id: 'control-flow-q2',
    question: 'Which statement is used to check multiple conditions in sequence?',
    options: ['repeat', 'elif', 'break', 'range'],
    correctAnswer: 1,
    hint: 'It comes after if when you want another condition.',
    explanation:
      'The elif statement lets you test another condition after if.',
  },
  {
    id: 'control-flow-q3',
    question: 'Which loop is best when you want to go through every item in a list?',
    options: ['for loop', 'while loop', 'if statement', 'else statement'],
    correctAnswer: 0,
    hint: 'This loop is commonly used with lists.',
    explanation:
      'A for loop is usually used to iterate through items in a list or sequence.',
  },
  {
    id: 'control-flow-q4',
    question: 'What does break do inside a loop?',
    options: [
      'Skips one item and continues',
      'Ends the loop immediately',
      'Restarts the loop',
      'Creates a new condition',
    ],
    correctAnswer: 1,
    hint: 'It does not just skip one turn.',
    explanation:
      'The break statement stops the loop immediately.',
  },
  {
    id: 'control-flow-q5',
    question: 'What does continue do inside a loop?',
    options: [
      'Ends the program',
      'Repeats the same iteration',
      'Skips the current iteration and moves to the next one',
      'Prints the next value',
    ],
    correctAnswer: 2,
    hint: 'The loop keeps going, but one turn is skipped.',
    explanation:
      'The continue statement skips the current iteration and moves to the next one.',
  },
];

export default controlFlowQuiz;