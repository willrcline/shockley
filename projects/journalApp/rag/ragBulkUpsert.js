const { fragmentText } = require("../../../fragmentText/fragmentText.controller");
const { getEntries, setEntry } = require('../database/entries')
const { getUser } = require('../database/user')
const { embeddings} = require('../../../embeddings/embeddings.controller')
const { vectorUpsert } = require('../../../vectorUpsert/vectorUpsert.controller')

//makes fragments and saves them for multiple entries of a user
const bulkFragment = async (entries, prompts) => {
  for (const entry of entries) {
    const prompt = prompts.find((prompt) => prompt.promptID === entry.promptID)
    const entryFragmented = await fragmentText(entry, prompt.text)
    entry.fragments = entryFragmented.fragments
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

const ragBulkUpsert = async (userId, userEmail)  => {
  const entries = await getEntries(userId);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkFragment(entries, prompts)
  const entriesWithFragments = await getEntries(userId);
  const upsertData = await bulkEmbed(entriesWithFragments)

  await vectorUpsert("entries", userId, upsertData)
}
const userId = 'f5bb39e3-fd12-4aee-9788-882a9e587ee9'
const userEmail = 'willrcline.atx@gmail.com'

const run = async () => {
  const entries = (await getEntries(userId)).slice(1, 6);
  const user = await getUser(userEmail)
  const prompts = user.prompts
  await bulkFragment(entries, prompts)
  const entriesWithFragments = (await getEntries(userId)).slice(1, 6);
  console.log(entriesWithFragments)
}

run()

// ragBulkUpsert(userId, userEmail)

module.exports = { ragBulkUpsert };