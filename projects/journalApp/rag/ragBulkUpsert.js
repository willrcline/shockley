const { fragmentText } = require("../../../fragmentText/fragmentText.controller");
const { getEntries, setEntry } = require('../database/entries')
const { embeddings} = require('../../../embeddings/embeddings.controller')
const { vectorUpsert } = require('../../../vectorUpsert/vectorUpsert.controller')

//makes fragments and saves them for multiple entries of a user
const bulkFragment = async (entries) => {
  for (const entry of entries) {
    const entriesFragmented = await fragmentText([entry])
    entry.fragments = entriesFragmented[0].fragments
    await setEntry(entry);
  }
}

const bulkEmbed = async (entriesWithFragments) => {
  var upsertData = []
    for (const entryFragmented of entriesWithFragments) {
      // console.log(entryFragmented.fragments)
      const embeddingsArray = await embeddings(entryFragmented.fragments)

      const upsertDataRows = embeddingsArray.map((fragment, i) => {
        return {
          id: `${entryFragmented.id}-[${i}]`,
          values: embeddingsArray[i].embedding,
          metadata: {
            userId,
            entryId: entryFragmented.id,
            fragmentIndex: i
          },
        };
      })
      upsertData.push(...upsertDataRows)
  }
  return upsertData
}

const ragBulkUpsert = async (userId)  => {
  const entries = await getEntries(userId);
  await bulkFragment(entries)
  const entriesWithFragments = await getEntries(userId);
  const upsertData = await bulkEmbed(entriesWithFragments)

  await vectorUpsert("entries", userId, upsertData)
}

const userId = 'f5bb39e3-fd12-4aee-9788-882a9e587ee9'

ragBulkUpsert(userId)

module.exports = { ragBulkUpsert };