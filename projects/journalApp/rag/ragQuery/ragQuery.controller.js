require('dotenv').config({path: '../../../../.env'})
const { embeddings } = require("../../../../embeddings/embeddings.controller");
const { vectorQuery } = require("../../../../vectorQuery/vectorQuery.controller");
const { getEntry, setEntry } = require('../../database/entries')

const userId = 'f5bb39e3-fd12-4aee-9788-882a9e587ee9'
const query = "Dream: grow Journal365 to 3,000 users, secure an apartment in Austin, practice Jiu-Jitsu, live the digital nomad dream for a bit, achieve financial independence"

async function ragQuery(userId, query, topK = 3) {
  
  const arrayToEmbed = [query]
  const embeddingsArray = await embeddings(arrayToEmbed)

  const matchingVectors = await vectorQuery("entries", userId, embeddingsArray[0].embedding, topK)
  
  var matchArray = []
  for (const vector of matchingVectors) {
    const entryId = vector.metadata.entryId
    const chunkIndex = vector.metadata.chunkIndex
    const entry = await getEntry(entryId)
    const matchingChunk = entry.chunks[chunkIndex]
    const matchObj = {
      score: vector.score,
      chunk: matchingChunk
    }
    matchArray.push(matchObj)
  }
  console.log(matchArray)
  return matchArray
}

module.exports = { ragQuery }



// ragQuery(userId, query, 7)