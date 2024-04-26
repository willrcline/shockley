require('dotenv').config()
const { embeddings } = require("../../../../embeddings/embeddings.controller");
const { vectorDocDelete } = require('../../../../vectorDelete/vectorDelete.controller');
const { vectorUpsert } = require("../../../../vectorUpsert/vectorUpsert.controller")

const userId = 'f5bb39e3-fd12-4aee-9788-882a9e587ee9'
const entryId = '36fea420-8f66-481e-8a27-b5ac5bc13110'

async function ragChunk (entry, prompt) {
  const entryChunked = await chunkText(entry, prompt.text? prompt.text : "")
  entry.chunks = entryChunked.chunks
  await setEntry(entry);
}

const ragEmbed = async (entryChunked) => {
  const embeddingsArray = await embeddings(entryChunked.chunks)

  const upsertDataRows = embeddingsArray.map((chunk, i) => {
    return {
      id: `${entryChunked.id}#chunk${i}`,
      values: embeddingsArray[i].embedding,
      metadata: {
        userId,
        entryId: entryChunked.id,
        chunkIndex: i
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

  await vectorDocDelete('entries', userId, entryId)
  await vectorUpsert('entries', userId, upsertData)
}

module.exports = { ragUpsert }