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
  summary: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, summarize the user's experience in a less than 8 sentences. 

    Journal entry data:
    ${data}
  `,
  goals: (periodType, data) => `
    Instructions:
    Looking at the user's stated vision / dream and specific goals in addition to their journal entries from the past ${periodType}, generate an overview and analysis of the user's progress towards their vision and specific goals in less than 8 sentences. Be sure to address progress etc. on each specific goal.

    Goal and journal entry data:
    ${data}
  `,
  personality: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, generate a personality analysis of the user.

    Return the personality analysis (3 personality traits total) in JSON format with one field:
    - personality: [
      {
        'trait': [the personality trait],
        'analysis': [a 1-2 sentence introspective analysis of this dimension of the user's personality],
        'emoji': [an actual emoji that represents the personality trait],
        'score': [a number between 0-1 representing the strength of the trait. 1 is the strongest]
      },
      ...repeat for the other traits
    ]

    Journal entry data:
    ${data}
  `,
};

module.exports = { vectorPrompts, llmPrompts }