const llmPrompts = {
  achievements: (periodType, data) => `
    Instructions:
    Looking at the user's journal entries from the past ${periodType}, extract 3 achievements that the user has made that are truly worthy of celebration. It should feel sort of like a video game achievement, but based on their real-life accomplishments.

    Return the three achievements in JSON format with two fields:
    - overviewType: "achievements"
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
  `
};

module.exports = llmPrompts;