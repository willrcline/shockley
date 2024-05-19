require('dotenv').config()
const OpenAI = require("openai");

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const embedding = async (input) => {

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
    encoding_format: "float",
  });

  // console.log(embedding);
  return embedding.data
}

module.exports = { embedding };
