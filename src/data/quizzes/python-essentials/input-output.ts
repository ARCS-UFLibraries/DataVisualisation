const quiz = [
  {
    question: "What is output in a Python program?",
    options: [
      "Data stored in variables",
      "Information displayed to the user",
      "Code written by the programmer",
      "Values entered by the user"
    ],
    correctAnswer: 1,
    explanation:
      "Output is information that a program displays to the user, often using the print() function."
  },
  {
    question: "Which function is used to collect user input in Python?",
    options: [
      "print()",
      "len()",
      "input()",
      "type()"
    ],
    correctAnswer: 2,
    explanation:
      "The input() function displays a prompt and returns whatever the user types."
  },
  {
    question: "What data type does input() return by default?",
    options: [
      "int",
      "float",
      "str",
      "bool"
    ],
    correctAnswer: 2,
    explanation:
      "input() always returns a string. If you need a number, you must convert the result using int() or float()."
  },
  {
    question: "Which line correctly collects an age and allows arithmetic with it?",
    options: [
      'age = input("Age: ")',
      'age = int(input("Age: "))',
      'age = float("Age: ")',
      'age = print(input("Age: "))'
    ],
    correctAnswer: 1,
    explanation:
      'age = int(input("Age: ")) converts the text returned by input() into an integer so you can perform arithmetic.'
  },
  {
    question: "Which example correctly stores and then prints the user’s city?",
    options: [
      'input("Enter your city: ")\nprint(city)',
      'city = input("Enter your city: ")\nprint(city)',
      'input("Enter your city: ")\nprint(input)',
      'city = print("Enter your city: ")'
    ],
    correctAnswer: 1,
    explanation:
      'city = input("Enter your city: ") stores the user’s input in a variable, and print(city) displays it.'
  }
];

export default quiz;