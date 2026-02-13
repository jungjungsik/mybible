# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check (no test framework configured)
```

Path alias: `@/*` maps to `./src/*`

## Overview

Korean-first Bible PWA with offline support. No backend — all data stored in IndexedDB via Dexie.js.

**Stack**: Next.js 14, TypeScript, Tailwind CSS, Dexie.js (IndexedDB), PWA

## Key Rules

### Next.js 14 (NOT 15)
- Params are plain objects: `const { bookId } = params` — do NOT use `use(params)`
- App Router with `'use client'` on all interactive pages

### API Providers
- **wldeh/bible-api**: ALL English versions (KJV, BSB, WEB, ASV, LSV, FBV). Returns duplicate verses — always deduplicate by verse number.
- **bible.helloao.org**: ONLY Korean (KRV). Response format: plain strings in content arrays for `kor_old`.
- wldeh has NO Korean translations. helloao English format is complex objects — avoid it.

### IndexedDB Patterns
- Settings load async via `useLiveQuery()` — pass empty `versionId` while loading to prevent spurious API fetches
- Clear stale data (`setData(null)`) when starting a new fetch to prevent showing old version's verses
- UUID primary keys on all user data tables
- DB currently at schema version 4

### Search
- Search operates on IndexedDB `verseCache` — only previously-read chapters unless user downloads full Bible via Settings
- `prefetchAllChapters()` downloads all 1,189 chapters with 3 concurrent requests, resumable
- Multi-word AND matching with relevance scoring

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home (daily verse, continue reading, quick actions)
│   ├── books/              # Book browser
│   ├── read/[bookId]/[chapter]/  # Main reading view
│   ├── search/             # Full-text search with scope filter
│   ├── notes/              # Notes list + sermon note editor
│   ├── settings/           # Settings + data management + Bible download
│   ├── stats/              # Reading time statistics
│   ├── compare/            # Cross-version verse comparison
│   └── commandments/       # Ten Commandments (Exodus 20)
├── components/
│   ├── bible/              # ChapterView, VerseDisplay, VerseActionMenu, etc.
│   ├── layout/             # Header, BottomNav
│   ├── notes/              # NoteCard, SermonNoteEditor, VerseNoteEditor
│   ├── search/             # SearchResult
│   ├── ui/                 # BottomSheet, ConfirmDialog, ErrorState, Skeleton
│   └── providers/          # ThemeProvider (dark mode)
├── hooks/                  # 11 custom hooks
│   ├── useBible.ts         # Fetch chapters with abort signal
│   ├── useSettings.ts      # Async settings from IndexedDB
│   ├── useReadingTimer.ts  # Page Visibility API timer
│   ├── useSearch.ts        # Debounced search with scope/pagination
│   └── ...                 # highlights, bookmarks, notes, TTS, dark mode, PWA
├── lib/
│   ├── api/
│   │   ├── bibleApi.ts     # Main API: fetch, cache, search (LRU + IndexedDB)
│   │   └── providers/      # wldeh.ts, helloao.ts
│   ├── constants/          # books.ts (66 books), versions.ts, colors.ts
│   ├── db/index.ts         # Dexie schema (v4): notes, highlights, bookmarks, readingProgress, settings, verseCache, readingSessions
│   └── utils/              # dailyVerse, formatReference, statsHelper, prefetchBible
└── types/bible.ts          # All TypeScript interfaces
```

### Data Flow

Bible reading: `useBible` hook → `bibleApi.ts` (LRU cache check → IndexedDB cache check → API fetch) → `persistVerses()` saves to IndexedDB → component renders

Search: `useSearch` hook (300ms debounce) → `searchBible()` scans IndexedDB `verseCache` → scores/ranks results → returns paginated `SearchResponse`

Settings: `useSettings` hook → `useLiveQuery()` from Dexie watches IndexedDB → reactive updates across all components

## Design System

### Colors (Tailwind `bible-*` namespace)
- **Accent**: `#C4956A` (warm gold) — buttons, highlights, active states
- **Background**: `#FFFDF7` light / `#0F0F17` dark
- **Surface**: `#FFF8EE` light / `#1A1A2E` dark
- **Text**: `#2C1810` light / `#E8E0D4` dark
- **5 highlight colors**: yellow, green, blue, pink, purple (with dark variants)

### Typography
- `font-serif` (Noto Serif KR) — Bible verse text
- `font-sans` (DM Sans) — UI labels, buttons
- `font-display` (Playfair Display) — headings, titles

### CSS Classes (defined in globals.css)
- `.card` — standard card with warm shadow
- `.btn-primary` — gold accent button
- `.btn-secondary` — border button
- `.glass` — glassmorphism with blur
- `.divider-ornament` — decorative divider

## Database Schema (Dexie v4)

| Table | Indexes | Purpose |
|-------|---------|---------|
| `notes` | id, type, [book+chapter], [book+chapter+verse], date | Verse notes + sermon notes |
| `highlights` | id, [book+chapter], [book+chapter+verse], version | 5-color verse highlighting |
| `bookmarks` | id, [book+chapter], [book+chapter+verse] | Bookmarked verses |
| `readingProgress` | id, [book+chapter], completedAt | Chapter completion tracking |
| `settings` | key | Key-value settings store |
| `verseCache` | id, version, [version+book+chapter], text | Persistent verse cache for search |
| `readingSessions` | id, date, book, [book+chapter], startedAt | Reading time tracking |

## Common Patterns

### Adding a new page
1. Create `src/app/{route}/page.tsx` with `'use client'`
2. Use `<Header title="..." showBack />` for sub-pages
3. Use `pb-24` on main content for BottomNav clearance
4. Use `max-w-2xl mx-auto` for content width

### Adding data to IndexedDB
1. Add interface to `src/types/bible.ts`
2. Add table to `ILoveBibleDB` class in `src/lib/db/index.ts`
3. Increment version number, re-declare ALL tables in new version
4. Add to `ExportData` interface + export/import/reset handlers in settings

### Fetching Bible data
```typescript
const { data, isLoading, error } = useBible(versionId, bookId, chapter);
```
Always check `settingsLoading` — pass empty `versionId` while settings load.
