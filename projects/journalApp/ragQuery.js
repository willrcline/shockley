require('dotenv').config()
const { embeddings } = require("../../embeddings/embeddings.controller");
const { vectorQuery } = require("../../vectorQuery/vectorQuery.controller");

const query = 'Impressive achievements'

async function run() {
  const arrayToEmbed = [query]
  const embeddingsArray = await embeddings(arrayToEmbed)

  await vectorQuery("entries", 'userId1', embeddingsArray[0].embedding)
}

run()