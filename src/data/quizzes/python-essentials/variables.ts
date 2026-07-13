const variablesQuiz = [
  {
    id: 'variables-q1',
    question: 'What is a variable in Python?',
    options: [
      'A command that always prints output',
      'A named location that stores a value',
      'A type of chart used in data analysis',
      'A rule for formatting notebooks',
    ],
    correctAnswer: 1,
    hint: 'Think about what helps a program remember information.',
    explanation:
      'A variable is a named location that stores a value. It allows you to save information and use it later in your program.',
  },
  {
    id: 'variables-q2',
    question: 'What does the equals sign (=) mean in Python?',
    options: [
      'It compares two values',
      'It means mathematical equality only',
      'It assigns the value on the right to the variable on the left',
      'It joins two strings together',
    ],
    correctAnswer: 2,
    hint: 'Read the statement from right to left.',
    explanation:
      'In Python, = is used for assignment. It tells Python to store the value on the right inside the variable on the left.',
  },
  {
    id: 'variables-q3',
    question: 'Which of the following is the best variable name?',
    options: ['x', 'a123', 'student_name', 'data stuff'],
    correctAnswer: 2,
    hint: 'Choose the name that clearly describes what is being stored.',
    explanation:
      'Meaningful variable names such as student_name make code easier to read and understand.',
  },
  {
    id: 'variables-q4',
    question: 'What will this code print?\n\nscore = 80\nscore = 92\nprint(score)',
    options: ['80', '92', 'score', 'An error'],
    correctAnswer: 1,
    hint: 'Look at the most recent value assigned to the variable.',
    explanation:
      'The variable score is updated from 80 to 92, so print(score) displays 92.',
  },
  {
    id: 'variables-q5',
    question: 'Which statement is correct?',
    options: [
      'name = "Alex"',
      "student name = 'Emma'",
      '2marks = 95',
      'course title = Data Visualization',
    ],
    correctAnswer: 0,
    hint: 'Check quotation marks, spaces, and whether the name starts with a number.',
    explanation:
      'name = "Alex" is correct because the variable name has no spaces, does not start with a number, and the text value is placed in quotation marks.',
  },
];

export default variablesQuiz;