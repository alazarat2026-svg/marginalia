-- match_chunks: retrieve top-K chunks by cosine similarity for a given document
-- Enforces RLS via SECURITY INVOKER — the function runs as the calling user,
-- so the RLS policies on `chunks` automatically restrict results to documents
-- the user owns.

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(768),
  match_document_id uuid,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  chunk_id uuid,
  content text,
  page_number int,
  chunk_index int,
  similarity float
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
  SELECT
    chunks.id AS chunk_id,
    chunks.content,
    chunks.page_number,
    chunks.chunk_index,
    1 - (chunks.embedding <=> query_embedding) AS similarity
  FROM chunks
  WHERE chunks.document_id = match_document_id
  ORDER BY chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION match_chunks(vector, uuid, int) TO authenticated;
