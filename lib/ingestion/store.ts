import type { SupabaseClient } from '@supabase/supabase-js';
import type { EmbeddedChunk } from './embed';

/**
 * Upload a PDF to Supabase Storage under the user's folder.
 *
 * Path format: {userId}/{documentId}.pdf
 * The storage RLS policies from D1 require the first folder segment
 * to equal auth.uid() — if this path doesn't match, the upload fails.
 */
export async function uploadPdfToStorage(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  buffer: ArrayBuffer
): Promise<string> {
  const filePath = `${userId}/${documentId}.pdf`;

  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return filePath;
}

/**
 * Insert embedded chunks into the chunks table.
 *
 * RLS on the chunks table requires the parent document to belong
 * to the calling user. The user-scoped client enforces this.
 *
 * Bulk insert: one query, all chunks. For a 50-page PDF this is
 * ~60 rows — well within Supabase's batch insert limits.
 */
export async function insertChunks(
  supabase: SupabaseClient,
  documentId: string,
  chunks: EmbeddedChunk[]
): Promise<void> {
  const rows = chunks.map((c) => ({
    document_id: documentId,
    page_number: c.pageNumber,
    chunk_index: c.chunkIndex,
    content: c.content,
    embedding: c.embedding,
  }));

  const { error } = await supabase.from('chunks').insert(rows);

  if (error) {
    throw new Error(`Chunk insert failed: ${error.message}`);
  }
}

/**
 * Update the document status (processing / ready / failed).
 * Used after ingestion succeeds or fails.
 */
export async function updateDocumentStatus(
  supabase: SupabaseClient,
  documentId: string,
  status: 'processing' | 'ready' | 'failed'
): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .update({ status })
    .eq('id', documentId);

  if (error) {
    console.error(`Failed to update document status to ${status}:`, error.message);
    // Do not throw — the pipeline result is more important than the status update
  }
}
