const { Pinecone } = require('@pinecone-database/pinecone')

const vectorDocDelete = async (indexName, namespace, entryId) => {
  const pc = new Pinecone({
    apiKey: '8575d620-1a8a-4048-87e6-2fcf40578569'
  });
  const index = pc.index(indexName).namespace(namespace);

  const pageOneList = await index.listPaginated({ prefix: `${entryId}#` });
  const pageOneVectorIds = pageOneList.vectors.map((vector) => vector.id);
  await index.deleteMany(pageOneVectorIds);
}

const vectorNamespaceDelete = async (indexName, namespace) => {
  const pc = new Pinecone({
    apiKey: '8575d620-1a8a-4048-87e6-2fcf40578569'
  });
  const index = pc.index(indexName)
  await index.namespace(namespace).deleteAll();
}
module.exports = { vectorDocDelete, vectorNamespaceDelete };