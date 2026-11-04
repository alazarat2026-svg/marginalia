import { extractText, getDocumentProxy } from 'unpdf';

export interface ExtractedPage {
  pageNumber: number;  // 1-based
  text: string;
}

export interface ExtractResult {
  pages: ExtractedPage[];
  totalPages: number;
}

/**
 * Extract text from a PDF buffer, one page at a time.
 *
 * Why unpdf: it is the maintained successor to pdf-parse, edge-compatible,
 * returns text per page (which we need for citations), and has no known
 * bugs with the PDFs we target.
 *
 * The returned text for each page is the raw extraction from unpdf.
 * Whitespace is normalized: multiple consecutive spaces collapse to one,
 * trailing/leading spaces on each line are trimmed, and empty lines are
 * preserved as paragraph breaks (important for sentence splitting downstream).
 */
export async function extractPdfText(buffer: ArrayBuffer): Promise<ExtractResult> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });

  const pages: ExtractedPage[] = text.map((pageText, i) => ({
    pageNumber: i + 1,
    text: normalizePageText(pageText),
  }));

  return { pages, totalPages };
}

function normalizePageText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')       // collapse runs of spaces/tabs
    .replace(/\n{3,}/g, '\n\n')    // collapse 3+ newlines to 2 (paragraph break)
    .replace(/ +\n/g, '\n')        // trim trailing space before newline
    .replace(/\n +/g, '\n')        // trim leading space after newline
    .trim();
}
