const vectorPrompts = {
  achievements: `achievement or accomplishment attained`,
  quotes: 'moments of joy, gratitude, triumph, love, friendship'
}

const llmPrompts = {
  tagCloud: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, generate data for a tag cloud of standout topics. The size of the word should be proportional to the degree of relevance to the entries.
    Feel free to use specific names of people or places, or general topics like "love" or "work".

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
  suggestions: (periodType, data) => `
    Instructions:
    Looking at the user's stated challenges / growth areas, vision / dream, and specific goals in addition to their journal entries from the past ${periodType}, generate 1-3 sentence suggestions for the user.

    return 3 suggestions in JSON format with one field:
    - suggestions: [
      {
        'category': [the category of the suggestion],
        'suggestion': [the suggestion],
      },
      ...repeat for the other suggestions
    ]

    Challenges and journal entry data:
    ${data}
  `,
  promptSuggestions: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, generate 3 suggested journal prompts for the user to write to in the future. Make the prompts short, thought provoking questions or prompts. Return each in barebones html formatting similar to this example:
    <div><span style="color: #ada8a8; font-weight: bold;">Example prompt</span><span style="color: #ffffff">&nbsp;</span></div>

    Note in the example, that the color must be set to #ada8a8, and that there is a span at the end set to #ffffff, so that when the user types next to the prompt on the same line or on the next line, the text will be white. The result is that the prompt is gray while the user text is white.
    Also note that the prompt can span multiple new lines for multipart prompts.
    
    Return the three prompts in JSON format with one field containing an array:
    - promptSuggestions: [
      [the prompt in html format],
      ...repeat for the other prompts
    ]

    Journal entry data:
    ${data}
  `,  
};

module.exports = { vectorPrompts, llmPrompts }