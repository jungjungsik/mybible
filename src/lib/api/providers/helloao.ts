/**
 * Provider for bible.helloao.org API.
 *
 * Endpoint pattern:
 *   https://bible.helloao.org/api/{versionId}/{bookId}/{chapter}.json
 *
 * Response format:
 *   {
 *     "translation": { "id": "BSB", ... },
 *     "book": { "id": "JHN", "name": "John", ... },
 *     "chapter": {
 *       "number": 3,
 *       "content": [
 *         { "type": "heading", "content": ["..."] },
 *         { "type": "verse", "number": 1, "content": ["text...", { "noteId": 13 }, "more text"] },
 *         ...
 *       ]
 *     }
 *   }
 *
 * - versionId: "BSB", "kor_old", etc.
 * - bookId: 3-letter uppercase (GEN, JHN, etc.) -- same as our internal IDs
 * - verse content is an array that may contain strings and footnote objects
 */

import { BibleChapter, BibleVerse } from '@/types/bible';
import { toHelloaoBookId, toHelloaoVersionId } from '@/lib/api/bookIdMapping';

const BASE_URL = 'https://bible.helloao.org/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VerseContentItem = string | { noteId: number } | { text: string; poem?: number } | { lineBreak: boolean } | Record<string, any>;

interface HelloaoContentItem {
  type: 'verse' | 'heading' | 'line_break';
  number?: number;
  content?: VerseContentItem[];
}

interface HelloaoResponse {
  translation: {
    id: string;
    name: string;
    language: string;
  };
  book: {
    id: string;
    name: string;
    numberOfChapters: number;
  };
  chapter: {
    number: number;
    content: HelloaoContentItem[];
    numberOfVerses?: number;
  };
}

/**
 * Extract plain text from a helloao verse content array.
 * The array may contain:
 *   - plain strings: "text..."
 *   - footnote objects: { noteId: 13 } — skip
 *   - poetry/formatted text objects: { text: "...", poem: 1 } — extract .text
 *   - line break markers: { lineBreak: true } — convert to space
 */
function extractVerseText(content: VerseContentItem[]): string {
  const parts: string[] = [];
  for (const item of content) {
    if (typeof item === 'string') {
      parts.push(item);
    } else if (typeof item === 'object' && item !== null) {
      if ('text' in item && typeof item.text === 'string') {
        parts.push(item.text);
      } else if ('lineBreak' in item) {
        parts.push(' ');
      }
      // Skip { noteId } and other unknown objects
    }
  }
  return parts.join('').trim();
}

export async function fetchHelloaoChapter(
  versionId: string,
  bookId: string,
  chapter: number,
  signal?: AbortSignal
): Promise<BibleChapter> {
  const apiVersionId = toHelloaoVersionId(versionId);
  const apiBookId = toHelloaoBookId(bookId);

  const url = `${BASE_URL}/${apiVersionId}/${apiBookId}/${chapter}.json`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `helloao API error: ${response.status} ${response.statusText} (${url})`
    );
  }

  const json: HelloaoResponse = await response.json();

  if (!json.chapter || !Array.isArray(json.chapter.content)) {
    throw new Error(`helloao API: unexpected response format for ${url}`);
  }

  const verses: BibleVerse[] = [];

  for (const item of json.chapter.content) {
    if (item.type !== 'verse' || item.number == null || !item.content) {
      continue;
    }

    const text = extractVerseText(item.content);
    if (!text) continue;

    verses.push({
      book: bookId,
      chapter,
      verse: item.number,
      text,
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
