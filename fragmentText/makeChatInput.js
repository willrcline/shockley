const sentences = `
You're assisting in breaking down a journal entry into individual sentences. The entry might lack grammatical correctness, so you'll need to determine suitable places to break even in the absence of periods.

Instructions:
1. Only include sentences which actually stand alone as a full sentence (it doesn't have to be a gramatically perfect sentence but it should atleast have a subject and a verb implied in there). Just omit things that are just a few words or less or don't make sense on their own. If there is nothing in the entry that qualifies as a sentence, return an empty array.
2. Remove any journal prompts. The prompt text will be enclosed in div tags with the property "color: #ada8a8". The prompt could span multiple lines, with actual content in between. Sometimes prompt text will be inline with content text. Regardless, remove all of these div tags and their contents.
3. Ensure that you're not modifying the content itself; only break it into fragments that roughly correspond to sentences. 
4. Remove any HTML tags present in the entry.
5. Return the fragments as a JSON object with two fields:
   - entryId: The ID of the journal entry.
   - fragments: An array of strings, each representing a fragment of the entry.
`

const optionalFragmenting = (promptText) => `
Break down journal entries into chunks based on distinct topics. Only break it apart if there are stark differences in the topics covered. 90% of the time, you'll return the entry as a single chunk:

  1. If the entry focuses solely on one topic, return it as a single chunk.
  2. If the entry covers multiple topics, split it into chunks, each corresponding to a different topic. (Note: Separate topics may often be within the SAME HTML tags, so don't rely solely on HTML structure for separation. Conversely, topics may appear to be separate due to HTML formatting but are actually related.)
  3. During the final pass, discard or merge any chunk that lacks both a subject and a verb, ensuring that each retained chunk forms a complete sentence.  
  4. Remove any HTML tags in the entry.
  5. Remove the journal prompt. It is: "${promptText}".
  6. Return the Chunk(s) as a JSON object with two fields:
   - entryId: The ID of the journal entry.
   - fragments: An array of strings, each representing a chunk of the entry (there will probably be just one).
`

const multipleSentences = `
Break down journal entries into chunks of about 3 adjacent sentences each:
  1. Remove html tags.
  2. Remove the journal prompt.
  3. Return the Chunks as a JSON object with two fields:
   - entryId: The ID of the journal entry.
   - fragments: An array of strings, each representing a chunk of the entry (there might be just one).
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
      fragments: An array of strings, each representing a chunk of the entry related to the tag.
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
  // console.log(extractTagRelatedContent(JSON.stringify(tagObjs, null, 2)))

  return [
    // {"role": "system", "content": extractTagRelatedContent(JSON.stringify(tagObjs, null, 2))},
    // { "role": "system", "content": multipleSentences },
    { "role": "system", "content": optionalFragmenting(promptText) },
    { "role": "assistant", "content": assistantPrompt },
    { "role": "user", "content": body }
  ];
}

module.exports = { makeChatInput }