import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { extractPdfText } from '../lib/ingestion/extract';
import { chunkPages } from '../lib/ingestion/chunk';
import { embedChunks } from '../lib/ingestion/embed';
import { answerQuestion } from '../lib/retrieval/answer';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars not set');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // This test requires an existing signed-in user session. Since we don't
  // have auth wired yet, this test uses the service role or a test user.
  // For now, we test the pipeline logic WITHOUT Supabase writes by
  // verifying embedQuery and generateAnswer work independently.

  console.log('Test 1: embedQuery');
  const { embedQuery } = await import('../lib/retrieval/embed-query');
  const queryEmb = await embedQuery('What is the transformer architecture?');
  console.log(`  Got 768-dim embedding: ${queryEmb.length === 768}`);

  console.log('\nTest 2: generateAnswer (with fake chunks)');
  const { generateAnswer } = await import('../lib/retrieval/generate');
  const fakeChunks = [
    { content: 'The Transformer follows an encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers.', pageNumber: 3 },
    { content: 'The encoder is composed of a stack of N = 6 identical layers.', pageNumber: 3 },
  ];
  const result = await generateAnswer(
    'What is the transformer architecture?',
    fakeChunks
  );
  console.log(`  Answer: ${result.answer.slice(0, 200)}...`);
  console.log(`  Has [p. N] citation: ${/\[p\. \d+\]/.test(result.answer)}`);
  console.log(`  Insufficient context: ${result.insufficientContext}`);

  console.log('\nTest 3: generateAnswer with insufficient context');
  const emptyResult = await generateAnswer(
    'What is the warranty period?',
    [{ content: 'The transformer uses self-attention.', pageNumber: 1 }]
  );
  console.log(`  Answer: ${emptyResult.answer}`);
  console.log(`  Insufficient context: ${emptyResult.insufficientContext}`);

  console.log('\nAll retrieval tests complete.');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});