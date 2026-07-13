const quiz = [
  {
    question: "What does a data type describe?",
    options: [
      "The color of a variable",
      "The kind of value stored in a variable",
      "The location of a file",
      "The name of a function"
    ],
    correctAnswer: 1,
    explanation:
      "A data type describes the kind of value stored in a variable, such as text, whole numbers, decimal numbers, or Boolean values."
  },
  {
    question: "Which data type is used to store text in Python?",
    options: [
      "`int`",
      "`float`",
      "`str`",
      "`bool`"
    ],
    correctAnswer: 2,
    explanation:
      "The `str` data type is used to store text values in Python."
  },
  {
    question: "Which of the following is a floating-point number?",
    options: [
      "`42`",
      "`\"42\"`",
      "`True`",
      "`42.5`"
    ],
    correctAnswer: 3,
    explanation:
      "A floating-point number contains a decimal value, such as `42.5`."
  },
  {
    question: "What does the `type()` function do?",
    options: [
      "It changes text into numbers",
      "It tells you the data type of a value",
      "It prints a chart",
      "It saves a notebook"
    ],
    correctAnswer: 1,
    explanation:
      "The `type()` function shows the data type of a value or variable."
  },
  {
    question: "Which Boolean value is written correctly in Python?",
    options: [
      "`true`",
      "`false`",
      "`TRUE`",
      "`True`"
    ],
    correctAnswer: 3,
    explanation:
      "Python is case-sensitive, so Boolean values must be written as `True` or `False`."
  }
];

export default quiz;