const optionalFragmenting = (promptText) => `
Break down journal entries into chunks based on distinct topics. Only break it apart if there are stark differences in the topics covered. 90% of the time, you'll return the entry as a single chunk:

  1. If the entry focuses solely on one topic, return it as a single chunk.
  2. If the entry covers multiple topics, split it into chunks, each corresponding to a different topic. (Note: Separate topics may often be within the SAME HTML tags, so don't rely solely on HTML structure for separation. Conversely, topics may appear to be separate due to HTML formatting but are actually related.)
  3. During the final pass, discard or merge any chunk that lacks both a subject and a verb, ensuring that each retained chunk forms a complete sentence.  
  4. Remove any HTML tags in the entry.
  5. Remove the journal prompt. It is: "${promptText}".
  6. If the chunk(s) require context of the prompt to understand, include the prompt at the beginning of the string in parentheses. If it is a long prompt, you can summarize it.
  6. Return the Chunk(s) as a JSON object with two fields:
   - entryId: The ID of the journal entry.
   - chunks: An array of strings, each representing a chunk of the entry (there will probably be just one).
`

const extractTagRelatedContent = (tags) => `
  You're tasked with extracting content from a journal entry based on specific tags.
  Tags to consider: ${tags}

  Instructions:
  1. If the entry doesn't contain any content matching the tags, return an empty array.
  2. If the whole entry relates to a tag, return it as a single chunk.
  3. Strip out all HTML tags from the entry.
  4. Remove journal prompts. These are in divs with the style "color: #ada8a8". Prompts might span multiple lines, with content in between, or be mixed with text. Remove all such divs and their contents.
  5. Return the Chunks as a JSON object with two fields:
   - entryId: The ID of the journal entry.
   - tags: [{
      tagId: The tag that the content is related to (just the tagId, not the extended description)
      chunks: An array of strings, each representing a chunk of the entry related to the tag.
    }]
  `


const tagObjs = [
  {
    tagId: "JoysPassions",
    description: "Joys and passions: Programming, both as an occupation and side hustle, aiming to become an entrepreneur"
  },
  {
    tagId: "ChallengesGrowthAreas",
    description: "Challenges and growth areas: leadership skills, friendship skills, physical health, aiming for a six-figure salary and financial independence"
  },
  {
    tagId: "VisionDream",
    description: "Dream: grow Journal365 to 3,000 users, secure an apartment in Austin, practice Jiu-Jitsu, live the digital nomad dream for a bit, achieve financial independence"
  },
  {
    tagId: "Goals",
    description: "Specific goals: grow Journal365 to 3,000 users, secure an apartment in Austin, practice Jiu-Jitsu, live the digital nomad dream for a bit, achieve financial independence"
  }
]

const makeChatInput = (body, entryId, promptText) => {
  const assistantPrompt = `entryId: ${entryId}`

  return [
    { "role": "system", "content": optionalFragmenting(promptText) },
    { "role": "assistant", "content": assistantPrompt },
    { "role": "user", "content": body }
  ];
}

module.exports = { makeChatInput }