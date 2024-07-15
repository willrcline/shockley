require('dotenv').config()
const { embedding } = require("../../../../embedding/embedding.controller");
const { vectorDocDelete } = require('../../../../vectorDelete/vectorDelete.controller');
const { vectorUpsert } = require("../../../../vectorUpsert/vectorUpsert.controller")
const { getEntry, setEntry } = require('../../database/entries')
const { getUserById } = require('../../database/user')
const { chunkText } = require('../../../../chunkText/chunkText.controller')
const { convertTimestampToInt } = require('../../utils/datetime')

async function ragChunk (entry, prompt) {
  const entryChunked = await chunkText(entry, prompt.text? prompt.text : "")
  entry.chunks = entryChunked.chunks
  await setEntry(entry);
}

const ragEmbed = async (entryChunked) => {
  const dateCreatedInt = convertTimestampToInt(entryChunked.dateCreated)
  const embeddingArray = await embedding(entryChunked.chunks)

  const upsertDataRows = embeddingArray.map((chunk, i) => {
    return {
      id: `${entryChunked.id}#chunk${i+1}`,
      values: embeddingArray[i].embedding,
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

async function ragUpsert(userId, entryId) {
  const entry = await getEntry(entryId);
  const user = await getUserById(userId)
  const prompts = user.prompts
  console.log("ragUpsert.controller prompts___", prompts)
  console.log("ragUpsert.controller entry___", entry)
  console.log("ragUpsert.controller entry.promptID___", entry.promptID)
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