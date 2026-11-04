import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extractPdfText } from '../lib/ingestion/extract';
import { chunkPages } from '../lib/ingestion/chunk';

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx scripts/test-extract.ts <path-to-pdf>');
    process.exit(1);
  }

  const buffer = readFileSync(resolve(pdfPath));
  console.log(`Loaded PDF: ${pdfPath} (${buffer.length} bytes)`);

  const { pages, totalPages } = await extractPdfText(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  );
  console.log(`Total pages: ${totalPages}`);
  console.log(`Pages with text: ${pages.filter((p) => p.text.length > 0).length}`);

  pages.forEach((p) => {
    console.log(`  Page ${p.pageNumber}: ${p.text.length} chars`);
  });

  const chunks = chunkPages(pages, { maxTokens: 800, overlapTokens: 100 });
  console.log(`\nTotal chunks: ${chunks.length}`);
  chunks.forEach((c, i) => {
    const preview = c.content.slice(0, 80).replace(/\n/g, ' ');
    console.log(
      `  [${i}] page ${c.pageNumber}, ${c.content.length} chars: ${preview}...`
    );
  });

  // Sanity: every chunk must have a valid page number
  const badChunks = chunks.filter((c) => c.pageNumber < 1 || c.pageNumber > totalPages);
  if (badChunks.length > 0) {
    console.error(`\nERROR: ${badChunks.length} chunks have invalid page numbers`);
    process.exit(1);
  }
  console.log('\nAll chunks have valid page numbers.');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
