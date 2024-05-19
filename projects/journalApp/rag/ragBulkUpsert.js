const { chunkText } = require("../../../chunkText/chunkText.controller");
const { getEntries, setEntry } = require('../database/entries')
const { getUser } = require('../database/user')
const { embedding} = require('../../../embedding/embedding.controller')
const { vectorUpsert } = require('../../../vectorUpsert/vectorUpsert.controller')
const { vectorNamespaceDelete } = require('../../../vectorDelete/vectorDelete.controller')
const { convertTimestampToInt } = require('../utils/datetime')

//makes chunks and saves them for multiple entries of a user
const bulkChunk = async (entries, prompts) => {
  console.log('bulkChunk___', entries.length, prompts.length)
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
      const dateCreated = convertTimestampToInt(entryChunked.dateCreated)
      console.log('entryChunked chunks ammount___', entryChunked.chunks.length)

      for (const chunk of entryChunked.chunks) {
        const embeddingObj = await embedding(chunk)
        console.log("embeddingObj___", embeddingObj)

        const upsertDataRow = embeddingObj.map((item, i) => {
          return {
            id: `${entryChunked.id}#chunk${i+1}`,
            values: embeddingObj[i].embedding,
            metadata: {
              userId: entryChunked.accountID,
              entryId: entryChunked.id,
              chunkIndex: i,
              dateCreated: dateCreated,
            },
          };
        })
        upsertData.push(...upsertDataRow)
      }

  }
  return upsertData
}

const ragBulkUpsert = async (userId, userEmail)  => {
  const entries = (await getEntries(userId)).slice(1, 20);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkChunk(entries, prompts)
  const entriesWithChunks = (await getEntries(userId)).slice(1, 20);
  const upsertData = await bulkEmbed(entriesWithChunks, userId)

  await vectorNamespaceDelete("entries", userId)
  await vectorUpsert("entries", userId, upsertData)
}

const test = async (userId) => {
  const entriesWithChunks = (await getEntries(userId)).slice(1, 20);
  console.log("entriesWithChunks.length___", entriesWithChunks.length)
  const upsertData = await bulkEmbed(entriesWithChunks, userId)
  console.log("upsertData.length___", upsertData.length)
  await vectorNamespaceDelete("entries", userId)
  await vectorUpsert("entries", userId, upsertData)
}

// test('f5bb39e3-fd12-4aee-9788-882a9e587ee9')

// ragBulkUpsert('f5bb39e3-fd12-4aee-9788-882a9e587ee9', 'willrcline.atx@gmail.com')



module.exports = { ragBulkUpsert };