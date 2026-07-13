const quiz = [
  {
    question: "Why are collections useful in Python?",
    options: [
      "They make variables store only one value",
      "They allow you to store multiple values in a single variable",
      "They are used only for web programming",
      "They replace all built-in functions"
    ],
    correctAnswer: 1,
    explanation:
      "Collections group multiple values together inside one structure, making programs easier to write and maintain."
  },
  {
    question: "Which of the following creates a list, not a tuple?",
    options: [
      'students = ("Emma", "Alex")',
      'students = {"Emma", "Alex"}',
      'students = ["Emma", "Alex"]',
      'students = "Emma", "Alex"'
    ],
    correctAnswer: 2,
    explanation:
      'Lists are created with square brackets: ["Emma", "Alex"]. Parentheses create tuples, and curly braces create sets or dictionaries.'
  },
  {
    question: "What value does students[0] return for this list?\n\nstudents = [\"Emma\", \"Alex\", \"Sophia\"]",
    options: [
      '"Emma"',
      '"Alex"',
      '"Sophia"',
      "It causes an IndexError"
    ],
    correctAnswer: 0,
    explanation:
      "Indexing starts at 0, so students[0] returns the first element: \"Emma\"."
  },
  {
    question: "Which method adds a new element to the end of a list?",
    options: [
      "add()",
      "insert()",
      "append()",
      "extend()"
    ],
    correctAnswer: 2,
    explanation:
      "append() adds a single new element to the end of a list."
  },
  {
    question: "Which description of collection types is correct?",
    options: [
      "Lists are ordered and changeable; tuples are ordered and unchangeable",
      "Dictionaries store only numbers; sets store only strings",
      "Tuples are unordered; sets are ordered",
      "Lists and tuples both store key–value pairs"
    ],
    correctAnswer: 0,
    explanation:
      "Lists are ordered and mutable, while tuples are ordered but immutable. Dictionaries store key–value pairs, and sets store unique values."
  }
];

export default quiz;