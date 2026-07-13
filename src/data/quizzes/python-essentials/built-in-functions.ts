const quiz = [
  {
    question: "What is a function in Python?",
    options: [
      "A special type of variable",
      "A reusable piece of code that performs a specific task",
      "A comment that explains code",
      "A file that stores data"
    ],
    correctAnswer: 1,
    explanation:
      "A function is reusable code that performs a specific task. You call it, optionally pass arguments, and it returns a result or performs an action."
  },
  {
    question: "Which built-in function can tell you how many items are in a list?",
    options: [
      "type()",
      "len()",
      "max()",
      "round()"
    ],
    correctAnswer: 1,
    explanation:
      "The len() function returns the number of items in a collection such as a list or a string."
  },
  {
    question: "What does input() return by default?",
    options: [
      "An integer",
      "A float",
      "A string",
      "A Boolean"
    ],
    correctAnswer: 2,
    explanation:
      "The input() function always returns a string. If you need a number, you must convert it using int() or float()."
  },
  {
    question: "Which function returns the largest value in a list of numbers?",
    options: [
      "max()",
      "min()",
      "round()",
      "len()"
    ],
    correctAnswer: 0,
    explanation:
      "The max() function returns the largest value in a collection, such as a list of scores."
  },
  {
    question: "Which line correctly calls the print() function?",
    options: [
      "print",
      "print[]",
      "print()",
      "print{}"
    ],
    correctAnswer: 2,
    explanation:
      "Functions must be called with parentheses. print() correctly calls the print function."
  }
];

export default quiz;