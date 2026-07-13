const functionsQuiz = [
  {
    id: 'functions-q1',
    question: 'What is a function in Python?',
    options: [
      'A reusable block of code that performs a task',
      'A special kind of list',
      'A way to store only numbers',
      'A comparison operator',
    ],
    correctAnswer: 0,
    hint: 'Think about why functions help reduce repeated code.',
    explanation:
      'A function is a reusable block of code that performs a specific task.',
  },
  {
    id: 'functions-q2',
    question: 'Which keyword is used to define a function in Python?',
    options: ['function', 'define', 'def', 'return'],
    correctAnswer: 2,
    hint: 'It is a short three-letter keyword.',
    explanation:
      'Python uses the def keyword to define a function.',
  },
  {
    id: 'functions-q3',
    question: 'What is a parameter?',
    options: [
      'A value printed by a function',
      'An input a function accepts',
      'A loop inside a function',
      'A type of variable that only stores text',
    ],
    correctAnswer: 1,
    hint: 'It is part of the function definition and receives input.',
    explanation:
      'Parameters are the inputs a function accepts when it runs.',
  },
  {
    id: 'functions-q4',
    question: 'Why is return useful in a function?',
    options: [
      'It repeats the function automatically',
      'It sends a value back to the program',
      'It prints the function name',
      'It removes parameters',
    ],
    correctAnswer: 1,
    hint: 'The value can be stored and reused later.',
    explanation:
      'The return statement sends a value back so the program can store or reuse it.',
  },
  {
    id: 'functions-q5',
    question: 'Where can a local variable created inside a function be used?',
    options: [
      'Anywhere in the program',
      'Only inside that function',
      'Only inside loops',
      'Only after print() is used',
    ],
    correctAnswer: 1,
    hint: 'Think about the meaning of local scope.',
    explanation:
      'A local variable belongs to the function where it was created and can only be used there.',
  },
];

export default functionsQuiz;