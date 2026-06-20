CREATE FULLTEXT INDEX IF NOT EXISTS idx_knowledge_chunks_fulltext
ON knowledge_chunks (title, content);
