/**
 * Provider for wldeh/bible-api (GitHub raw content).
 *
 * Endpoint pattern:
 *   https://raw.githubusercontent.com/wldeh/bible-api/refs/heads/main
 *     /bibles/{version}/books/{bookname}/chapters/{chapter}.json
 *
 * Response format:
 *   { "data": [{ "book": "John", "chapter": "3", "verse": "1", "text": "..." }] }
 *
 * - version: "en-kjv", "en-asv", "en-web"
 * - bookname: lowercase full English name ("genesis", "1samuel", "songofsolomon")
 * - chapter/verse fields are strings in the response
 */

import { BibleChapter, BibleVerse } from '@/types/bible';
import { toWldehBookName, toWldehVersionPath } from '@/lib/api/bookIdMapping';

const BASE_URL =
  'https://raw.githubusercontent.com/wldeh/bible-api/refs/heads/main/bibles';

interface WldehVerse {
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

interface WldehResponse {
  data: WldehVerse[];
}

export async function fetchWldehChapter(
  versionId: string,
  bookId: string,
  chapter: number,
  signal?: AbortSignal
): Promise<BibleChapter> {
  const versionPath = toWldehVersionPath(versionId);
  const bookName = toWldehBookName(bookId);

  const url = `${BASE_URL}/${versionPath}/books/${bookName}/chapters/${chapter}.json`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `wldeh API error: ${response.status} ${response.statusText} (${url})`
    );
  }

  const json: WldehResponse = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error(`wldeh API: unexpected response format for ${url}`);
  }

  // Deduplicate: wldeh API sometimes returns duplicate verse entries
  const seen = new Set<number>();
  const verses: BibleVerse[] = [];
  for (const v of json.data) {
    const verseNum = parseInt(v.verse, 10);
    if (seen.has(verseNum)) continue;
    seen.add(verseNum);
    verses.push({
      book: bookId,
      chapter,
      verse: verseNum,
      text: v.text,
      version: versionId,
    });
  }

  // Sort by verse number to guarantee order
  verses.sort((a, b) => a.verse - b.verse);

  return {
    book: bookId,
    chapter,
    verses,
    version: versionId,
  };
}
