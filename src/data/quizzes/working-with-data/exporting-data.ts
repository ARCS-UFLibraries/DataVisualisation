const quiz = [
  {
    id: 'exporting-data-1',
    question: 'How do you export a DataFrame to a CSV file without the index?',
    options: [
      'df.to_csv("students_clean.csv")',
      'df.to_csv("students_clean.csv", index=False)',
      'df.to_csv(index=False)',
      'df.to_csv("students_clean.csv", no_index=True)'
    ],
    correctAnswer: 'df.to_csv("students_clean.csv", index=False)',
    hint: 'Look for the parameter that controls index export.',
    explanation:
      'Passing index=False to to_csv() prevents the DataFrame index from being written as an extra column.'
  },
  {
    id: 'exporting-data-2',
    question: 'Which command exports a DataFrame to an Excel workbook?',
    options: [
      'df.to_excel("students_clean.xlsx", index=False)',
      'df.to_csv("students_clean.xlsx", index=False)',
      'df.to_excel("students_clean.csv")',
      'df.save_excel("students_clean.xlsx")'
    ],
    correctAnswer: 'df.to_excel("students_clean.xlsx", index=False)',
    hint: 'Use the method designed specifically for Excel output.',
    explanation:
      'The to_excel() method writes the DataFrame to an Excel file, and index=False omits the index column.'
  },
  {
    id: 'exporting-data-3',
    question:
      'How do you export only gender, math score, and reading score to CSV?',
    options: [
      'df.to_csv(["gender", "math score", "reading score"], index=False)',
      'df["gender", "math score", "reading score"].to_csv("scores.csv", index=False)',
      'df[["gender", "math score", "reading score"]].to_csv("scores.csv", index=False)',
      'df.groupby(["gender", "math score", "reading score"]).to_csv("scores.csv")'
    ],
    correctAnswer:
      'df[["gender", "math score", "reading score"]].to_csv("scores.csv", index=False)',
    hint: 'First select the columns, then call to_csv().',
    explanation:
      'Selecting the desired columns and then calling to_csv() exports only those variables to the file.'
  },
  {
    id: 'exporting-data-4',
    question:
      'Which sequence exports students with math score >= 90 to a CSV file?',
    options: [
      'df.to_csv("high_math_scores.csv", index=False)',
      'df[df["math score"] >= 90].to_csv("high_math_scores.csv", index=False)',
      'df["math score"] >= 90.to_csv("high_math_scores.csv")',
      'df.to_csv("high_math_scores.csv", filter="math score >= 90")'
    ],
    correctAnswer:
      'df[df["math score"] >= 90].to_csv("high_math_scores.csv", index=False)',
    hint: 'Filter first, then export.',
    explanation:
      'Filtering the DataFrame and then calling to_csv() saves only the rows that meet the condition.'
  },
  {
    id: 'exporting-data-5',
    question:
      'How can you download an exported CSV file from Google Colab to your computer?',
    options: [
      'files.download("students_clean.csv")',
      'df.download("students_clean.csv")',
      'to_csv.download("students_clean.csv")',
      'colab.download("students_clean.csv")'
    ],
    correctAnswer: 'files.download("students_clean.csv")',
    hint: 'Use the helper in google.colab.files.',
    explanation:
      'In Colab, you import google.colab.files and call files.download() with the filename to download the file.'
  }
];

export default quiz;