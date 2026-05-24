import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchHelloaoChapter } from './helloao';

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

const baseResponse = (content: unknown[]) => ({
  translation: { id: 'kor_old', name: '개역한글', language: 'ko' },
  book: { id: 'JHN', name: '요한복음', numberOfChapters: 21 },
  chapter: { number: 3, content },
});

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchHelloaoChapter', () => {
  it('parses plain string verse content (Korean format)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          { type: 'verse', number: 1, content: ['바리새인 중에 니고데모라 하는 사람이 있으니'] },
          { type: 'verse', number: 2, content: ['그가 밤에 예수께 와서 가로되'] },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);

    expect(result.verses).toHaveLength(2);
    expect(result.verses[0].text).toBe('바리새인 중에 니고데모라 하는 사람이 있으니');
    expect(result.verses[0].book).toBe('JHN');
    expect(result.verses[0].chapter).toBe(3);
    expect(result.verses[0].verse).toBe(1);
    expect(result.verses[0].version).toBe('krv');
  });

  it('extracts .text from formatted/poetry objects', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          {
            type: 'verse',
            number: 1,
            content: [{ text: 'In the beginning', poem: 1 }, ' was the Word'],
          },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses[0].text).toBe('In the beginning was the Word');
  });

  it('skips footnote objects ({ noteId })', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          {
            type: 'verse',
            number: 1,
            content: ['Hello', { noteId: 13 }, ' world'],
          },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses[0].text).toBe('Hello world');
  });

  it('converts lineBreak markers to spaces', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          {
            type: 'verse',
            number: 1,
            content: ['line one', { lineBreak: true }, 'line two'],
          },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses[0].text).toBe('line one line two');
  });

  it('skips non-verse entries (heading, line_break)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          { type: 'heading', content: ['니고데모와 예수'] },
          { type: 'verse', number: 1, content: ['첫 구절'] },
          { type: 'line_break' },
          { type: 'verse', number: 2, content: ['두 번째 구절'] },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses).toHaveLength(2);
    expect(result.verses.map((v) => v.verse)).toEqual([1, 2]);
  });

  it('skips verses that produce empty text', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          { type: 'verse', number: 1, content: [{ noteId: 1 }] },
          { type: 'verse', number: 2, content: ['real text'] },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses).toHaveLength(1);
    expect(result.verses[0].verse).toBe(2);
  });

  it('sorts verses by verse number when out of order', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      okResponse(
        baseResponse([
          { type: 'verse', number: 3, content: ['third'] },
          { type: 'verse', number: 1, content: ['first'] },
          { type: 'verse', number: 2, content: ['second'] },
        ])
      )
    );

    const result = await fetchHelloaoChapter('krv', 'JHN', 3);
    expect(result.verses.map((v) => v.verse)).toEqual([1, 2, 3]);
  });

  it('throws on non-OK HTTP response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(errorResponse(500, 'Server Error'));

    await expect(fetchHelloaoChapter('krv', 'JHN', 3)).rejects.toThrow(/500/);
  });

  it('throws when response shape is unexpected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(okResponse({ wrong: 'shape' }));

    await expect(fetchHelloaoChapter('krv', 'JHN', 3)).rejects.toThrow(
      /unexpected response format/
    );
  });

  it('throws on unknown version id (mapping layer)', async () => {
    await expect(fetchHelloaoChapter('unknown', 'JHN', 3)).rejects.toThrow(
      /Unknown version/
    );
  });

  it('builds the correct URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(okResponse(baseResponse([])));
    await fetchHelloaoChapter('krv', 'JHN', 3);

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/kor_old/');
    expect(calledUrl).toContain('/JHN/');
    expect(calledUrl).toContain('/3.json');
  });
});
