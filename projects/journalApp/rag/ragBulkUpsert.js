const { chunkText } = require("../../../chunkText/chunkText.controller");
const { getEntries, setEntry } = require('../database/entries')
const { getUser } = require('../database/user')
const { embeddings} = require('../../../embeddings/embeddings.controller')
const { vectorUpsert } = require('../../../vectorUpsert/vectorUpsert.controller')
const { vectorNamespaceDelete } = require('../../../vectorDelete/vectorDelete.controller')
const { convertTimeStampToInt } = require('../utils/datetime')

//makes chunks and saves them for multiple entries of a user
const bulkChunk = async (entries, prompts) => {
  for (const entry of entries) {
    const prompt = prompts.find((prompt) => prompt.promptID === entry.promptID)
    const entryChunked = await chunkText(entry, prompt.text? prompt.text : "")
    entry.chunks = entryChunked.chunks
    await setEntry(entry);
  }
}

const bulkEmbed = async (entriesWithChunks) => {
  var upsertData = []
    for (const entryChunked of entriesWithChunks) {
      const dateCreated = convertTimeStampToInt(entryChunked.dateCreated)
      const embeddingsArray = await embeddings(entryChunked.chunks)

      const upsertDataRows = embeddingsArray.map((chunk, i) => {
        return {
          id: `${entryChunked.id}#chunk${i+1}`,
          values: embeddingsArray[i].embedding,
          metadata: {
            userId,
            entryId: entryChunked.id,
            chunkIndex: i,
            dateCreated: dateCreated,
          },
        };
      })
      upsertData.push(...upsertDataRows)
  }
  return upsertData
}

const ragBulkUpsert = async (userId, userEmail)  => {
  const entries = await getEntries(userId);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkChunk(entries, prompts)
  const entriesWithChunks = await getEntries(userId);
  const upsertData = await bulkEmbed(entriesWithChunks)

  await vectorNamespaceDelete("entries", userId)
  await vectorUpsert("entries", userId, upsertData)
}


const testChunk = async () => {
  const entries = (await getEntries(userId)).slice(1, 9);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkChunk(entries, prompts)
  const entriesWithChunks = (await getEntries(userId)).slice(1, 9);
  console.log(entriesWithChunks)
}

// ragBulkUpsert(userId, userEmail)

module.exports = { ragBulkUpsert };