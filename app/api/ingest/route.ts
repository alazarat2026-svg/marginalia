import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractPdfText } from '@/lib/ingestion/extract';
import { chunkPages } from '@/lib/ingestion/chunk';
import { embedChunks } from '@/lib/ingestion/embed';
import {
  uploadPdfToStorage,
  insertChunks,
  updateDocumentStatus,
} from '@/lib/ingestion/store';

export const maxDuration = 60; // Vercel function timeout ceiling

const MAX_PAGES = 50;

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body — expected multipart/form-data' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  const title = formData.get('title') as string | null;
  const author = formData.get('author') as string | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file field' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  // Extract text first (cheap) to check page count
  let pages: Awaited<ReturnType<typeof extractPdfText>>['pages'];
  let totalPages: number;
  try {
    const extracted = await extractPdfText(buffer);
    pages = extracted.pages;
    totalPages = extracted.totalPages;
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to extract PDF text: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  if (totalPages > MAX_PAGES) {
    return NextResponse.json(
      {
        error: `PDF has ${totalPages} pages, exceeds the ${MAX_PAGES}-page limit for v1. Please split the document or upload a smaller file.`,
      },
      { status: 400 }
    );
  }

  // Create the document row
  const documentId = crypto.randomUUID();
  const filePath = `${user.id}/${documentId}.pdf`;

  const { error: insertError } = await supabase.from('documents').insert({
    id: documentId,
    user_id: user.id,
    title: title || file.name.replace(/\.pdf$/i, ''),
    author: author || '',
    page_count: totalPages,
    file_path: filePath,
    status: 'processing',
  });

  if (insertError) {
    return NextResponse.json(
      { error: `Failed to create document record: ${insertError.message}` },
      { status: 500 }
    );
  }

  // From here, any failure should mark the document as failed
  try {
    // Upload PDF to storage
    await uploadPdfToStorage(supabase, user.id, documentId, buffer);

    // Chunk
    const chunks = chunkPages(pages, { maxTokens: 800, overlapTokens: 100 });

    if (chunks.length === 0) {
      throw new Error('No chunks produced from PDF — the document may be empty or image-only');
    }

    // Embed (this is the slow step)
    const embeddedChunks = await embedChunks(chunks, {
      delayMs: 200,
      maxRetries: 3,
    });

    // Insert chunks
    await insertChunks(supabase, documentId, embeddedChunks);

    // Mark ready
    await updateDocumentStatus(supabase, documentId, 'ready');

    return NextResponse.json({
      documentId,
      status: 'ready',
      pageCount: totalPages,
      chunkCount: embeddedChunks.length,
    });
  } catch (err) {
    // Mark failed
    await updateDocumentStatus(supabase, documentId, 'failed');

    const message = err instanceof Error ? err.message : 'Unknown ingestion error';
    console.error(`Ingestion failed for document ${documentId}:`, message);

    return NextResponse.json(
      { error: message, documentId, status: 'failed' },
      { status: 500 }
    );
  }
}
