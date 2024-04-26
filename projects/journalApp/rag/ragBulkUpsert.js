const { chunkText } = require("../../../chunkText/chunkText.controller");
const { getEntries, setEntry } = require('../database/entries')
const { getUser } = require('../database/user')
const { embeddings} = require('../../../embeddings/embeddings.controller')
const { vectorUpsert } = require('../../../vectorUpsert/vectorUpsert.controller')
const { vectorNamespaceDelete } = require('../../../vectorDelete/vectorDelete.controller')

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
      const embeddingsArray = await embeddings(entryChunked.chunks)

      const upsertDataRows = embeddingsArray.map((chunk, i) => {
        return {
          id: `${entryChunked.id}#chunk${i+1}`,
          values: embeddingsArray[i].embedding,
          metadata: {
            userId,
            entryId: entryChunked.id,
            chunkIndex: i
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
const userId = 'f5bb39e3-fd12-4aee-9788-882a9e587ee9'
const userEmail = 'willrcline.atx@gmail.com'

const run = async () => {
  const entries = (await getEntries(userId)).slice(1, 9);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkChunk(entries, prompts)
  const entriesWithChunks = (await getEntries(userId)).slice(1, 9);
  console.log(entriesWithChunks)
}

run()

// ragBulkUpsert(userId, userEmail)

module.exports = { ragBulkUpsert };