import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import type { Chunk } from './chunk';

export interface EmbeddedChunk extends Chunk {
  embedding: number[];  // 768 floats from text-embedding-004
}

export interface EmbedOptions {
  delayMs?: number;       // default 200 — pause between requests to respect free tier RPM
  maxRetries?: number;    // default 3
  onProgress?: (done: number, total: number) => void;
}

/**
 * Embed chunks using Gemini text-embedding-004.
 *
 * Why sequential, not parallel: the free tier is ~5-10 RPM for embeddings.
 * Firing all requests in parallel hits 429 immediately. Sequential with a
 * small delay keeps us under the limit while still completing quickly for
 * small documents (13 chunks ≈ 2.6s).
 *
 * Why single calls, not batchEmbedContents: free-tier batch embedding is
 * unreliable. Reports confirm RPM counts per text, not per HTTP call, so
 * batching gives zero throughput benefit while adding 429 risk. Single
 * calls are predictable.
 *
 * Why RETRIEVAL_DOCUMENT: this is the task type for chunks that will be
 * retrieved later. The query (in D4) will use RETRIEVAL_QUERY. Matching
 * task types improves retrieval quality.
 *
 * Retry strategy: on 429, exponential backoff (2s, 4s, 8s), max 3 retries.
 * After max retries, throw with the chunk index so the caller can report
 * which chunk failed and where.
 */
export async function embedChunks(
  chunks: Chunk[],
  options: EmbedOptions = {}
): Promise<EmbeddedChunk[]> {
  const delayMs = options.delayMs ?? 200;
  const maxRetries = options.maxRetries ?? 3;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server.'
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  const results: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await model.embedContent({
          content: { role: 'user', parts: [{ text: chunk.content }] },
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          outputDimensionality: 768,
        });

        const values = response.embedding.values;
        if (!values || values.length !== 768) {
          throw new Error(
            `Expected 768-dim embedding, got ${values?.length ?? 0}`
          );
        }

        results.push({ ...chunk, embedding: values });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        const isRateLimit =
          err instanceof Error &&
          (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));

        if (isRateLimit && attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
          await sleep(backoffMs);
          continue;
        }

        if (!isRateLimit) {
          // Non-rate-limit errors are not retryable
          break;
        }
      }
    }

    if (lastError) {
      throw new Error(
        `Failed to embed chunk ${i} (page ${chunk.pageNumber}): ${
          lastError instanceof Error ? lastError.message : String(lastError)
        }`
      );
    }

    options.onProgress?.(i + 1, chunks.length);

    // Delay between chunks (skip after the last one)
    if (i < chunks.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  return results;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
