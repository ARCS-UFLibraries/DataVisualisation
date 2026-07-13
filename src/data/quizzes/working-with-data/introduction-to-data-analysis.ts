const quiz = [
  {
    id: 'intro-data-analysis-1',
    question: 'What is data analysis?',
    options: [
      'The process of decorating charts to make them look better',
      'The process of collecting, cleaning, exploring, and interpreting data to answer questions',
      'A way to store passwords in a database',
      'A programming language used only for statistics'
    ],
    correctAnswer: 'The process of collecting, cleaning, exploring, and interpreting data to answer questions',
    hint: 'Think about the full process, not just one step.',
    explanation:
      'Data analysis involves working with data from start to finish so that you can answer questions or solve problems.'
  },
  {
    id: 'intro-data-analysis-2',
    question: 'Which of the following is part of a typical data analysis workflow?',
    options: [
      'Clean the data',
      'Ignore missing values',
      'Delete the dataset immediately',
      'Memorize every row by hand'
    ],
    correctAnswer: 'Clean the data',
    hint: 'A workflow includes steps that help prepare data for useful analysis.',
    explanation:
      'Cleaning the data is an important step because real-world datasets often contain missing, incorrect, or inconsistent values.'
  },
  {
    id: 'intro-data-analysis-3',
    question: 'Which file type will be used most often in the beginner examples in this course?',
    options: [
      'CSV and Excel files',
      'Only image files',
      'Only video files',
      'Only PDF files'
    ],
    correctAnswer: 'CSV and Excel files',
    hint: 'Think about common tabular data formats.',
    explanation:
      'CSV and Excel files are common ways to store tabular data, so they are a good starting point for beginners learning data analysis.'
  },
  {
    id: 'intro-data-analysis-4',
    question: 'Why is Python widely used for data analysis?',
    options: [
      'Because it can only be used with spreadsheets',
      'Because it is readable and has powerful libraries for working with data',
      'Because it automatically solves every data problem',
      'Because it does not require any libraries'
    ],
    correctAnswer: 'Because it is readable and has powerful libraries for working with data',
    hint: 'Think about ease of use and helpful tools.',
    explanation:
      'Python is popular for data analysis because its syntax is readable and it has strong libraries such as Pandas, NumPy, Matplotlib, Plotly, and Seaborn.'
  },
  {
    id: 'intro-data-analysis-5',
    question: 'Which question is an example of data analysis thinking?',
    options: [
      'What is the average GPA in this dataset?',
      'What color should I paint my notebook?',
      'How do I rename my Wi-Fi network?',
      'Which keyboard sounds the best?'
    ],
    correctAnswer: 'What is the average GPA in this dataset?',
    hint: 'Look for a question that can be answered using values from a dataset.',
    explanation:
      'Data analysis starts with questions that can be explored and answered using data, such as averages, trends, comparisons, and patterns.'
  }
];

export default quiz;