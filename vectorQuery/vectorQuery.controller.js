const { Pinecone } = require('@pinecone-database/pinecone')

const vectorQuery = async (indexName, namespace, vector, topK = 3, filter = null) => {
  const pc = new Pinecone({
    apiKey: '8575d620-1a8a-4048-87e6-2fcf40578569'
  });
  const index = pc.index(indexName)

  const queryOptions = {
    topK: topK,
    vector: vector,
    includeValues: true,
    includeMetadata: true,
  };

  if (filter !== null) {
    queryOptions.filter = filter;
  }

  const result = await index.namespace(namespace).query(queryOptions);

  const matches = result.matches;

  return matches;
}

module.exports = { vectorQuery };