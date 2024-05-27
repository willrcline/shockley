const vectorPrompts = {
  achievements: `achievement or accomplishment attained`,
  quotes: 'moments of joy, gratitude, triumph, love, friendship'
}

const llmPrompts = {
  tagCloud: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, generate data for a tag cloud of the most frequently used words. The size of the word should be proportional to the frequency of its use.

    Create 20 words or phrases. Return the data in JSON format with one field:
    - tagCloud: [
      {
        title: [the word or phrase],
        sizeMultiplier: [a number representing the frequency of the word's use. Between 1-10, with 10 being the most frequent]
      }

    Journal entry data:
    ${data}
  `,
  achievements: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, extract 3 achievements that the user has made that are truly worthy of celebration. It should feel sort of like a video game achievement, but based on their real-life accomplishments.

    Return the three achievements in JSON format with one field:
    - achievements: [
      {
        'emoji': [an actual emoji that represents the achievement],
        'title': [a title for the achievement],
        'description': [a 1-2 description of the achievement]
      },
      ...repeat for the other two achievements
    ]

    Journal entry data:
  ${data}
  `,
  visualized: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, generate an image that brings to life a strongly visual part from their entries or a symbolic representation of their entries. Put it in the style of a stunning painting.

    Journal entry data:
    ${data}
  `,
  quotes: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, extract 3 quotes. Choose quotes about moments of joy, gratitude, triumph, love, friendship etc.

    Return the three quotes in JSON format with one field:
    - quotes: [
      {
        'quote': [the quote],
        'date': [the date the quote was written which will be above the entry it was extracted from. format: 05/23/2023],
      },
      ...repeat for the other two quotes
    ]

    Journal entry data:
    ${data}
  `,


};

module.exports = { vectorPrompts, llmPrompts }