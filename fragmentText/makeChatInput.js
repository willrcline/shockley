const systemPrompt = `
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

const makeChatInput = (body, entryId) => {
  const assistantPrompt = `entryId: ${entryId}`
  
  return [
    {"role": "system", "content": systemPrompt},
    { "role": "assistant", "content": assistantPrompt },
    { "role": "user", "content": body }
  ];
}

module.exports = { makeChatInput }