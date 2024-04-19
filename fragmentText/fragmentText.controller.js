const { makeChatInput } = require('./makeChatInput')
require('dotenv').config()
const { chatCompletion } = require('../chatCompletion/chatCompletion.controller')


async function fragmentText(entries) {
  let entriesFragmented = []
  for (const entry of entries) {
    const messages = makeChatInput(entry.body, entry.id)
    const completion = await chatCompletion({messages: messages, json_object: true})
    const completionJson = JSON.parse(completion);
    // console.log(completionJson)
    entriesFragmented.push(
      {
        entryId: entry.id,
        fragments: [...completionJson.fragments]
      }
    )
  }
  console.log(entriesFragmented)
  return entriesFragmented
}

module.exports = { fragmentText }