const quiz = [
  {
    id: 'install-libraries-1',
    question: 'What is a Python library?',
    options: [
      'A collection of pre-written code designed to perform specific tasks',
      'A physical place where books are stored',
      'A type of chart used in data visualization',
      'A variable that stores numbers only'
    ],
    correctAnswer: 'A collection of pre-written code designed to perform specific tasks',
    hint: 'Think about reusable tools you can import into your program.',
    explanation:
      'A library is a collection of pre-written code that you can reuse instead of writing everything yourself.'
  },
  {
    id: 'install-libraries-2',
    question: 'Which command is used to install a library like Pandas?',
    options: [
      'python install pandas',
      'pip install pandas',
      'import pandas',
      'run pandas'
    ],
    correctAnswer: 'pip install pandas',
    hint: 'Installation is done from the terminal or command line.',
    explanation:
      'Most Python libraries are installed with pip, using commands such as pip install pandas.'
  },
  {
    id: 'install-libraries-3',
    question: 'What is the difference between installing and importing a library?',
    options: [
      'Installing makes the library available on your system; importing allows you to use it in a program',
      'Installing is only for Colab; importing is only for local Python',
      'Installing and importing mean the same thing',
      'Importing removes the library from your system'
    ],
    correctAnswer:
      'Installing makes the library available on your system; importing allows you to use it in a program',
    hint: 'Think about when you run pip and when you write import in code.',
    explanation:
      'Installation is usually done once per environment, while importing is done in each program that uses the library.'
  },
  {
    id: 'install-libraries-4',
    question: 'Why do many programs use aliases like pd and np?',
    options: [
      'To make code shorter and easier to read',
      'Because Python requires aliases for all libraries',
      'To hide which libraries are being used',
      'To avoid importing the libraries'
    ],
    correctAnswer: 'To make code shorter and easier to read',
    hint: 'Think about typing pandas.read_csv() versus pd.read_csv().',
    explanation:
      'Aliases like pd and np are conventions that keep code concise while still being clear to other developers.'
  },
  {
    id: 'install-libraries-5',
    question: 'Which library would you typically use to create an interactive chart?',
    options: [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Plotly'
    ],
    correctAnswer: 'Plotly',
    hint: 'Think about which library is known for interactive visualizations.',
    explanation:
      'Plotly (often used via plotly.express as px) is commonly used for interactive charts and dashboards.'
  }
];

export default quiz;