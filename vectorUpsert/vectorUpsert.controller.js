const { Pinecone } = require('@pinecone-database/pinecone')

const vectorUpsert = async (indexName, namespace, data) => {
  const pc = new Pinecone({
    apiKey: '8575d620-1a8a-4048-87e6-2fcf40578569'
  });
  const index = pc.index(indexName)

  await index.namespace(namespace).upsert(data);
}

module.exports = { vectorUpsert };