import type { Chunk } from './chunk';

export interface EmbeddedChunk extends Chunk {
  embedding: number[];  // 768 floats from gemini-embedding-001
}

export interface EmbedOptions {
  delayMs?: number;       // default 200 — pause between requests to respect free tier RPM
  maxRetries?: number;    // default 3
  onProgress?: (done: number, total: number) => void;
}

/**
 * Embed chunks using Gemini gemini-embedding-001 via direct REST API.
 *
 * Why direct REST, not the SDK: the @google/generative-ai SDK silently
 * strips the outputDimensionality field from the request body, so the
 * model always returns its default 3072 dimensions. Our schema uses
 * vector(768) and the ivfflat index requires ≤2000 dimensions, so we
 * must actually get 768 back. The REST API honors outputDimensionality
 * in the request body; the SDK does not.
 *
 * Why sequential, not parallel: the free tier is ~5-10 RPM for embeddings.
 * Firing all requests in parallel hits 429 immediately. Sequential with a
 * small delay keeps us under the limit while still completing quickly for
 * small documents (13 chunks ≈ 2.6s).
 *
 * Why single calls, not batchEmbedContents: free-tier batch embedding is
 * unreliable. Reports confirm RPM counts per text, not per HTTP call, so
 * batching gives zero throughput benefit while adding 429 risk.
 *
 * Why RETRIEVAL_DOCUMENT: this is the task type for chunks that will be
 * retrieved later. The query (in D4) will use RETRIEVAL_QUERY. Matching
 * task types improves retrieval quality.
 *
 * Why L2 normalization: gemini-embedding-001 auto-normalizes only its
 * default 3072-dim output. For 768-dim output, vectors are unnormalized;
 * we normalize them so cosine similarity (via the <=> operator in the
 * match_chunks function) works correctly.
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

  const results: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'models/gemini-embedding-001',
              content: { parts: [{ text: chunk.content }] },
              taskType: 'RETRIEVAL_DOCUMENT',
              outputDimensionality: 768,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gemini API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const values: number[] | undefined = data.embedding?.values;

        if (!values || values.length !== 768) {
          throw new Error(
            `Expected 768-dim embedding, got ${values?.length ?? 0}`
          );
        }

        // L2 normalize (required for non-default dimensions from gemini-embedding-001)
        const norm = Math.sqrt(
          values.reduce((sum, v) => sum + v * v, 0)
        );
        const normalized = values.map((v) => v / norm);

        results.push({ ...chunk, embedding: normalized });
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