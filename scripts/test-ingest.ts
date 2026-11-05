import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extractPdfText } from '../lib/ingestion/extract';
import { chunkPages } from '../lib/ingestion/chunk';
import { embedChunks } from '../lib/ingestion/embed';

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx scripts/test-ingest.ts <path-to-pdf>');
    process.exit(1);
  }

  const buffer = readFileSync(resolve(pdfPath));
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  console.log(`Loaded PDF: ${pdfPath} (${buffer.length} bytes)`);

  const start = Date.now();

  const { pages, totalPages } = await extractPdfText(arrayBuffer);
  console.log(`Extracted ${totalPages} pages`);

  if (totalPages > 50) {
    console.error(`PDF has ${totalPages} pages, exceeds 50-page limit`);
    process.exit(1);
  }

  const chunks = chunkPages(pages, { maxTokens: 800, overlapTokens: 100 });
  console.log(`Produced ${chunks.length} chunks`);

  console.log('Embedding chunks...');
  const embedded = await embedChunks(chunks, {
    delayMs: 200,
    maxRetries: 3,
    onProgress: (done, total) => {
      process.stdout.write(`\r  Embedded ${done}/${total} chunks`);
    },
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nPipeline complete in ${elapsed}s`);
  console.log(`  Pages: ${totalPages}`);
  console.log(`  Chunks: ${chunks.length}`);
  console.log(`  Embedded: ${embedded.length}`);

  // Sanity checks
  if (embedded.length !== chunks.length) {
    console.error('ERROR: embedded count does not match chunk count');
    process.exit(1);
  }

  const badEmbeddings = embedded.filter((c) => c.embedding.length !== 768);
  if (badEmbeddings.length > 0) {
    console.error(`ERROR: ${badEmbeddings.length} embeddings have wrong dimension`);
    process.exit(1);
  }

  console.log('All checks passed.');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
