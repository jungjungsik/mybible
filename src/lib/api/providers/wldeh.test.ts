import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWldehChapter } from './wldeh';

const okResponse = (body: unknown): Response =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => body,
  }) as Response;

const errorResponse = (status: number, statusText: string): Response =>
  ({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  }) as Response;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchWldehChapter', () => {
  it('returns parsed chapter with correct shape', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse({
        data: [
          { book: 'John', chapter: '3', verse: '1', text: 'There was a man' },
          { book: 'John', chapter: '3', verse: '2', text: 'The same came to Jesus' },
        ],
      })
    );

    const result = await fetchWldehChapter('kjv', 'JHN', 3);

    expect(result.book).toBe('JHN');
    expect(result.chapter).toBe(3);
    expect(result.version).toBe('kjv');
    expect(result.verses).toHaveLength(2);
    expect(result.verses[0]).toMatchObject({
      book: 'JHN',
      chapter: 3,
      verse: 1,
      text: 'There was a man',
      version: 'kjv',
    });
  });

  it('deduplicates verses that appear multiple times', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse({
        data: [
          { book: 'John', chapter: '3', verse: '1', text: 'first' },
          { book: 'John', chapter: '3', verse: '1', text: 'duplicate of first' },
          { book: 'John', chapter: '3', verse: '2', text: 'second' },
          { book: 'John', chapter: '3', verse: '2', text: 'duplicate of second' },
        ],
      })
    );

    const result = await fetchWldehChapter('kjv', 'JHN', 3);

    expect(result.verses).toHaveLength(2);
    expect(result.verses[0].text).toBe('first'); // first occurrence wins
    expect(result.verses[1].text).toBe('second');
  });

  it('sorts verses by verse number when API returns out of order', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse({
        data: [
          { book: 'John', chapter: '3', verse: '3', text: 'third' },
          { book: 'John', chapter: '3', verse: '1', text: 'first' },
          { book: 'John', chapter: '3', verse: '2', text: 'second' },
        ],
      })
    );

    const result = await fetchWldehChapter('kjv', 'JHN', 3);
    expect(result.verses.map((v) => v.verse)).toEqual([1, 2, 3]);
  });

  it('throws on non-OK HTTP response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(errorResponse(404, 'Not Found'));

    await expect(fetchWldehChapter('kjv', 'JHN', 3)).rejects.toThrow(/404/);
  });

  it('throws when response shape is unexpected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(okResponse({ wrong: 'shape' }));

    await expect(fetchWldehChapter('kjv', 'JHN', 3)).rejects.toThrow(
      /unexpected response format/
    );
  });

  it('throws on unknown version id (mapping layer)', async () => {
    await expect(fetchWldehChapter('unknown', 'JHN', 3)).rejects.toThrow(
      /Unknown version/
    );
  });

  it('throws on unknown book id (mapping layer)', async () => {
    await expect(fetchWldehChapter('kjv', 'XXX', 3)).rejects.toThrow(
      /Unknown book/
    );
  });

  it('builds the correct URL for known book + version', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(okResponse({ data: [] }));
    await fetchWldehChapter('kjv', 'JHN', 3);

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/en-kjv/');
    expect(calledUrl).toContain('/john/');
    expect(calledUrl).toContain('/3.json');
  });
});
