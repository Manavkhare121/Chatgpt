import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const chatgptIndex = pc.Index("chatgpt");

async function createMemory({ vectors, metadata = {}, messageId }) {
  if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
    return;
  }

  await chatgptIndex.upsert({
    records: [
      {
        id: String(messageId),
        values: Array.from(vectors),
        metadata,
      },
    ],
  });
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!Array.isArray(queryVector) || queryVector.length === 0) {
    return [];
  }

  const data = await chatgptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata?metadata:undefined,
    includeMetadata: true,
  });

  return data.matches;
}


export { createMemory, queryMemory };
