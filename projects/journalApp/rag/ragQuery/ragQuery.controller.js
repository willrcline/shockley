require('dotenv').config({path: '../../../../.env'})
const { embedding } = require("../../../../embedding/embedding.controller");
const { vectorQuery } = require("../../../../vectorQuery/vectorQuery.controller");
const { getEntry, setEntry } = require('../../database/entries')

async function ragQuery(userId, query, topK = 3, filter=null) {
  
  const arrayToEmbed = [query]
  const embeddingArray = await embedding(arrayToEmbed)

  const matchingVectors = await vectorQuery("entries", userId, embeddingArray[0].embedding, topK, filter)
  
  var matchArray = []
  for (const vector of matchingVectors) {
    const entryId = vector.metadata.entryId
    const chunkIndex = vector.metadata.chunkIndex
    const entry = await getEntry(entryId)
    const matchingChunk = entry.chunks[chunkIndex]
    const matchObj = {
      score: vector.score,
      chunk: matchingChunk,
      dateCreated: entry.dateCreated
    }
    matchArray.push(matchObj)
  }
  return matchArray
}

module.exports = { ragQuery }