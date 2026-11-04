export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface Chunk {
  pageNumber: number;   // page where this chunk begins (1-based)
  chunkIndex: number;   // 0-based, sequential within the document
  content: string;
}

export interface ChunkOptions {
  maxTokens?: number;      // default 800
  overlapTokens?: number;  // default 100
}

/**
 * Chunk pages into sentence-aware, overlapping chunks.
 *
 * Why hand-rolled: we want to understand the mechanics, not delegate to a
 * library. Why sentence-aware: character-based splitting breaks mid-sentence
 * and produces chunks that read badly and retrieve worse. Why overlap:
 * ~100 token overlap between consecutive chunks ensures that context which
 * straddles the boundary is preserved in at least one chunk — this improves
 * retrieval recall for questions that span sections.
 *
 * Token estimation: we do NOT install a real tokenizer. We approximate
 * tokens as ceil(words * 1.3), which is accurate to ~15% for English prose
 * with SentencePiece-style tokenizers (Gemini, GPT). This is a documented
 * approximation — a future version could use a real tokenizer for exact
 * chunk sizes.
 *
 * Sentence splitting: regex-based, splitting on . ! ? followed by whitespace,
 * keeping the punctuation with the sentence. Also splits on paragraph breaks
 * (double newlines). Does NOT handle abbreviations like "e.g.", "Mr." — this
 * causes occasional over-splitting, which is acceptable for v1.
 *
 * Page tracking: a chunk that spans a page boundary records the page of its
 * FIRST sentence as pageNumber. This is the citation page for that chunk.
 */
export function chunkPages(
  pages: ExtractedPage[],
  options: ChunkOptions = {}
): Chunk[] {
  const maxTokens = options.maxTokens ?? 800;
  const overlapTokens = options.overlapTokens ?? 100;

  // Flatten pages into a single sequence of { text: sentence, pageNumber }
  const sentences: Array<{ text: string; pageNumber: number }> = [];
  for (const page of pages) {
    const pageSentences = splitIntoSentences(page.text);
    for (const s of pageSentences) {
      sentences.push({ text: s, pageNumber: page.pageNumber });
    }
  }

  if (sentences.length === 0) return [];

  const chunks: Chunk[] = [];
  let i = 0;
  let chunkIndex = 0;

  while (i < sentences.length) {
    let chunkTokens = 0;
    let end = i;
    let pageNumber = sentences[i].pageNumber;

    // Extend the chunk until we hit maxTokens
    while (end < sentences.length) {
      const sentenceTokens = estimateTokens(sentences[end].text);
      if (chunkTokens + sentenceTokens > maxTokens && end > i) break;
      chunkTokens += sentenceTokens;
      end++;
    }

    const content = sentences
      .slice(i, end)
      .map((s) => s.text)
      .join(' ')
      .trim();

    if (content.length > 0) {
      chunks.push({ pageNumber, chunkIndex, content });
      chunkIndex++;
    }

    if (end >= sentences.length) break;

    // Walk backwards from `end` to find overlap start
    let overlapEnd = end;
    let overlapCount = 0;
    while (overlapEnd > i && overlapCount < overlapTokens) {
      overlapEnd--;
      overlapCount += estimateTokens(sentences[overlapEnd].text);
    }

    // Next chunk starts at overlapEnd (must advance at least by 1)
    i = Math.max(overlapEnd, i + 1);
  }

  return chunks;
}

function estimateTokens(text: string): number {
  // ~1.3 tokens per word for English prose (SentencePiece-style tokenizers).
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words * 1.3);
}

function splitIntoSentences(text: string): string[] {
  // Split on . ! ? followed by whitespace; also split on paragraph breaks.
  // Keep the punctuation with the sentence.
  const paragraphs = text.split(/\n{2,}/);
  const sentences: string[] = [];
  for (const para of paragraphs) {
    const parts = para.split(/(?<=[.!?])\s+/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.length > 0) sentences.push(trimmed);
    }
  }
  return sentences;
}
