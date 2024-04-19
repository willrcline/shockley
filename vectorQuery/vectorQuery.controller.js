const { Pinecone } = require('@pinecone-database/pinecone')

const vectorQuery = async (indexName, namespace, vector) => {
  const pc = new Pinecone({
    apiKey: '8575d620-1a8a-4048-87e6-2fcf40578569'
  });
  const index = pc.index(indexName)

  const result = await index.namespace(namespace).query({
    topK: 3,
    vector: vector,
    includeValues: true,
    includeMetadata: true,
  });

  const matches = result.matches;
  // console.log(matches);
  console.log(matches[0].metadata)

  return matches;

}

module.exports = { vectorQuery };