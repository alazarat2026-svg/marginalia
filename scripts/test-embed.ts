import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extractPdfText } from '../lib/ingestion/extract';
import { chunkPages } from '../lib/ingestion/chunk';
import { embedChunks } from '../lib/ingestion/embed';

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx scripts/test-embed.ts <path-to-pdf>');
    process.exit(1);
  }

  const buffer = readFileSync(resolve(pdfPath));
  const { pages } = await extractPdfText(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  );
  const chunks = chunkPages(pages, { maxTokens: 800, overlapTokens: 100 });
  console.log(`Extracted ${chunks.length} chunks from ${pages.length} pages.`);

  console.log('Embedding chunks (this may take a few seconds)...');
  const start = Date.now();
  const embedded = await embedChunks(chunks, {
    delayMs: 200,
    maxRetries: 3,
    onProgress: (done, total) => {
      process.stdout.write(`\r  Embedded ${done}/${total} chunks`);
    },
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nEmbedding complete in ${elapsed}s.`);

  // Verify every chunk has a 768-dim embedding
  const bad = embedded.filter((c) => c.embedding.length !== 768);
  if (bad.length > 0) {
    console.error(`\nERROR: ${bad.length} chunks have wrong embedding dimension`);
    process.exit(1);
  }

  // Show the first 3 floats of each embedding as a sanity check
  embedded.forEach((c, i) => {
    const preview = c.embedding.slice(0, 3).map((v) => v.toFixed(3)).join(', ');
    console.log(`  [${i}] page ${c.pageNumber}: [${preview}, ...]`);
  });

  console.log(`\nAll ${embedded.length} chunks have valid 768-dim embeddings.`);
}

main().catch((err) => {
  console.error('\nTest failed:', err);
  process.exit(1);
});
