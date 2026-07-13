const quiz = [
  {
    question: "What is type conversion?",
    options: [
      "Changing one data type into another",
      "Deleting a variable from memory",
      "Printing the value of a variable",
      "Renaming a function"
    ],
    correctAnswer: 0,
    explanation:
      "Type conversion is the process of changing a value from one data type into another."
  },
  {
    question: "Which function converts a string such as \"21\" into a whole number?",
    options: [
      "float()",
      "bool()",
      "int()",
      "str()"
    ],
    correctAnswer: 2,
    explanation:
      "The `int()` function converts a value into an integer."
  },
  {
    question: "Why does `age = input(\"Enter your age: \")` often need conversion afterward?",
    options: [
      "Because `input()` returns a float",
      "Because `input()` always returns a string",
      "Because `input()` creates a Boolean",
      "Because `input()` deletes spaces"
    ],
    correctAnswer: 1,
    explanation:
      "The `input()` function returns text, so numbers entered by the user often need to be converted before calculation."
  },
  {
    question: "What is the result of `bool(\"False\")`?",
    options: [
      "`False`",
      "`True`",
      "An error",
      "`0`"
    ],
    correctAnswer: 1,
    explanation:
      "A non-empty string is truthy in Python, so `bool(\"False\")` evaluates to `True`."
  },
  {
    question: "Which conversion is most appropriate for the string `\"45.99\"`?",
    options: [
      "`int()`",
      "`float()`",
      "`bool()`",
      "`type()`"
    ],
    correctAnswer: 1,
    explanation:
      "Because the value contains a decimal point, `float()` is the most appropriate conversion."
  }
];

export default quiz;