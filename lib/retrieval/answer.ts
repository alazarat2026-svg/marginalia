import type { SupabaseClient } from '@supabase/supabase-js';
import { embedQuery } from './embed-query';
import { searchChunks } from './search';
import { generateAnswer } from './generate';

export interface AnswerResult {
  answer: string;
  citations: Array<{ pageNumber: number; chunkId: string }>;
  insufficientContext: boolean;
  retrievedChunks: number;
}

/**
 * Full retrieval + generation pipeline for one question.
 *
 * Flow: embed query → search chunks → generate answer → parse citations.
 * If no chunks are retrieved, return insufficientContext=true without
 * calling the model (saves an API call).
 */
export async function answerQuestion(
  supabase: SupabaseClient,
  documentId: string,
  question: string,
  matchCount: number = 5
): Promise<AnswerResult> {
  // 1. Embed the query
  const queryEmbedding = await embedQuery(question);

  // 2. Search for relevant chunks
  const chunks = await searchChunks(supabase, documentId, queryEmbedding, matchCount);

  // 3. If no chunks retrieved, short-circuit
  if (chunks.length === 0) {
    return {
      answer: '',
      citations: [],
      insufficientContext: true,
      retrievedChunks: 0,
    };
  }

  // 4. Generate the answer
  const { answer, insufficientContext } = await generateAnswer(
    question,
    chunks.map((c) => ({ content: c.content, pageNumber: c.pageNumber }))
  );

  // 5. Parse citations from the answer (extract [p. N] patterns)
  const citationPattern = /\[p\. (\d+)\]/g;
  const citationPages = new Set<number>();
  let match;
  while ((match = citationPattern.exec(answer)) !== null) {
    citationPages.add(parseInt(match[1], 10));
  }

  // Map cited pages back to chunk IDs
  const citations = Array.from(citationPages)
    .map((pageNumber) => {
      const chunk = chunks.find((c) => c.pageNumber === pageNumber);
      return chunk ? { pageNumber, chunkId: chunk.chunkId } : null;
    })
    .filter((c): c is { pageNumber: number; chunkId: string } => c !== null);

  return {
    answer,
    citations,
    insufficientContext,
    retrievedChunks: chunks.length,
  };
}
