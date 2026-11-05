/**
 * Embed a user query using Gemini REST API with RETRIEVAL_QUERY task type.
 *
 * Why RETRIEVAL_QUERY: the chunks were embedded with RETRIEVAL_DOCUMENT.
 * Matching task types improves retrieval quality (Google's docs on
 * EmbeddingTaskType). The REST API is used directly (not the SDK) for the
 * same reason as embed.ts — the SDK silently drops outputDimensionality.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text: query }] },
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: 768,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Query embedding failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const values: number[] | undefined = data.embedding?.values;

  if (!values || values.length !== 768) {
    throw new Error(`Expected 768-dim query embedding, got ${values?.length ?? 0}`);
  }

  // L2 normalize (required for 768-dim output from gemini-embedding-001)
  const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  return values.map((v) => v / norm);
}
