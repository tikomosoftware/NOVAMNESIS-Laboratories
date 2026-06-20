CREATE VECTOR INDEX idx_knowledge_chunks_embedding
ON knowledge_chunks ((VEC_COSINE_DISTANCE(embedding)))
USING HNSW;
