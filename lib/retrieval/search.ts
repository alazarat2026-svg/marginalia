import type { SupabaseClient } from '@supabase/supabase-js';

export interface RetrievedChunk {
  chunkId: string;
  content: string;
  pageNumber: number;
  chunkIndex: number;
  similarity: number;
}

/**
 * Retrieve top-K chunks for a document using match_chunks.
 *
 * Why the string format for query_embedding: pgvector expects vectors in
 * '[1,2,3,...]' format. The Supabase JS client may serialize arrays
 * automatically, but the explicit string is guaranteed.
 *
 * RLS is enforced by match_chunks (SECURITY INVOKER) — the function runs
 * as the calling user, so only the user's own chunks are returned.
 */
export async function searchChunks(
  supabase: SupabaseClient,
  documentId: string,
  queryEmbedding: number[],
  matchCount: number = 5
): Promise<RetrievedChunk[]> {
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_document_id: documentId,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`Vector search failed: ${error.message}`);
  }

  if (!data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    chunkId: row.chunk_id as string,
    content: row.content as string,
    pageNumber: row.page_number as number,
    chunkIndex: row.chunk_index as number,
    similarity: row.similarity as number,
  }));
}
