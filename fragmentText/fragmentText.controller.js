const { makeChatInput } = require('./makeChatInput')
require('dotenv').config()
const { chatCompletion } = require('../chatCompletion/chatCompletion.controller')
const util = require('util');

async function fragmentText(entry, promptText) {
    const messages = makeChatInput(entry.body, entry.id, promptText)
    const completion = await chatCompletion({messages: messages, json_object: true})
    const completionJson = JSON.parse(completion);
    const entryFragmented = 
      {
        entryId: entry.id,
        fragments: [...completionJson.fragments]
      }
  // console.log(util.inspect(completionJson, { depth: null }));
  // console.log("fragmentText.completionJson___", completionJson)
  // console.log("fragmentText.entriesFragmented___", entriesFragmented)
  return entryFragmented
}

module.exports = { fragmentText }