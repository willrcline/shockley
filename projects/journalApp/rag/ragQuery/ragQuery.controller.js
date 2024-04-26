require('dotenv').config({path: '../../../../.env'})
const { embeddings } = require("../../../../embeddings/embeddings.controller");
const { vectorQuery } = require("../../../../vectorQuery/vectorQuery.controller");
const { getEntry, setEntry } = require('../../database/entries')

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
  return matchArray
}

module.exports = { ragQuery }