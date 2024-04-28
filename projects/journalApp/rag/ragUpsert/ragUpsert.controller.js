require('dotenv').config()
const { embeddings } = require("../../../../embeddings/embeddings.controller");
const { vectorDocDelete } = require('../../../../vectorDelete/vectorDelete.controller');
const { vectorUpsert } = require("../../../../vectorUpsert/vectorUpsert.controller")
const { getEntry, setEntry } = require('../../database/entries')
const { getUser } = require('../../database/user')
const { chunkText } = require('../../../../chunkText/chunkText.controller')
const { convertTimestampToInt } = require('../../utils/datetime')

async function ragChunk (entry, prompt) {
  const entryChunked = await chunkText(entry, prompt.text? prompt.text : "")
  entry.chunks = entryChunked.chunks
  await setEntry(entry);
}

const ragEmbed = async (entryChunked) => {
  const dateCreatedInt = convertTimestampToInt(entryChunked.dateCreated)
  const embeddingsArray = await embeddings(entryChunked.chunks)

  const upsertDataRows = embeddingsArray.map((chunk, i) => {
    return {
      id: `${entryChunked.id}#chunk${i+1}`,
      values: embeddingsArray[i].embedding,
      metadata: {
        userId,
        entryId: entryChunked.id,
        chunkIndex: i,
        dateCreated: dateCreatedInt,
      },
    };
  })
  return upsertDataRows
}

async function ragUpsert(userId, userEmail, entryId) {
  const entry = await getEntry(entryId);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  const prompt = prompts.find((prompt) => prompt.promptID === entry.promptID)
  await ragChunk (entry, prompt)
  const entryChunked = await getEntry(entryId);
  const upsertData = await ragEmbed(entryChunked)
  try {
    await vectorDocDelete('entries', userId, entryId)
  } catch (error) {}
  await vectorUpsert('entries', userId, upsertData)
}

module.exports = { ragUpsert }