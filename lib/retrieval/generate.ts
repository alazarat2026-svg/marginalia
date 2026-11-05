export interface GeneratedAnswer {
  answer: string;
  insufficientContext: boolean;
}

const SYSTEM_INSTRUCTION = `You are a document Q&A assistant. Answer ONLY from the provided context.
Every factual claim must be followed by a page citation in the format [p. N].
If the context does not contain enough information to answer, respond with exactly: INSUFFICIENT_CONTEXT
Do not make up information. Do not answer from general knowledge.`;

/**
 * Generate an answer from retrieved chunks using Gemini chat.
 *
 * Why system instruction: it sets the rules for the model before the user
 * prompt, which is more reliable than embedding the rules in the prompt itself.
 *
 * Why INSUFFICIENT_CONTEXT marker: it's a deterministic string the model
 * returns when it can't answer. More reliable than checking similarity
 * thresholds, which are noisy.
 */
export async function generateAnswer(
  question: string,
  chunks: Array<{ content: string; pageNumber: number }>
): Promise<GeneratedAnswer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const model = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash-lite';

  // Build context with numbered chunks and page numbers
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1} | Page ${c.pageNumber}]\n${c.content}`)
    .join('\n\n');

  const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    // If 429 with limit 0, the model has no free-tier quota
    if (response.status === 429) {
      throw new Error(
        `Chat model '${model}' hit a rate limit or has no free-tier quota. ` +
        `Set GEMINI_CHAT_MODEL in .env.local to a model with quota. Error: ${errorText}`
      );
    }
    throw new Error(`Generation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!answer) {
    throw new Error('Model returned empty response');
  }

  return {
    answer: answer.trim(),
    insufficientContext: answer.trim() === 'INSUFFICIENT_CONTEXT',
  };
}
