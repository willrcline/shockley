require('dotenv').config()
const { embeddings } = require("../../../../embeddings/embeddings.controller");
const { vectorQuery } = require("../../../../vectorQuery/vectorQuery.controller");

const query = 'Doing chores'

async function run() {
  const arrayToEmbed = [query]
  const embeddingsArray = await embeddings(arrayToEmbed)

  const queryResult = await vectorQuery("entries", 'userId1', embeddingsArray[0].embedding)
  console.log(queryResult)  

}

run()