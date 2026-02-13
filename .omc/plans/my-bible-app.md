# Work Plan: My Bible PWA (나만의 성경)

> Generated: 2026-02-12
> Status: READY FOR EXECUTION
> Source: PRD.md + bible-app-claude-code-guide.md

---

## 1. Context

### 1.1 Original Request
Build a personal Bible PWA app ("나만의 성경") for use during Sunday worship services. The app should provide Bible reading in multiple versions (Korean + English), sermon note-taking, verse memos, highlights, bookmarks, search, and version comparison. It must be a serverless PWA deployed on Vercel with zero operating cost.

### 1.2 Key Constraints
- **Tech Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Dexie.js + PWA
- **No backend**: All data stored in IndexedDB, Bible text fetched from free external APIs
- **$0 operating cost**: Deployed on Vercel free tier
- **Mobile-first**: Primary use on smartphone during church worship (dark environment)
- **Bible Versions**: KRV (Korean), KJV, BSB, WEB, ASV (English)
- **APIs**: wldeh/bible-api (jsDelivr CDN), bible.helloao.org
- **No authentication**: Personal use only

### 1.3 Critical User Scenarios
1. **During worship**: Pastor announces a passage -> user quick-jumps to verse -> reads along
2. **During sermon**: Bible text visible on top, sermon notes written below -> auto-save
3. **Daily use**: Bible reading, review memos, verse meditation

### 1.4 Current State
- Empty directory with only `PRD.md` and `bible-app-claude-code-guide.md`
- No existing code, starting from scratch

### 1.5 Scope Note: Post-MVP Features Pulled into v1
The following features were originally labeled as "post-MVP" in the PRD but are included in this plan as part of the initial build:
- **Daily Verse (오늘의 말씀)**: Included in Task 9.2 (Home Page) because it is lightweight (100 hardcoded verse references + date-seeded selection) and provides immediate value on the home page.
- **Reading Statistics**: Included in Task 9.1 (Settings Page) because the `readingProgress` table and hooks are already built in Phase 3, making the UI display trivial.

These are clearly scoped and do not add significant complexity.

---

## 2. Work Objectives

### 2.1 Core Objective
Deliver a fully functional, installable Bible PWA with 10 MVP features (F1-F10) that enables seamless Sunday worship Bible reading and sermon note-taking.

### 2.2 Deliverables
1. Next.js 14 project with TypeScript, Tailwind CSS, PWA configuration
2. Complete type system and Bible metadata (66 books)
3. Bible API abstraction layer with multi-provider support and caching
4. IndexedDB persistence layer with Dexie.js
5. Bible reading UI with verse interactions (highlight, bookmark, memo)
6. Quick verse jump with Korean/English parsing
7. Bible text search with highlighting
8. Sermon note system with 2-panel layout
9. Version comparison view (up to 4 versions)
10. Settings page with font size, dark mode, data export/import
11. Notes/memos/bookmarks list page with 3-tab layout
12. PWA manifest, service worker, offline support
13. Vercel deployment

### 2.3 Definition of Done
- [ ] PWA installable on phone, launches like native app
- [ ] "요 3:16" input navigates to John 3:16 within 2 seconds
- [ ] Sermon notes writable while viewing Bible text
- [ ] Dark mode comfortable in church (no glare)
- [ ] At least 3 Bible versions readable (KRV + KJV + BSB)
- [ ] Memos/highlights/bookmarks persist in IndexedDB
- [ ] Bookmark list accessible via tab on /notes page
- [ ] Deployed on Vercel, accessible from anywhere
- [ ] All 10 routes render without errors
- [ ] Build passes with zero TypeScript errors

---

## 3. Guardrails

### 3.1 MUST Have
- Korean Bible (KRV) as default version
- Quick verse jump supporting Korean abbreviations (요, 창, 롬, etc.)
- Dark mode with pure black (#000000) for OLED
- Sermon note 2-panel layout (scripture + notes)
- Auto-save for all notes (debounce 2s)
- Noto Serif Korean font for Bible text body
- Mobile-first layout (max-width 768px)
- Bottom navigation with 4 tabs
- Touch targets minimum 44x44px
- Offline-capable via service worker caching
- Bookmark list page accessible from /notes (third tab)

### 3.2 MUST NOT Have
- No server/backend (purely client-side)
- No authentication/login
- No copyrighted Bible versions (no NKRV, NIV, ESV, NASB)
- No paid APIs or services
- No CSS-in-JS (use Tailwind only)
- No external state management library (use React hooks + Dexie)
- No SSR for Bible data (all client-side fetching)

---

## 4. Architecture Overview

### 4.1 Directory Structure
```
src/
  app/
    layout.tsx                          # Root layout (fonts, dark mode provider, metadata)
    page.tsx                            # Home (continue reading, quick jump, daily verse)
    books/
      page.tsx                          # Book selection (OT/NT tabs, grid)
      [bookId]/
        page.tsx                        # Chapter selection (number grid)
    read/
      [bookId]/
        [chapter]/
          page.tsx                      # Bible reading main view (CORE)
    compare/
      page.tsx                          # Version comparison
    search/
      page.tsx                          # Search
    notes/
      page.tsx                          # Note list (설교 노트 | 절 메모 | 북마크 tabs)
      sermon/
        new/
          page.tsx                      # New sermon note
        [id]/
          page.tsx                      # View/edit sermon note
    settings/
      page.tsx                          # Settings
  components/
    layout/
      Header.tsx                        # Top header bar (48px, sticky)
      BottomNav.tsx                     # Bottom tab navigation (64px, fixed)
    bible/
      QuickJump.tsx                     # Verse reference input with parsing
      ChapterView.tsx                   # Chapter renderer with verse list
      VerseDisplay.tsx                  # Single verse with highlight/bookmark indicators
      VerseActionMenu.tsx               # Bottom sheet action menu for verse
      ChapterNavigation.tsx             # Previous/next chapter buttons
      VersionSelector.tsx               # Version dropdown (grouped Korean/English)
      VersionCompare.tsx                # Side-by-side version comparison cards
    notes/
      VerseNoteEditor.tsx               # Bottom sheet verse memo editor
      SermonNoteEditor.tsx              # Full-page sermon note editor
      NoteCard.tsx                      # Note preview card for lists
      BookmarkCard.tsx                  # Bookmark preview card for bookmark list tab
    search/
      SearchResult.tsx                  # Individual search result card
    ui/
      BottomSheet.tsx                   # Reusable bottom sheet component
      Skeleton.tsx                      # Loading skeleton component
      ConfirmDialog.tsx                 # Confirmation dialog
      ErrorState.tsx                    # Reusable error state with retry
  hooks/
    useBible.ts                         # Fetch chapter data
    useSearch.ts                        # Search with debounce
    useNotes.ts                         # CRUD for notes (live query)
    useHighlights.ts                    # CRUD for highlights (live query)
    useBookmarks.ts                     # CRUD for bookmarks (live query)
    useSettings.ts                      # App settings (live query)
    useDarkMode.ts                      # Dark mode toggle + system detection
    useReadingProgress.ts               # Reading progress tracking
  lib/
    api/
      bibleApi.ts                       # API abstraction with cache + fallback
      providers/
        wldeh.ts                        # wldeh/bible-api provider
        helloao.ts                      # bible.helloao.org provider
      bookIdMapping.ts                  # Internal ID to API-specific ID mapping
    db/
      index.ts                          # Dexie database definition
      notes.ts                          # Notes CRUD operations
      highlights.ts                     # Highlights CRUD operations
      bookmarks.ts                      # Bookmarks CRUD operations
      settings.ts                       # Settings key-value operations
      readingProgress.ts                # Reading progress operations
    constants/
      books.ts                          # 66 books metadata + parseReference()
      versions.ts                       # Bible version definitions
      colors.ts                         # Highlight color definitions (light/dark)
    utils/
      dailyVerse.ts                     # Daily verse selection (100 famous verses)
      formatReference.ts                # Format book/chapter/verse to display string
  types/
    bible.ts                            # All TypeScript type definitions
  styles/
    globals.css                         # Tailwind directives + custom properties
public/
  manifest.json                         # PWA manifest
  icons/
    icon-192.png                        # App icon 192x192
    icon-512.png                        # App icon 512x512
    favicon.ico                         # Favicon
  sw.js                                 # Service worker (or generated by next-pwa)
```

### 4.2 Data Flow
```
External APIs (wldeh CDN, helloao)
  -> API Abstraction Layer (cache + fallback)
    -> React Hooks (useBible, useSearch)
      -> UI Components

User Actions (highlight, bookmark, memo)
  -> React Hooks (useHighlights, useBookmarks, useNotes)
    -> Dexie.js CRUD functions
      -> IndexedDB (persistent storage)
        -> useLiveQuery (real-time UI updates)
```

---

## 5. Task Breakdown

### PHASE 1: Foundation Setup
> Dependencies: None
> Parallelizable: Tasks 1.1-1.4 are sequential (project must exist first), then 1.2-1.4 can run in parallel after 1.1

#### Task 1.1: Project Scaffolding
**File(s):**
- `package.json`
- `next.config.js` (or `next.config.mjs`)
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `src/styles/globals.css`
- `public/manifest.json`

**Work:**
1. Create Next.js 14 (App Router) project with TypeScript + Tailwind CSS
2. Install dependencies: `dexie`, `dexie-react-hooks`, `@ducanh2912/next-pwa`, `lucide-react`, `clsx`
3. Configure path aliases in tsconfig.json: `@/components`, `@/lib`, `@/hooks`, `@/types`
4. Configure Tailwind: dark mode (class strategy), custom colors for Bible theme
5. Set up globals.css with Tailwind directives and Noto Serif Korean import
6. Configure next.config.js with PWA settings
7. Create initial public/manifest.json

**Custom Tailwind Colors:**
```
bible-bg: light #FAFAF5 / dark #000000
bible-text: light #1A1A1A / dark #E0E0E0
bible-verse-num: light #999999 / dark #666666
bible-accent: #8B7355
bible-highlight-yellow: light #FFF9C4 / dark #3D3800
bible-highlight-green: light #C8E6C9 / dark #1B3D1C
bible-highlight-blue: light #BBDEFB / dark #0D2B4A
bible-highlight-pink: light #F8BBD0 / dark #4A0D2B
bible-highlight-purple: light #E1BEE7 / dark #2D0D3D
```

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Path aliases resolve correctly
- [ ] Tailwind classes apply correctly
- [ ] Dark mode class strategy works
- [ ] PWA manifest accessible at /manifest.json

**Verification:** Run `npm run build` and confirm zero errors.

---

#### Task 1.2: TypeScript Type Definitions
**File(s):**
- `src/types/bible.ts`

**Work:**
Define all TypeScript interfaces and types:
- `BibleVersion` (id, name, shortName, language, sourceApi)
- `BibleBook` (id, name, englishName, shortName, testament, chapters, order)
- `BibleVerse` (book, chapter, verse, text, version)
- `BibleChapter` (book, chapter, verses, version)
- `Note` (id, type, book, chapter, verse?, title?, content, date, tags?, createdAt, updatedAt)
- `Highlight` (id, book, chapter, verse, color, version, createdAt)
- `Bookmark` (id, book, chapter, verse, label?, createdAt)
- `ReadingProgress` (id, book, chapter, completedAt)
- `HighlightColor` type: `'yellow' | 'green' | 'blue' | 'pink' | 'purple'`
- `NoteType` type: `'verse' | 'sermon'`
- `Testament` type: `'old' | 'new'`
- `BibleLanguage` type: `'ko' | 'en'`
- `SourceApi` type: `'wldeh' | 'helloao'`
- `AppSettings` interface: `{ currentVersion, fontSize, darkMode, lastRead }`
- `ExportData` interface: `{ version, exportedAt, notes, highlights, bookmarks, readingProgress, settings }` (for import/export JSON schema)

**Acceptance Criteria:**
- [ ] All types exported and importable
- [ ] No TypeScript errors in the file
- [ ] Types match PRD data model exactly
- [ ] ExportData type defined for JSON export/import

**Verification:** `npx tsc --noEmit` passes.

---

#### Task 1.3: Bible 66 Books Metadata + parseReference
**File(s):**
- `src/lib/constants/books.ts`

**Work:**
1. Create `BIBLE_BOOKS: BibleBook[]` array with all 66 books
   - Each book: id (3-letter uppercase), name (Korean), englishName, shortName (Korean abbreviation), testament, chapters count, order (1-66)
   - Accurate chapter counts for every book
2. Create Korean abbreviation map (약어): 창, 출, 레, 민, 신, 수, 삿, 룻, 삼상, 삼하, 왕상, 왕하, 대상, 대하, 스, 느, 에, 욥, 시, 잠, 전, 아, 사, 렘, 애, 겔, 단, 호, 욜, 암, 옵, 욘, 미, 나, 합, 습, 학, 슥, 말, 마, 막, 눅, 요, 행, 롬, 고전, 고후, 갈, 엡, 빌, 골, 살전, 살후, 딤전, 딤후, 딛, 몬, 히, 약, 벧전, 벧후, 요일, 요이, 요삼, 유, 계
3. Create English abbreviation map: Gen, Exo, Lev, Num, Deu, etc.
4. Utility functions:
   - `getBookById(id: string): BibleBook | undefined`
   - `getBookByShortName(shortName: string): BibleBook | undefined`
   - `getOldTestament(): BibleBook[]`
   - `getNewTestament(): BibleBook[]`
5. `parseReference(input: string): { book: string; chapter: number; verse?: number } | null`
   - Parse Korean abbreviations: "요 3:16" -> { book: "JHN", chapter: 3, verse: 16 }
   - Parse Korean full names: "요한복음 3장 16절" -> { book: "JHN", chapter: 3, verse: 16 }
   - Parse English: "John 3:16", "JHN 3:16" -> { book: "JHN", chapter: 3, verse: 16 }
   - Parse chapter only: "롬 8" -> { book: "ROM", chapter: 8 }
   - Handle various separators: ":", "장", "절"

**Acceptance Criteria:**
- [ ] All 66 books present with correct metadata
- [ ] Chapter counts are accurate (Genesis=50, Psalms=150, etc.)
- [ ] parseReference handles: "요 3:16", "창 1:1", "롬 8:28", "요한복음 3장 16절", "John 3:16", "Gen 1:1"
- [ ] parseReference returns null for invalid input
- [ ] Korean abbreviations cover all 66 books

**Verification:** Write inline tests or console.log tests for parseReference with at least 10 different input formats.

---

#### Task 1.4: Bible Version Definitions
**File(s):**
- `src/lib/constants/versions.ts`
- `src/lib/constants/colors.ts`

**Work:**
1. `BIBLE_VERSIONS: BibleVersion[]` with 5 versions:
   - KRV (wldeh), KJV (wldeh), BSB (helloao), WEB (wldeh), ASV (wldeh)
2. Utility functions: `getVersionById`, `getKoreanVersions`, `getEnglishVersions`, `getAllVersions`
3. `HIGHLIGHT_COLORS` constant with light/dark theme values for all 5 colors
4. `getHighlightColorClasses(color, isDark)` utility

**Acceptance Criteria:**
- [ ] All 5 versions defined with correct sourceApi mapping
- [ ] Utility functions return correct subsets
- [ ] Highlight colors match PRD spec for both themes

**Verification:** TypeScript compiles without errors.

---

### PHASE 2: API Layer
> Dependencies: Phase 1 (types + constants)
> Parallelizable: Tasks 2.1-2.3 are sequential (providers first, then abstraction, then hooks)

#### Task 2.1: API Providers
**File(s):**
- `src/lib/api/providers/wldeh.ts`
- `src/lib/api/providers/helloao.ts`
- `src/lib/api/bookIdMapping.ts`

**Work:**
1. **Book ID Mapping** (`bookIdMapping.ts`):
   - Map internal IDs (GEN, EXO, etc.) to wldeh API book names
   - Map internal IDs to helloao API book names
   - The wldeh API uses lowercase full names or specific formats in the URL path
   - The helloao API uses its own book ID format
   - Test against actual API responses

2. **Wldeh Provider** (`wldeh.ts`):
   - Endpoint: `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/{version}/books/{book}/chapters/{chapter}.json`
   - Implement `getChapter(versionId, bookId, chapter)` -> `BibleChapter`
   - Parse response format into our BibleVerse[] structure
   - Handle version ID mapping (our "krv" -> API's version identifier)
   - Error handling with meaningful messages

3. **Helloao Provider** (`helloao.ts`):
   - Endpoint: `https://bible.helloao.org/api/{version}/{book}/{chapter}.json`
   - Implement `getChapter(versionId, bookId, chapter)` -> `BibleChapter`
   - Parse response into BibleVerse[] structure
   - Handle BSB-specific formatting

**CRITICAL**: The actual API response formats MUST be verified. The executor should:
1. Fetch a sample from each API endpoint
2. Log the response structure
3. Build the parser to match the actual response

**Acceptance Criteria:**
- [ ] Wldeh provider fetches KRV Genesis 1 successfully
- [ ] Wldeh provider fetches KJV John 3 successfully
- [ ] Helloao provider fetches BSB John 3 successfully
- [ ] Book ID mapping covers all 66 books for both providers
- [ ] Response correctly parsed into BibleChapter type
- [ ] Errors thrown with descriptive messages on failure

**Verification:** Fetch at least one chapter from each provider and verify verse count matches expected.

---

#### Task 2.2: API Abstraction Layer
**File(s):**
- `src/lib/api/bibleApi.ts`

**Work:**
1. Memory cache using `Map<string, BibleChapter>` with max 100 entries
   - Key format: `${versionId}:${bookId}:${chapter}`
   - When cache exceeds 100 entries, delete oldest entries (FIFO)
2. `fetchChapter(versionId, bookId, chapter)`:
   - Check cache first
   - Determine provider from version's `sourceApi` field
   - Fetch from primary provider
   - On failure, retry once
   - On second failure, try fallback provider
   - Cache successful result
   - Support AbortController for request cancellation
3. `searchBible(versionId, query)`:
   - Implementation depends on API capability
   - For wldeh: may need to fetch multiple chapters and search locally
   - For helloao: check if search endpoint exists
   - Return matching BibleVerse[] with context

**Acceptance Criteria:**
- [ ] Cache hit returns data without API call
- [ ] Cache eviction works when exceeding 100 entries
- [ ] Primary provider failure triggers fallback
- [ ] AbortController cancels in-flight requests
- [ ] fetchChapter returns correctly typed BibleChapter

**Verification:** Call fetchChapter twice for same chapter - second call should be instant (cached).

---

#### Task 2.3: React Hooks for Bible Data
**File(s):**
- `src/hooks/useBible.ts`
- `src/hooks/useSearch.ts`

**Work:**
1. `useBible(versionId, bookId, chapter)`:
   - Returns `{ data, isLoading, error, refetch }`
   - Uses useEffect with AbortController
   - Cancels previous request on parameter change (race condition prevention)
   - Loading/error state management
2. `useSearch(versionId, query, enabled)`:
   - Returns `{ results, isSearching, error }`
   - 300ms debounce on query changes
   - Only searches when `enabled` is true and query length >= 2

**Acceptance Criteria:**
- [ ] useBible loads data and updates on parameter change
- [ ] useBible cancels previous request when parameters change rapidly
- [ ] useSearch debounces at 300ms
- [ ] Both hooks handle loading and error states correctly

**Verification:** Component using useBible renders verse text correctly.

---

### PHASE 3: IndexedDB Persistence
> Dependencies: Phase 1 (types)
> Parallelizable: Can run in parallel with Phase 2

#### Task 3.1: Dexie Database Setup + CRUD
**File(s):**
- `src/lib/db/index.ts`
- `src/lib/db/notes.ts`
- `src/lib/db/highlights.ts`
- `src/lib/db/bookmarks.ts`
- `src/lib/db/settings.ts`
- `src/lib/db/readingProgress.ts`

**Work:**
1. **Database definition** (`index.ts`):
   - DB name: 'MyBibleDB', version: 1
   - Exact Dexie store definitions:
   ```typescript
   const db = new Dexie('MyBibleDB') as MyBibleDB;
   db.version(1).stores({
     notes: 'id, type, book, chapter, verse, date, createdAt',
     highlights: 'id, book, chapter, verse, version, createdAt',
     bookmarks: 'id, book, chapter, verse, createdAt',
     readingProgress: 'id, book, chapter, completedAt',
     settings: 'key'
   });
   ```
   - `id` = UUID string primary key (use `crypto.randomUUID()` in CRUD functions)
   - **IMPORTANT**: Do NOT use `++id` (auto-increment). UUIDs ensure globally unique IDs for export/import portability across devices.
   - All other listed fields are indexed for query performance
   - `settings` uses `key` as primary key (key-value store pattern)

2. **Notes CRUD** (`notes.ts`):
   - addNote, updateNote, deleteNote
   - getNotesByChapter, getNotesByVerse, getSermonNotes, getAllNotes, searchNotes
3. **Highlights CRUD** (`highlights.ts`):
   - addHighlight, removeHighlight, getHighlightsByChapter, getHighlightByVerse
4. **Bookmarks CRUD** (`bookmarks.ts`):
   - addBookmark, removeBookmark, getAllBookmarks, getBookmarksByChapter, isBookmarked
5. **Settings** (`settings.ts`):
   - getSetting<T>, setSetting<T>
   - Keys: currentVersion, fontSize, darkMode, lastRead
6. **Reading Progress** (`readingProgress.ts`):
   - markChapterRead, getReadingProgress, getBookProgress

**Acceptance Criteria:**
- [ ] Database creates successfully on first load
- [ ] All CRUD operations work correctly
- [ ] Notes searchable by content
- [ ] Settings persist between page refreshes
- [ ] Highlight toggle (add if not exists, remove if exists) works
- [ ] Bookmarks queryable by chapter (for reading view) and globally (for bookmark list)

**Verification:** Add a note, read it back, update it, delete it - all operations succeed.

---

#### Task 3.2: Reactive Database Hooks
**File(s):**
- `src/hooks/useNotes.ts`
- `src/hooks/useHighlights.ts`
- `src/hooks/useBookmarks.ts`
- `src/hooks/useSettings.ts`
- `src/hooks/useReadingProgress.ts`

**Work:**
1. All hooks use `useLiveQuery` from `dexie-react-hooks` for real-time reactivity
2. `useNotes`: useNotes(book, chapter), useVerseNotes(book, chapter, verse), useSermonNotes()
3. `useHighlights`: useHighlights(book, chapter), useToggleHighlight()
4. `useBookmarks`: useBookmarks(), useAllBookmarks(), useChapterBookmarks(book, chapter), useToggleBookmark()
5. `useSettings`: returns `{ settings, updateSetting, isLoading }` with AppSettings type
6. `useReadingProgress`: useReadingProgress(), useBookProgress(book)

**Note:** `useAllBookmarks()` returns all bookmarks sorted by `createdAt` descending, used by the bookmark list tab on `/notes`.

**Acceptance Criteria:**
- [ ] UI updates automatically when IndexedDB data changes
- [ ] Hooks return correct types
- [ ] Toggle operations work (highlight on/off, bookmark on/off)
- [ ] Settings hook provides default values before DB loads
- [ ] useAllBookmarks returns full list sorted by date

**Verification:** Add a highlight via hook, verify UI reflects change without page refresh.

---

### PHASE 4: Core UI - Layout and Navigation
> Dependencies: Phase 1 only (does NOT depend on Phase 2 or Phase 3)
> Parallelizable: Tasks 4.1-4.3 can run in parallel (independent UI components)

#### Task 4.1: Root Layout + Dark Mode + Fonts
**File(s):**
- `src/app/layout.tsx`
- `src/hooks/useDarkMode.ts`
- `src/components/providers/ThemeProvider.tsx`

**Work:**
1. Root layout with:
   - HTML lang="ko"
   - Noto Serif Korean font import (Google Fonts, weights 400 + 700)
   - System-ui as UI font
   - Metadata: viewport, theme-color, apple-mobile-web-app-capable
   - Max-width 768px centered container
   - Bottom padding for BottomNav (64px)
2. Dark mode system:
   - Read initial preference from IndexedDB (or localStorage for blocking script)
   - Toggle 'dark' class on HTML element
   - System theme detection (prefers-color-scheme)
   - Script tag in head to prevent flash of wrong theme (FOUC prevention)
3. ThemeProvider wrapping the app for dark mode context

**Acceptance Criteria:**
- [ ] Noto Serif Korean renders for body text
- [ ] Dark mode toggles without page flash
- [ ] System theme change detected
- [ ] Layout centered at max-width 768px
- [ ] apple-mobile-web-app-capable meta tag present

**Verification:** Toggle dark mode, verify background switches between #FAFAF5 and #000000.

---

#### Task 4.2: Header Component
**File(s):**
- `src/components/layout/Header.tsx`

**Work:**
- Left: back button (when navigable, using router)
- Center: current location text (e.g., "요한복음 3장")
- Right: action buttons (dark mode toggle icon, optional search shortcut)
- Height: 48px, sticky top, z-index above content
- Light/dark styling
- Accept props: title, showBack, rightActions

**Acceptance Criteria:**
- [ ] Header renders at 48px height, sticks to top
- [ ] Back button navigates correctly
- [ ] Title displays current page context
- [ ] Responsive to dark mode

**Verification:** Visual check on mobile viewport.

---

#### Task 4.3: Bottom Navigation
**File(s):**
- `src/components/layout/BottomNav.tsx`

**Work:**
- 4 tabs with Lucide icons:
  1. Bible (BookOpen icon) -> `/books`
  2. Search (Search icon) -> `/search`
  3. Notes (PenSquare icon) -> `/notes`
  4. Settings (Settings icon) -> `/settings`
- Active tab highlighted with accent color (#8B7355)
- Height: 64px, fixed bottom, z-index above content
- Safe area padding for phones with gesture bars
- Use `usePathname()` to determine active tab

**Acceptance Criteria:**
- [ ] All 4 tabs render with correct icons
- [ ] Active tab visually distinct
- [ ] Navigation works between all tab routes
- [ ] Fixed to bottom, doesn't scroll with content
- [ ] Touch targets >= 44x44px

**Verification:** Navigate between all 4 tabs, verify active state updates.

---

#### Task 4.4: Reusable UI Components
**File(s):**
- `src/components/ui/BottomSheet.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/ConfirmDialog.tsx`
- `src/components/ui/ErrorState.tsx`

**Work:**
1. **BottomSheet**: Slide-up panel with backdrop, close on backdrop tap, drag-to-dismiss optional
2. **Skeleton**: Loading placeholder matching verse text layout
3. **ConfirmDialog**: Modal with title, message, confirm/cancel buttons
4. **ErrorState**: Reusable error display component with:
   - Error icon (AlertTriangle from lucide-react)
   - Error message text (default: "데이터를 불러오는 데 실패했습니다")
   - "다시 시도" (Retry) button that calls an `onRetry` callback
   - Optional "오프라인 모드" indicator when navigator.onLine is false
   - Props: `{ message?: string; onRetry?: () => void }`

**Acceptance Criteria:**
- [ ] BottomSheet slides up smoothly, closes on backdrop tap
- [ ] Skeleton matches reading view layout
- [ ] ConfirmDialog blocks interaction until dismissed
- [ ] ErrorState shows message and retry button; retry triggers callback

**Verification:** Visual check of each component in isolation.

---

### PHASE 5: Core UI - Bible Reading (CRITICAL PATH)
> Dependencies: Phase 2 (API), Phase 3 (DB), Phase 4 (Layout)
> This is the MOST IMPORTANT phase - the Bible reading view is the core of the app

#### Task 5.1: Book Selection Page
**File(s):**
- `src/app/books/page.tsx`

**Work:**
- OT/NT tab switcher at top
- Grid layout (4 columns desktop, 3 columns mobile)
- Each book shows Korean abbreviation (shortName)
- Currently reading book highlighted
- Tap navigates to `/books/[bookId]`

**Acceptance Criteria:**
- [ ] 39 OT books and 27 NT books display correctly
- [ ] Tab switching works
- [ ] Grid items are touch-friendly (44x44px minimum)
- [ ] Currently reading book visually highlighted
- [ ] Dark mode compatible

**Verification:** All 66 books visible, tapping navigates correctly.

---

#### Task 5.2: Chapter Selection Page
**File(s):**
- `src/app/books/[bookId]/page.tsx`

**Work:**
- Header shows book name (Korean)
- Number grid (6 columns) showing chapter numbers
- Read chapters marked (check or color)
- Tap navigates to `/read/[bookId]/[chapter]`

**Acceptance Criteria:**
- [ ] Correct chapter count for the selected book
- [ ] Number grid touch-friendly
- [ ] Read chapters visually distinct
- [ ] Navigation to reading view works

**Verification:** Select Genesis (50 chapters), verify all 50 chapter numbers appear.

---

#### Task 5.3: Bible Reading Main View (CORE)
**File(s):**
- `src/app/read/[bookId]/[chapter]/page.tsx`
- `src/components/bible/ChapterView.tsx`
- `src/components/bible/VerseDisplay.tsx`
- `src/components/bible/ChapterNavigation.tsx`
- `src/components/bible/VersionSelector.tsx`

**Work:**
1. **Page** (`page.tsx`):
   - Extract bookId and chapter from URL params
   - Use useBible hook to fetch chapter data
   - Use useHighlights, useBookmarks for verse decorations
   - Handle `?verse=16` query param for scroll-to-verse
   - Save reading position to settings (lastRead)
   - Show loading skeleton while fetching
   - **Show ErrorState component when API fetch fails** (with retry button that calls `refetch()`)

2. **ChapterView** (`ChapterView.tsx`):
   - Render list of VerseDisplay components
   - Version selector at top
   - Scroll container for verses
   - Pass highlight/bookmark data to each verse

3. **VerseDisplay** (`VerseDisplay.tsx`):
   - Verse number: small, gray (#999/#666), superscript style
   - Verse text: Noto Serif Korean, size from settings (default 18px), line-height 1.8
   - Highlighted verse: colored background based on highlight color
   - Bookmarked verse: small ribbon icon on right
   - Verse with memo: small memo icon indicator
   - **Single tap** handler: open VerseActionMenu (NOT long-press; single tap is simpler and more discoverable for the worship use case where users need quick access)
   - Scroll-to target (via ref) when URL has ?verse= param
   - Pulse animation for 2 seconds when scrolled to via URL

4. **ChapterNavigation** (`ChapterNavigation.tsx`):
   - Previous/next chapter buttons at bottom
   - Format: "< 2장 | 요한복음 3장 | 4장 >"
   - Handle first/last chapter of book
   - Navigate to previous/next book when at boundary

5. **VersionSelector** (`VersionSelector.tsx`):
   - Current version display
   - Dropdown grouped by language (한글 / English)
   - Selecting version reloads same chapter in new version

**Acceptance Criteria:**
- [ ] Bible text loads and displays correctly
- [ ] Verse numbers styled as superscript, gray
- [ ] Font size matches settings (default 18px)
- [ ] Line height is 1.8
- [ ] Highlighted verses show correct background color
- [ ] Bookmarked verses show ribbon icon
- [ ] **Single tap** on verse opens action menu
- [ ] ?verse=16 scrolls to verse 16 with pulse effect
- [ ] Chapter navigation works (prev/next)
- [ ] Version selector switches Bible version
- [ ] Last read position saved automatically
- [ ] Loading skeleton shown while fetching
- [ ] **ErrorState shown when API fails, with working retry button**
- [ ] Dark mode renders correctly (pure black background, light text)

**Verification:**
1. Navigate to /read/JHN/3 - verify all verses of John 3 display
2. Navigate to /read/JHN/3?verse=16 - verify scroll to verse 16
3. Switch version to KJV - verify English text loads
4. Navigate to next chapter - verify John 4 loads
5. Disconnect network, try to load a new chapter - verify ErrorState appears with retry button

---

#### Task 5.4: Verse Action Menu
**File(s):**
- `src/components/bible/VerseActionMenu.tsx`

**Work:**
- Bottom sheet UI (uses BottomSheet component)
- Shows selected verse text at top
- Action buttons:
  1. Copy (verse text + reference, e.g., "요한복음 3:16 - 하나님이 세상을...")
  2. Highlight (5 color circles to choose from, currently active color selected)
  3. Bookmark (toggle on/off)
  4. Add Memo (opens VerseNoteEditor)
  5. Compare Versions (navigates to /compare with this verse)
- Uses Clipboard API for copy
- Haptic feedback if available

**Acceptance Criteria:**
- [ ] Bottom sheet slides up on verse tap
- [ ] All 5 actions present with icons
- [ ] Copy copies formatted text to clipboard
- [ ] Highlight color selection works
- [ ] Bookmark toggles correctly
- [ ] Memo opens note editor
- [ ] Compare navigates to comparison page

**Verification:** Tap a verse, verify all actions work correctly.

---

#### Task 5.5: Quick Verse Jump
**File(s):**
- `src/components/bible/QuickJump.tsx`

**Work:**
- Input field with placeholder "구절 입력 (예: 요 3:16)"
- Real-time parsing using parseReference()
- Visual feedback:
  - Valid: green indicator + resolved reference (e.g., "요한복음 3장 16절")
  - Invalid: red indicator
  - Empty: neutral
- On Enter or button click: navigate to `/read/[bookId]/[chapter]?verse=[verse]`
- Auto-focus option for search page
- Keyboard: Enter to submit

**Acceptance Criteria:**
- [ ] "요 3:16" resolves and navigates to John 3:16
- [ ] "창 1:1" resolves to Genesis 1:1
- [ ] "John 3:16" resolves correctly
- [ ] "요한복음 3장 16절" resolves correctly
- [ ] Invalid input shows error state
- [ ] Enter key triggers navigation

**Verification:** Test with at least 6 different input formats (Korean abbrev, Korean full, English abbrev, English full, chapter-only, invalid).

---

### PHASE 6: Search
> Dependencies: Phase 2 (API hooks), Phase 5 (reading view for navigation)

#### Task 6.1: Search Page
**File(s):**
- `src/app/search/page.tsx`
- `src/components/search/SearchResult.tsx`

**Work:**
1. **Search Page**:
   - Auto-focus search input at top
   - Detect if input is a verse reference (parseReference) -> show "바로가기" link
   - Otherwise, trigger text search with 300ms debounce
   - Version selector for search scope
   - Recent searches list (localStorage, max 10)
   - Loading spinner during search
   - "검색 결과 없음" message when empty
2. **SearchResult Card**:
   - Reference display: "요한복음 3:16"
   - Text preview with search term highlighted (bold or background)
   - Tap to navigate to reading view at that verse

**Korean Text Search Strategy:**
The external APIs may not have a search endpoint. The concrete fallback strategy is:
1. **Primary**: Check if the selected API provider has a search endpoint. If so, use it.
2. **Fallback (client-side search)**: Search through chapters that are already cached in the memory cache (`Map<string, BibleChapter>` from bibleApi.ts). This means recently viewed chapters are always searchable.
3. **Extended fallback**: If the user wants broader search results and has few cached chapters, the search function fetches chapters sequentially from the current book (all chapters of the book the user last read) and searches locally. Show a progress indicator ("창세기 검색 중... 12/50") during this process. Limit to one book at a time to avoid excessive API calls.
4. **IndexedDB search**: Also search through all locally stored verse memos/notes content using `notes.searchNotes(query)`.

This ensures the user always gets SOME results even without a server-side search API.

**Acceptance Criteria:**
- [ ] Search input auto-focuses
- [ ] Verse reference detected and quick-jump offered
- [ ] Text search returns results with highlighted terms
- [ ] Recent searches saved and displayed
- [ ] Result tap navigates to correct verse
- [ ] Loading state visible during search
- [ ] No results message shows when appropriate
- [ ] Client-side fallback works when API search unavailable

**Verification:** Search for "사랑" in KRV, verify results include John 3:16 area. Search for "요 3:16", verify quick-jump appears.

---

### PHASE 7: Notes and Memos
> Dependencies: Phase 3 (DB), Phase 5 (reading view)
> Parallelizable: Task 7.1 and 7.2 can run in parallel

#### Task 7.1: Verse Memo System
**File(s):**
- `src/components/notes/VerseNoteEditor.tsx`

**Work:**
- Bottom sheet editor for verse memos
- Shows verse reference and text at top
- Textarea for memo content
- Save/Cancel buttons
- Auto-save with 2s debounce
- Edit existing memo if one exists for this verse
- Delete option for existing memos

**Acceptance Criteria:**
- [ ] Bottom sheet opens from verse action menu
- [ ] Verse reference displayed correctly
- [ ] Auto-save works (debounce 2s)
- [ ] Existing memo loads for editing
- [ ] Delete removes memo
- [ ] Memo icon appears on verse after saving

**Verification:** Add memo to a verse, navigate away, return - memo icon visible and content preserved.

---

#### Task 7.2: Sermon Note System + Notes List Page (with Bookmark List)
**File(s):**
- `src/components/notes/SermonNoteEditor.tsx`
- `src/components/notes/NoteCard.tsx`
- `src/components/notes/BookmarkCard.tsx`
- `src/app/notes/page.tsx`
- `src/app/notes/sermon/new/page.tsx`
- `src/app/notes/sermon/[id]/page.tsx`

**Work:**
1. **SermonNoteEditor**:
   - Date input (default: today, format for Korean locale)
   - Title input (sermon title)
   - Scripture reference input (uses QuickJump parsing)
   - When reference entered, fetch and display the Bible text above
   - 2-panel layout: scripture text fixed at top, memo area scrollable below
   - Large textarea for notes
   - Optional tags input
   - Auto-save (debounce 2s)
   - Large font, generous padding for worship use

2. **Notes List Page** (`/notes`):
   - **Three tabs**: "설교 노트" | "절 메모" | "북마크"
   - **설교 노트 tab**: date-sorted sermon note cards (NoteCard)
   - **절 메모 tab**: verse memos grouped by book or date-sorted
   - **북마크 tab**: all bookmarks sorted by date (newest first), displayed as BookmarkCard components
   - Search within notes (applies to active tab)
   - Swipe or long-press to delete

3. **BookmarkCard** (`BookmarkCard.tsx`):
   - Displays bookmark reference: "요한복음 3:16"
   - Shows the bookmarked date (formatted Korean locale)
   - Optional label display if user added one
   - Tap navigates to `/read/[bookId]/[chapter]?verse=[verse]`
   - Swipe to delete (with confirmation)
   - Uses `useAllBookmarks()` hook for data

4. **New Sermon Note** (`/notes/sermon/new`):
   - Full-page SermonNoteEditor
   - Optimized for worship use

5. **View/Edit Sermon Note** (`/notes/sermon/[id]`):
   - Load existing note by ID
   - Display in read mode, toggle to edit mode
   - Same SermonNoteEditor component

6. **NoteCard**:
   - Date, title, scripture reference
   - Content preview (first 100 chars)
   - Tags display
   - Tap to open full note

**Acceptance Criteria:**
- [ ] New sermon note creates successfully
- [ ] Scripture text loads and displays above memo area
- [ ] Auto-save works (navigate away and back, content preserved)
- [ ] Note list shows all notes with correct sorting
- [ ] **Three-tab switching works: 설교 노트, 절 메모, 북마크**
- [ ] **Bookmark tab shows all bookmarks sorted by date**
- [ ] **BookmarkCard tap navigates to the bookmarked verse**
- [ ] **Bookmark deletion works from the list**
- [ ] Existing note opens in view mode, can switch to edit
- [ ] Delete confirmation dialog works
- [ ] 2-panel layout works well on mobile

**Verification:**
1. Create a sermon note with "요 3:16" as scripture
2. Verify John 3:16 text displays
3. Write some notes, navigate away
4. Return to /notes, verify note appears in list
5. Open note, verify all content preserved
6. **Switch to 북마크 tab, verify bookmarked verses appear**
7. **Tap a bookmark, verify navigation to the correct verse**

---

### PHASE 8: Version Comparison
> Dependencies: Phase 2 (API), Phase 5 (reading view components)

#### Task 8.1: Version Comparison View
**File(s):**
- `src/app/compare/page.tsx`
- `src/components/bible/VersionCompare.tsx`

**Work:**
1. **Compare Page**:
   - QuickJump input for verse selection
   - Checkbox list to select versions (max 4)
   - Default: current version + 1 other
   - Display comparison using VersionCompare

2. **VersionCompare**:
   - Verse reference header (fixed top)
   - Card for each selected version:
     - Version name badge
     - Verse text in that version
   - Fetch all versions in parallel
   - Loading state per version card
   - Can also be accessed from verse action menu ("다른 버전으로 보기")

**Acceptance Criteria:**
- [ ] Verse input resolves and triggers comparison
- [ ] Up to 4 versions displayed simultaneously
- [ ] Each version card shows version name + text
- [ ] Loading states per card
- [ ] KRV and KJV comparison looks correct

**Verification:** Compare John 3:16 in KRV + KJV + BSB, verify all 3 versions display.

---

### PHASE 9: Settings and Home Page
> Dependencies: Phase 3 (settings DB), Phase 4 (layout)

#### Task 9.1: Settings Page
**File(s):**
- `src/app/settings/page.tsx`

**Work:**
1. **Bible Version**: Default version selector (grouped dropdown)
2. **Display**:
   - Font size slider (14px - 28px, default 18px)
   - Live preview of font size
   - Dark mode toggle
3. **Data Management**:
   - Export data (JSON download of all notes, highlights, bookmarks)
   - Import data (JSON file upload, merge with existing)
   - Clear all data (with ConfirmDialog)

   **Export/Import JSON Schema:**
   ```typescript
   interface ExportData {
     version: 1;                          // Schema version for future migration
     exportedAt: string;                  // ISO 8601 timestamp
     notes: Note[];                       // All notes (verse + sermon)
     highlights: Highlight[];             // All highlights
     bookmarks: Bookmark[];               // All bookmarks
     readingProgress: ReadingProgress[];  // All reading progress
     settings: Array<{ key: string; value: any }>;  // All settings key-value pairs
   }
   ```

   **Import Merge Strategy:**
   - Match records by `id` field
   - If a record with the same `id` exists locally:
     - Compare `updatedAt` (for notes) or `createdAt` (for highlights/bookmarks)
     - Keep the newer record (last-write-wins)
   - If no matching `id` exists, insert as new record
   - Settings: imported values overwrite existing values for matching keys
   - After import, show summary: "X개 노트, Y개 하이라이트, Z개 북마크 가져옴"

4. **Reading Statistics** (Post-MVP feature, included due to trivial cost - see Section 1.5):
   - Total chapters read / total (X / 1189)
   - Progress bar
   - OT/NT breakdown
5. **App Info**:
   - Version number
   - Credits for API sources (with links)
   - BSB CC BY-SA 4.0 attribution

**Acceptance Criteria:**
- [ ] Font size change reflects immediately in preview
- [ ] Dark mode toggle works
- [ ] Default version persists between sessions
- [ ] Export creates valid JSON file matching ExportData schema
- [ ] Import correctly loads data with merge strategy
- [ ] Import shows summary of imported records
- [ ] Clear data requires confirmation and wipes all IndexedDB tables
- [ ] Reading statistics display correctly

**Verification:** Change font size, navigate to reading view, verify size changed. Export, clear, import, verify data restored.

---

#### Task 9.2: Home Page
**File(s):**
- `src/app/page.tsx`
- `src/lib/utils/dailyVerse.ts`
- `src/lib/utils/formatReference.ts`

**Work:**
1. **Home Page**:
   - "오늘의 말씀" card (daily verse from 100 famous verses)
   - "이어서 읽기" button (last read position from settings)
   - QuickJump input
   - Recent chapters list (last 5 read)
2. **Daily Verse** (Post-MVP feature, included due to trivial cost - see Section 1.5):
   - 100 famous Bible verses (hardcoded list with book, chapter, verse, Korean preview)
   - Date-seeded selection (same verse all day)
   - Fetch actual text from API on display
3. **Format Reference**:
   - `formatReference(bookId, chapter, verse?)` -> "요한복음 3:16"
   - Used throughout the app for display

**Acceptance Criteria:**
- [ ] Home page loads with daily verse
- [ ] "이어서 읽기" navigates to last read position
- [ ] QuickJump works from home page
- [ ] Same daily verse for the same day
- [ ] Recent chapters list shows last 5 visited

**Verification:** Visit home page, verify daily verse displays. Read a chapter, return to home, verify "이어서 읽기" shows correct position.

---

### PHASE 10: PWA and Deployment
> Dependencies: All previous phases

#### Task 10.1: PWA Configuration
**File(s):**
- `public/manifest.json` (update)
- `next.config.mjs` (update)
- PWA icons generation

**Work:**
1. Complete manifest.json:
   - name: "나의 성경"
   - short_name: "성경"
   - theme_color: "#1a1a2e"
   - background_color: "#FAFAF5"
   - display: standalone
   - orientation: portrait
   - start_url: "/"
   - scope: "/"
   - icons: 192x192, 512x512

   **Design Decision: theme_color = #1a1a2e (dark navy)**
   `theme_color` controls the browser chrome / OS status bar color, NOT the app content.
   Dark navy (#1a1a2e) was chosen over the accent color (#8B7355) because:
   - This app is primarily used in dark church environments during worship
   - Dark status bar reduces visual distraction and glare
   - #8B7355 (warm brown) is the accent color for interactive elements within the app, not for browser chrome
   - Dark navy aligns with the guide's recommendation

2. Generate/create app icons (minimal cross + book design)
3. Service worker configuration via next-pwa:
   - Cache static assets (JS, CSS, fonts)
   - Cache API responses (Bible text - long TTL since content is static)
   - Offline fallback page
4. Apple-specific meta tags for iOS PWA support

**Acceptance Criteria:**
- [ ] manifest.json valid (check with PWA validators)
- [ ] Service worker registers on first load
- [ ] App installable on Android (Chrome) and iOS (Safari)
- [ ] Offline mode shows cached content
- [ ] App icon visible on home screen after install
- [ ] Status bar / browser chrome shows dark navy color

**Verification:** Build production, serve locally, test install prompt in Chrome DevTools.

---

#### Task 10.2: Final Polish and Deployment
**File(s):**
- Various files for bug fixes and polish
- `vercel.json` (if needed)

**Work:**
1. Final build check: `npm run build` with zero errors
2. Lighthouse audit: aim for 90+ on Performance, Accessibility, Best Practices, PWA
3. Mobile viewport testing (375px, 390px, 414px widths)
4. Dark mode visual check on all pages
5. Touch target audit (all interactive elements >= 44x44px)
6. Deploy to Vercel
7. Test production URL on actual phone

**Acceptance Criteria:**
- [ ] `npm run build` succeeds with zero errors
- [ ] Zero TypeScript errors (`npx tsc --noEmit`)
- [ ] Lighthouse PWA score passes
- [ ] All 10 routes render correctly
- [ ] Dark mode works on all pages
- [ ] Deployed and accessible on Vercel

**Verification:** Full walkthrough on mobile device:
1. Install PWA
2. Open app
3. Quick jump to "요 3:16"
4. Highlight a verse
5. Bookmark a verse
6. Add a memo
7. Create sermon note
8. Search for a keyword
9. Compare versions
10. Toggle dark mode
11. Change font size
12. Check bookmark list on /notes page

---

## 6. Dependency Graph

```
Phase 1 (Foundation)
  |-- Task 1.1 (Scaffolding) -----> ALL subsequent tasks
  |-- Task 1.2 (Types) -----------> Phase 2, Phase 3
  |-- Task 1.3 (Books metadata) --> Phase 2, Phase 5
  |-- Task 1.4 (Versions/Colors) -> Phase 2, Phase 5

        Phase 2 (API Layer)          Phase 3 (IndexedDB)          Phase 4 (Layout)
          |-- Task 2.1 (Providers)     |-- Task 3.1 (DB + CRUD)     |-- Task 4.1 (Root layout)
          |-- Task 2.2 (Abstraction)   |-- Task 3.2 (DB Hooks)      |-- Task 4.2 (Header)
          |-- Task 2.3 (API Hooks)     |                             |-- Task 4.3 (BottomNav)
          |                             |                             |-- Task 4.4 (UI components)
          +-------- Phase 2 + 3 + 4 ALL needed --------+
                                        |
                         Phase 5 (Reading View) <-- CRITICAL PATH
                           |-- Task 5.1 (Book selection)
                           |-- Task 5.2 (Chapter selection)
                           |-- Task 5.3 (Reading view) *** MOST IMPORTANT ***
                           |-- Task 5.4 (Verse actions)
                           |-- Task 5.5 (Quick jump)
                                        |
                           +-----------+-----------+
                           |           |           |
                        Phase 6     Phase 7     Phase 8
                        (Search)    (Notes)     (Compare)
                           |           |           |
                           +-----------+-----------+
                                        |
                                   Phase 9
                              (Settings + Home)
                                        |
                                   Phase 10
                              (PWA + Deploy)

NOTE: Phase 4 depends ONLY on Phase 1 (not Phase 2 or 3).
      Phase 2, Phase 3, and Phase 4 can ALL run in parallel after Phase 1.
```

### Parallelization Opportunities

| Parallel Group | Tasks | Reason |
|----------------|-------|--------|
| Group A | Phase 2 (API) + Phase 3 (DB) + Phase 4 (Layout) | All three depend only on Phase 1, independent of each other |
| Group B | Task 4.2 (Header) + Task 4.3 (BottomNav) + Task 4.4 (UI components) | Independent components |
| Group C | Task 5.1 (Books) + Task 5.2 (Chapters) | Independent pages |
| Group D | Phase 6 (Search) + Phase 7 (Notes) + Phase 8 (Compare) | Independent features, all depend on Phase 5 |
| Group E | Task 9.1 (Settings) + Task 9.2 (Home) | Independent pages |

---

## 7. Commit Strategy

| Commit | After | Message |
|--------|-------|---------|
| 1 | Task 1.1 | `feat: scaffold Next.js 14 project with TypeScript, Tailwind, PWA config` |
| 2 | Tasks 1.2-1.4 | `feat: add Bible types, 66 books metadata, version definitions, parseReference` |
| 3 | Tasks 2.1-2.2 | `feat: add Bible API abstraction layer with wldeh and helloao providers` |
| 4 | Task 2.3 | `feat: add useBible and useSearch React hooks` |
| 5 | Tasks 3.1-3.2 | `feat: add IndexedDB persistence with Dexie.js and reactive hooks` |
| 6 | Tasks 4.1-4.4 | `feat: add root layout, header, bottom nav, dark mode, UI components` |
| 7 | Tasks 5.1-5.2 | `feat: add book and chapter selection pages` |
| 8 | Tasks 5.3-5.5 | `feat: add Bible reading main view with verse interactions and quick jump` |
| 9 | Task 6.1 | `feat: add Bible search with keyword highlighting and client-side fallback` |
| 10 | Tasks 7.1-7.2 | `feat: add verse memos, sermon notes, and bookmark list` |
| 11 | Task 8.1 | `feat: add multi-version comparison view` |
| 12 | Tasks 9.1-9.2 | `feat: add settings page with export/import and home page with daily verse` |
| 13 | Tasks 10.1-10.2 | `feat: finalize PWA config, polish, and deploy to Vercel` |

---

## 8. Risks and Mitigations

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| 1 | **API response format mismatch** - wldeh or helloao API response structure differs from documentation | HIGH | HIGH | Executor MUST fetch a real sample from each API endpoint first, log the structure, then build parsers. Do NOT assume response format. |
| 2 | **Book ID mapping inconsistency** - Different APIs use different book identifiers | MEDIUM | HIGH | Build comprehensive mapping table. Test with edge cases (1 Samuel, Song of Solomon, Philemon). |
| 3 | **Korean search limitations** - External APIs may not support Korean text search | MEDIUM | MEDIUM | Concrete fallback strategy defined in Task 6.1: cache-based local search -> per-book sequential fetch -> notes search. |
| 4 | **PWA update propagation** - Users stuck on old service worker cache | LOW | MEDIUM | Version service worker cache names. Add "새 버전이 있습니다" notification with refresh button. |
| 5 | **Dark mode FOUC** - Flash of light theme on load before JS executes | MEDIUM | HIGH | Add blocking `<script>` in head that reads localStorage preference and sets dark class before first paint. |
| 6 | **IndexedDB not available** - Safari private browsing or restricted environments | LOW | LOW | Check for IndexedDB availability on load, show warning message if unavailable. |
| 7 | **CDN rate limiting** - jsDelivr or helloao may rate-limit requests | LOW | LOW | Memory cache prevents repeated fetches. Cache fetched chapters aggressively. |
| 8 | **Large font + long verses** - Korean verses with large font may have layout issues | MEDIUM | MEDIUM | Test with longest verses (Esther 8:9) at maximum font size (28px). Ensure text wraps cleanly. |
| 9 | **Noto Serif Korean font loading** - Large font file causes slow initial load | MEDIUM | MEDIUM | Use `font-display: swap`. Preload the font. Consider subsetting. |
| 10 | **next-pwa compatibility** - @ducanh2912/next-pwa may have breaking changes with Next.js 14 | MEDIUM | LOW | Check latest version compatibility. If issues, consider manual service worker setup. |

---

## 9. Success Criteria (From PRD)

- [ ] PWA installable on phone, runs like native app
- [ ] "요 3:16" input shows John 3:16 within 2 seconds
- [ ] Sermon notes writable while viewing Bible text
- [ ] Dark mode works comfortably in church (no glare, OLED-optimized)
- [ ] At least 3 Bible versions readable (KRV + KJV + BSB)
- [ ] All personal data (memos, highlights, bookmarks) persists in browser
- [ ] Bookmark list accessible via /notes page third tab
- [ ] Deployed on Vercel, accessible from anywhere
- [ ] All 10 routes render without TypeScript or runtime errors
- [ ] Touch-friendly UI (all targets >= 44x44px)
- [ ] Cream-colored light theme (#FAFAF5) feels like a real Bible

---

## 10. Execution Notes for Agents

### API Investigation (CRITICAL - Do First in Phase 2)
Before building API providers, the executor MUST:
1. `fetch('https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/krv/books/John/chapters/3.json')` - Check actual response
2. `fetch('https://bible.helloao.org/api/BSB/JHN/3.json')` - Check actual response
3. Log both responses and determine:
   - What is the book ID format for each API?
   - What is the verse structure in the response?
   - Are there any pagination or additional fields?

### Font Configuration
- Use Next.js `next/font/google` for Noto Serif Korean
- Weights: 400 (regular body), 700 (bold headings)
- Display: swap (prevent invisible text during load)

### Dark Mode Implementation Order
1. First: Add blocking script to prevent FOUC
2. Second: Build useDarkMode hook reading from IndexedDB
3. Third: Apply Tailwind dark: classes throughout

### Sermon Note UX Priority
The sermon note feature is the "killer feature" of this app. The 2-panel layout (scripture pinned top, notes scrollable below) must feel natural during a worship service. Test with actual sermon-length usage in mind.

### Testing Approach
Since this is a personal app, formal test suites are not required. However, each phase should end with a manual verification checklist (provided in each task's "Verification" section). The final deployment task (10.2) includes a complete end-to-end walkthrough.
