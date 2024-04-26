const { makeChatInput } = require('./makeChatInput')
require('dotenv').config()
const { chatCompletion } = require('../chatCompletion/chatCompletion.controller')
const util = require('util');

async function chunkText(entry, promptText) {
    const messages = makeChatInput(entry.body, entry.id, promptText)
    const completion = await chatCompletion({messages: messages, json_object: true})
    const completionJson = JSON.parse(completion);
    const entryChunked = 
      {
        entryId: entry.id,
        chunks: [...completionJson.chunks]
      }
  // console.log(util.inspect(completionJson, { depth: null }));
  // console.log("chunkText.completionJson___", completionJson)
  return entryChunked
}

module.exports = { chunkText }