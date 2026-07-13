const quiz = [
  {
    id: 'boxplots-1',
    question: 'What does the line inside the box of a boxplot represent?',
    options: [
      'The maximum value',
      'The mean',
      'The median',
      'The mode'
    ],
    correctAnswer: 'The median',
    hint: 'It represents the middle value of the data.',
    explanation:
      'The line inside the box shows the median, which is the middle value when the data is ordered.'
  },
  {
    id: 'boxplots-2',
    question: 'What does the box itself usually represent?',
    options: [
      'The full range of the data',
      'The middle 50% of the data',
      'Only the outliers',
      'The mean and standard deviation'
    ],
    correctAnswer: 'The middle 50% of the data',
    hint: 'Think about Q1 to Q3.',
    explanation:
      'The box extends from the first quartile (Q1) to the third quartile (Q3), so it represents the middle 50% of the data.'
  },
  {
    id: 'boxplots-3',
    question: 'What is the interquartile range (IQR)?',
    options: [
      'The distance from the minimum to the maximum',
      'The distance from the median to the maximum',
      'The distance between Q1 and Q3',
      'The number of outliers'
    ],
    correctAnswer: 'The distance between Q1 and Q3',
    hint: 'It measures the spread of the middle half of the data.',
    explanation:
      'The interquartile range is calculated as Q3 minus Q1 and describes the spread of the middle 50% of the data.'
  },
  {
    id: 'boxplots-4',
    question: 'Why are boxplots especially useful?',
    options: [
      'They show exact frequencies for every value',
      'They are useful for comparing distributions across groups',
      'They only work for categorical data',
      'They replace all other chart types'
    ],
    correctAnswer: 'They are useful for comparing distributions across groups',
    hint: 'Think about side-by-side boxplots.',
    explanation:
      'Boxplots are especially helpful for comparing medians, spread, and outliers across multiple groups.'
  },
  {
    id: 'boxplots-5',
    question: 'What might a point beyond the whiskers represent?',
    options: [
      'A category label',
      'A plotting error',
      'A possible outlier',
      'The mean'
    ],
    correctAnswer: 'A possible outlier',
    hint: 'It is a value far from the rest of the distribution.',
    explanation:
      'A point beyond the whiskers usually indicates a possible outlier, meaning an unusually low or high observation.'
  }
];

export default quiz;