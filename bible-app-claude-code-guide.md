# 🙏 나만의 성경 앱 — Claude Code 실행 가이드

> 이 문서는 Claude Code에서 순서대로 프롬프트를 실행하여 성경 PWA 앱을 만드는 가이드입니다.
> 각 Phase의 프롬프트를 Claude Code에 복붙하여 순서대로 실행하세요.

---

## 사전 준비

```bash
# 작업 디렉토리 생성
mkdir my-bible && cd my-bible
```

---

## Phase 1 — 프로젝트 초기 셋업

### 프롬프트 1-1: 프로젝트 생성

```
Next.js 14 (App Router) + TypeScript + Tailwind CSS 프로젝트를 생성해줘.

프로젝트 이름: my-bible

추가 설치할 패키지:
- dexie (IndexedDB ORM)
- dexie-react-hooks
- next-pwa (또는 @ducanh2912/next-pwa)
- lucide-react (아이콘)
- clsx (className 유틸)

PWA 설정도 함께 해줘:
- manifest.json 생성 (앱 이름: "나의 성경", 테마 컬러: #1a1a2e)
- next.config.js에 PWA 설정 추가
- 오프라인 캐싱 기본 설정

tsconfig.json에 path alias 설정:
- @/components → src/components
- @/lib → src/lib
- @/hooks → src/hooks
- @/types → src/types

Tailwind에 다크모드 설정 추가 (class 방식)
기본 폰트: Noto Serif Korean (Google Fonts)
```

### 프롬프트 1-2: 타입 정의

```
src/types/bible.ts 파일을 만들어줘.

다음 타입들을 정의해:

1. BibleVersion - 성경 버전 정보
   - id: string (예: "krv", "kjv", "bsb")
   - name: string (예: "개역한글", "King James Version")
   - shortName: string (예: "개역한글", "KJV")
   - language: 'ko' | 'en'
   - sourceApi: 'wldeh' | 'helloao' | 'apiBible' | 'local'

2. BibleBook - 성경 책 정보
   - id: string (예: "GEN", "EXO")
   - name: string (한글명)
   - englishName: string
   - shortName: string (약어, 예: "창", "출")
   - testament: 'old' | 'new'
   - chapters: number (총 장 수)
   - order: number (순서)

3. BibleVerse - 절 데이터
   - book: string
   - chapter: number
   - verse: number
   - text: string
   - version: string

4. BibleChapter - 장 데이터
   - book: string
   - chapter: number
   - verses: BibleVerse[]
   - version: string

5. Note - 메모/설교 노트
   - id: string
   - type: 'verse' | 'sermon'
   - book: string
   - chapter: number
   - verse?: number
   - title?: string (설교 제목)
   - content: string
   - date: string (ISO date)
   - tags?: string[]
   - createdAt: number
   - updatedAt: number

6. Highlight - 하이라이트
   - id: string
   - book: string
   - chapter: number
   - verse: number
   - color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
   - version: string
   - createdAt: number

7. Bookmark - 북마크
   - id: string
   - book: string
   - chapter: number
   - verse: number
   - label?: string
   - createdAt: number

8. ReadingProgress - 읽기 진행
   - id: string
   - book: string
   - chapter: number
   - completedAt: number

모든 타입에 export 붙여줘.
```

### 프롬프트 1-3: 성경 메타데이터 (66권)

```
src/lib/constants/books.ts 파일을 만들어줘.

성경 66권의 메타데이터 배열을 만들어. BibleBook 타입을 사용해.

각 책에 대해:
- id: 영어 약어 대문자 (GEN, EXO, LEV, NUM, DEU, JOS, JDG, RUT, 1SA, 2SA, 1KI, 2KI, 1CH, 2CH, EZR, NEH, EST, JOB, PSA, PRO, ECC, SNG, ISA, JER, LAM, EZK, DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB, ZEP, HAG, ZEC, MAL, MAT, MRK, LUK, JHN, ACT, ROM, 1CO, 2CO, GAL, EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM, HEB, JAS, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, REV)
- name: 한글 이름 (창세기, 출애굽기 등)
- englishName: 영어 이름 (Genesis, Exodus 등)
- shortName: 한글 약어 (창, 출, 레, 민, 신...)
- testament: 'old' 또는 'new'
- chapters: 각 책의 총 장 수 (정확하게!)
- order: 1~66

또한 아래 유틸 함수들도 만들어줘:
- getBookById(id: string): BibleBook | undefined
- getBookByShortName(shortName: string): BibleBook | undefined  
- getOldTestament(): BibleBook[]
- getNewTestament(): BibleBook[]
- parseReference(input: string): { book: string; chapter: number; verse?: number } | null
  → "요 3:16", "요한복음 3장 16절", "John 3:16", "JHN 3:16" 등을 파싱

parseReference가 중요해. 한글 약어(창, 출, 레, 민...), 한글 풀네임(창세기, 출애굽기...), 영어 약어(Gen, Exo...), 영어 풀네임(Genesis, Exodus...) 모두 지원해야 해. 다양한 입력 형식 지원:
- "창 1:1" → { book: "GEN", chapter: 1, verse: 1 }
- "요한복음 3장 16절" → { book: "JHN", chapter: 3, verse: 16 }
- "John 3:16" → { book: "JHN", chapter: 3, verse: 16 }
- "롬 8" → { book: "ROM", chapter: 8 }
```

### 프롬프트 1-4: 성경 버전 목록

```
src/lib/constants/versions.ts 파일을 만들어줘.

BibleVersion 타입을 사용해서 지원 버전 목록을 만들어:

한글:
- { id: "krv", name: "개역한글", shortName: "개역한글", language: "ko", sourceApi: "wldeh" }

영어:
- { id: "kjv", name: "King James Version", shortName: "KJV", language: "en", sourceApi: "wldeh" }
- { id: "bsb", name: "Berean Standard Bible", shortName: "BSB", language: "en", sourceApi: "helloao" }
- { id: "web", name: "World English Bible", shortName: "WEB", language: "en", sourceApi: "wldeh" }
- { id: "asv", name: "American Standard Version", shortName: "ASV", language: "en", sourceApi: "wldeh" }

유틸 함수:
- getVersionById(id: string): BibleVersion | undefined
- getKoreanVersions(): BibleVersion[]
- getEnglishVersions(): BibleVersion[]
- getAllVersions(): BibleVersion[]
```

---

## Phase 2 — API 연동 레이어

### 프롬프트 2-1: API 추상화 레이어

```
src/lib/api/bibleApi.ts를 만들어줘.

여러 성경 API를 통합하는 추상화 레이어야.

핵심 인터페이스:
interface BibleApiProvider {
  getChapter(versionId: string, bookId: string, chapter: number): Promise<BibleChapter>;
  searchVerses(versionId: string, query: string): Promise<BibleVerse[]>;
}

구현할 API 프로바이더:
1. WldehApiProvider - wldeh/bible-api (jsDelivr CDN)
2. HelloaoApiProvider - bible.helloao.org

메인 함수 (팩토리 패턴):
- fetchChapter(versionId: string, bookId: string, chapter: number): Promise<BibleChapter>
  → 버전의 sourceApi에 따라 적절한 프로바이더를 선택해서 호출
  → 에러 시 다른 프로바이더로 fallback
  → 결과를 메모리 캐시에 저장 (Map 사용)

- searchBible(versionId: string, query: string): Promise<BibleVerse[]>

에러 처리:
- API 호출 실패 시 retry 1회
- 모든 프로바이더 실패 시 사용자에게 에러 메시지
- AbortController로 요청 취소 지원

캐싱:
- 메모리 캐시 (Map) 사용
- 키: `${versionId}:${bookId}:${chapter}`
- 최대 100개 장까지 캐시 (LRU 방식은 아니어도 됨, 오래된 것부터 삭제)

중요: 각 API의 실제 엔드포인트와 응답 형식을 정확히 맞춰서 구현해줘.

wldeh/bible-api 엔드포인트:
- 버전 목록: https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json
- 장 데이터: https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/{version}/books/{book}/chapters/{chapter}.json
- 절 데이터: https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/{version}/books/{book}/chapters/{chapter}/verses/{verse}.json

bible.helloao.org 엔드포인트:
- 번역 목록: https://bible.helloao.org/api/available_translations.json
- 책 목록: https://bible.helloao.org/api/{version}/books.json
- 장 데이터: https://bible.helloao.org/api/{version}/{book}/{chapter}.json

주의: 각 API의 book ID 형식이 다를 수 있어. 우리 내부 ID (GEN, EXO...)를 각 API의 형식으로 변환하는 매핑 함수도 만들어줘.
```

### 프롬프트 2-2: React Hook - useBible

```
src/hooks/useBible.ts를 만들어줘.

성경 데이터를 가져오는 커스텀 훅이야.

useBible 훅:
- Parameters: versionId, bookId, chapter
- Returns:
  - data: BibleChapter | null
  - isLoading: boolean
  - error: string | null
  - refetch: () => void

내부적으로:
- useEffect로 파라미터 변경 시 fetchChapter 호출
- AbortController로 이전 요청 취소 (race condition 방지)
- 로딩/에러 상태 관리

useSearch 훅도 만들어줘:
- Parameters: versionId, query, enabled (boolean)
- Returns:
  - results: BibleVerse[]
  - isSearching: boolean
  - error: string | null

debounce 300ms 적용해서 타이핑마다 검색하지 않도록.
```

---

## Phase 3 — IndexedDB (로컬 스토리지)

### 프롬프트 3-1: Dexie DB 설정

```
src/lib/db/index.ts를 만들어줘.

Dexie를 사용한 IndexedDB 설정이야.

DB 이름: 'MyBibleDB'
버전: 1

테이블:
1. notes: '++id, type, book, chapter, verse, date, createdAt'
2. highlights: '++id, book, chapter, verse, version, createdAt'
3. bookmarks: '++id, book, chapter, verse, createdAt'
4. readingProgress: '++id, book, chapter, completedAt'
5. settings: 'key' (키-값 저장소)

각 테이블에 대한 CRUD 함수를 별도 파일로 만들어줘:

src/lib/db/notes.ts:
- addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
- updateNote(id: string, updates: Partial<Note>): Promise<void>
- deleteNote(id: string): Promise<void>
- getNotesByChapter(book: string, chapter: number): Promise<Note[]>
- getNotesByVerse(book: string, chapter: number, verse: number): Promise<Note[]>
- getSermonNotes(): Promise<Note[]> (type === 'sermon', 최신순)
- getAllNotes(): Promise<Note[]>
- searchNotes(query: string): Promise<Note[]>

src/lib/db/highlights.ts:
- addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<string>
- removeHighlight(id: string): Promise<void>
- getHighlightsByChapter(book: string, chapter: number): Promise<Highlight[]>
- getHighlightByVerse(book: string, chapter: number, verse: number): Promise<Highlight | undefined>

src/lib/db/bookmarks.ts:
- addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<string>
- removeBookmark(id: string): Promise<void>
- getAllBookmarks(): Promise<Bookmark[]>
- isBookmarked(book: string, chapter: number, verse: number): Promise<boolean>

src/lib/db/settings.ts:
- getSetting<T>(key: string, defaultValue: T): Promise<T>
- setSetting<T>(key: string, value: T): Promise<void>
- 주요 설정 키: 'currentVersion', 'fontSize', 'darkMode', 'lastRead'

src/lib/db/readingProgress.ts:
- markChapterRead(book: string, chapter: number): Promise<void>
- getReadingProgress(): Promise<ReadingProgress[]>
- getBookProgress(book: string): Promise<{ read: number; total: number }>
```

### 프롬프트 3-2: React Hooks for DB

```
다음 커스텀 훅 파일들을 만들어줘. dexie-react-hooks의 useLiveQuery를 활용해서 실시간 반응형으로.

src/hooks/useNotes.ts:
- useNotes(book: string, chapter: number) → 해당 장의 메모들 (실시간)
- useVerseNotes(book: string, chapter: number, verse: number) → 해당 절의 메모들
- useSermonNotes() → 설교 노트 목록 (최신순)
- useAddNote() → { addNote, isAdding } 반환
- useDeleteNote() → { deleteNote }

src/hooks/useHighlights.ts:
- useHighlights(book: string, chapter: number) → 해당 장의 하이라이트들
- useToggleHighlight() → { toggleHighlight } (있으면 삭제, 없으면 추가)

src/hooks/useBookmarks.ts:
- useBookmarks() → 전체 북마크 목록
- useToggleBookmark() → { toggleBookmark, isBookmarked }

src/hooks/useSettings.ts:
- useSettings() → { settings, updateSetting }
- settings 타입: { currentVersion: string, fontSize: number, darkMode: boolean, lastRead: { book: string, chapter: number } }
```

---

## Phase 4 — UI 컴포넌트

### 프롬프트 4-1: 레이아웃 & 네비게이션

```
앱의 기본 레이아웃과 네비게이션을 만들어줘.

디자인 컨셉:
- 미니멀, 깔끔한 성경책 느낌
- 기본 밝은 테마 (배경: #FAFAF5, 크림색 느낌)
- 다크모드 (배경: #000000, 순수 검정 - OLED 최적화)
- 본문 폰트: Noto Serif Korean (세리프, 성경책 느낌)
- UI 폰트: Pretendard 또는 system-ui

1. src/app/layout.tsx
   - HTML lang="ko"
   - Google Fonts: Noto Serif Korean (400, 700)
   - 다크모드 클래스 적용 (html 태그에)
   - 메타 태그 (viewport, theme-color, apple-mobile-web-app-capable 등)
   - 전체 max-width: 768px, 중앙 정렬 (모바일 우선)

2. src/components/layout/Header.tsx
   - 좌측: 뒤로가기 버튼 (있을 때만)
   - 중앙: 현재 위치 (예: "요한복음 3장")
   - 우측: 검색 버튼, 설정 버튼
   - 높이: 48px, 고정 (sticky top)
   - 심플하고 얇은 디자인

3. src/components/layout/BottomNav.tsx
   - 모바일 하단 탭 네비게이션 (fixed bottom)
   - 탭 4개:
     - 📖 성경 (홈/읽기)
     - 🔍 검색
     - 📝 노트
     - ⚙️ 설정
   - 현재 탭 강조 표시
   - 높이: 64px
   - lucide-react 아이콘 사용

4. src/app/page.tsx (홈)
   - 상단: "오늘의 말씀" (랜덤 구절 1개 표시)
   - "이어서 읽기" 버튼 (마지막 읽은 위치로 이동)
   - 하단: 빠른 구절 이동 입력창 (QuickJump)
   - 최근 읽은 장 목록 (최대 5개)

5. src/components/bible/QuickJump.tsx
   - 입력창: placeholder "구절 입력 (예: 요 3:16)"
   - 입력하면 parseReference로 파싱
   - 유효한 구절이면 해당 페이지로 router.push
   - 실시간 유효성 표시

다크모드 토글은 헤더 우측에 작은 아이콘으로.

모든 컴포넌트에 'use client' 필요한 곳에만 붙여줘.
Tailwind 클래스만 사용하고, 인라인 스타일은 지양해줘.
```

### 프롬프트 4-2: 성경 책/장 선택 UI

```
성경 책과 장을 선택하는 UI를 만들어줘.

1. src/app/books/page.tsx - 성경 책 선택 페이지
   - 상단 탭: "구약" | "신약" 전환
   - 그리드 레이아웃 (4열, 모바일 3열)
   - 각 책: 한글 약어 표시 (창, 출, 레...)
   - 탭하면 장 선택으로 이동
   - 현재 읽고 있는 책 강조 표시

2. src/app/books/[bookId]/page.tsx - 장 선택 페이지
   - 상단: 책 이름 (예: "창세기")
   - 숫자 그리드 (6열)로 장 번호 나열
   - 읽은 장은 체크마크 또는 색상 표시
   - 탭하면 해당 장 읽기 페이지로 이동

디자인:
- 그리드 아이템: 둥근 사각형 (rounded-lg)
- 크기: 터치하기 편하게 최소 44x44px
- 호버/액티브 효과
- 다크모드 대응
```

### 프롬프트 4-3: 성경 읽기 메인 뷰 (가장 중요!)

```
성경을 읽는 메인 뷰를 만들어줘. 이것이 앱의 핵심이야.

1. src/app/read/[bookId]/[chapter]/page.tsx
   - URL: /read/JHN/3 (요한복음 3장)
   - useBible 훅으로 데이터 로드
   - useHighlights, useBookmarks 훅 사용
   - 로딩 시 스켈레톤 UI 표시

2. src/components/bible/ChapterView.tsx
   - props: chapter (BibleChapter), highlights, bookmarks
   - 각 절을 VerseDisplay 컴포넌트로 렌더링
   - 상단에 버전 선택 드롭다운
   - 절 번호 + 본문 형식
   - 스크롤 가능한 본문 영역

3. src/components/bible/VerseDisplay.tsx
   - props: verse (BibleVerse), isHighlighted, highlightColor, isBookmarked, onLongPress, onTap
   - 절 번호는 작고 회색으로 (상첨자 스타일)
   - 하이라이트된 절은 해당 색상 배경
   - 북마크된 절은 우측에 작은 리본 아이콘
   - 길게 누르면(또는 탭하면) 액션 메뉴 표시

4. src/components/bible/VerseActionMenu.tsx
   - 절을 선택하면 나타나는 팝업 메뉴
   - 액션들:
     - 📋 복사 (절 텍스트 + 출처)
     - 🖍️ 하이라이트 (색상 5개 선택)
     - 🔖 북마크
     - 📝 메모 추가
     - 🔄 다른 버전으로 보기
   - 바텀 시트 스타일 (모바일 친화적)

5. src/components/bible/ChapterNavigation.tsx
   - 이전 장 / 다음 장 네비게이션
   - 스와이프 제스처로도 이동 가능하면 좋지만, 버튼만으로도 OK
   - 하단에 "< 2장 | 요한복음 3장 | 4장 >" 형태

6. src/components/bible/VersionSelector.tsx
   - 현재 버전 표시 + 드롭다운
   - 한글/영어 그룹으로 나뉨
   - 선택하면 같은 장을 해당 버전으로 로드

중요한 UX 사항:
- 본문 폰트 크기: 설정에서 조절 가능 (기본 18px)
- 줄간격: 1.8 (넉넉하게)
- 절 간격: 약간의 margin-bottom
- 스크롤 위치 기억 (같은 장 재방문 시)
- 특정 절로 스크롤 (/read/JHN/3?verse=16 → 16절로 자동 스크롤)
- URL 쿼리로 verse 지정 시 해당 절 하이라이트 효과 (2초간 pulse)
```

### 프롬프트 4-4: 버전 비교 뷰

```
동일 구절을 여러 버전으로 비교하는 뷰를 만들어줘.

src/components/bible/VersionCompare.tsx:
- 특정 절을 선택하면 "다른 버전으로 보기"에서 진입
- 또는 별도 /compare 페이지에서 구절 입력 후 비교

표시 방식:
- 구절 정보: "요한복음 3:16" (상단 고정)
- 각 버전별로 카드 형태로 나열:
  [개역한글]
  하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...
  
  [KJV]
  For God so loved the world, that he gave his only begotten Son...
  
  [BSB]
  For God so loved the world that He gave His one and only Son...

- 버전 추가/제거 가능
- 기본: 현재 선택된 버전 + 1개 추가
- 최대 4개 동시 비교

src/app/compare/page.tsx:
- QuickJump 입력으로 구절 지정
- 비교할 버전 체크박스 선택
- 결과를 VersionCompare로 표시
```

---

## Phase 5 — 검색 & 빠른 이동

### 프롬프트 5-1: 검색 기능

```
성경 검색 기능을 만들어줘.

src/app/search/page.tsx:
- 상단: 검색 입력창 (자동 포커스)
- 검색 타입 2가지:
  1. 구절 바로가기: "요 3:16" 같은 패턴 감지 → 바로 해당 구절로 이동
  2. 텍스트 검색: 일반 텍스트 → API 검색 또는 로컬 검색

- 검색 결과:
  - 각 결과: 출처 (요한복음 3:16) + 본문 미리보기 (검색어 하이라이트)
  - 탭하면 해당 절로 이동

- 검색 버전 선택 (현재 선택된 버전)
- 최근 검색어 저장 (최대 10개, localStorage)
- 검색 결과 없을 때 안내 메시지

src/components/search/SearchResult.tsx:
- 개별 검색 결과 카드
- 책 이름 + 장:절
- 본문 일부 (검색어 볼드 처리)
- 탭하면 해당 위치로 이동

UX:
- 구절 패턴 감지 시 상단에 "요한복음 3장 16절로 이동" 바로가기 표시
- 디바운스 300ms
- 로딩 스피너
```

---

## Phase 6 — 메모 & 설교 노트

### 프롬프트 6-1: 메모 시스템

```
메모와 설교 노트 시스템을 만들어줘.

1. src/components/notes/VerseNoteEditor.tsx
   - 절 메모 작성/편집
   - 바텀 시트 형태로 올라옴
   - 입력: 메모 내용 (textarea)
   - 해당 구절 표시
   - 저장/취소 버튼
   - 기존 메모가 있으면 수정 모드

2. src/components/notes/SermonNoteEditor.tsx
   - 설교 노트 전용 뷰 (별도 페이지)
   - 입력 필드:
     - 날짜 (기본: 오늘, date picker)
     - 설교 제목
     - 본문 구절 입력 (QuickJump 활용) → 입력하면 해당 구절 자동 로드 표시
     - 메모 내용 (큰 textarea)
     - 태그 (선택사항)
   - 본문 구절이 상단에 표시되어 참조하면서 메모 가능
   - 자동 저장 (debounce 2초)

3. src/app/notes/page.tsx - 노트 목록
   - 탭: "설교 노트" | "절 메모" 전환
   - 설교 노트: 날짜순 카드 리스트
     - 각 카드: 날짜, 설교 제목, 본문 구절, 메모 미리보기
   - 절 메모: 성경순 또는 날짜순
     - 각 항목: 출처(요 3:16), 메모 미리보기
   - 검색 기능 (메모 내용 검색)
   - 삭제 (스와이프 또는 길게 누르기)

4. src/app/notes/sermon/new/page.tsx - 새 설교 노트 작성
   - SermonNoteEditor 사용
   - 예배 중 사용하기 편한 UI (큰 폰트, 넉넉한 여백)

5. src/app/notes/sermon/[id]/page.tsx - 설교 노트 보기/편집
   - 기존 노트 로드
   - 편집 모드 전환 가능

설교 노트가 이 앱의 킬러 기능이야. 주일 예배 때:
1. "새 설교 노트" 탭
2. 본문 구절 입력 → 성경 구절이 상단에 표시
3. 설교 들으면서 아래에 메모
이 플로우가 매끄럽게 되어야 해.
```

---

## Phase 7 — 설정 & 마무리

### 프롬프트 7-1: 설정 페이지

```
설정 페이지를 만들어줘.

src/app/settings/page.tsx:

설정 항목들:
1. 성경 버전
   - 기본 버전 선택 (한글/영어 드롭다운)
   
2. 화면 설정
   - 폰트 크기 (14px ~ 28px, 슬라이더)
   - 다크모드 토글
   - 미리보기 (실시간으로 변경사항 반영)

3. 데이터 관리
   - 메모 내보내기 (JSON 파일 다운로드)
   - 메모 가져오기 (JSON 파일 업로드)
   - 모든 데이터 초기화 (확인 다이얼로그 필수)

4. 읽기 통계
   - 총 읽은 장 수 / 전체 (예: 245/1189)
   - 프로그레스 바
   - 구약/신약 별도 표시

5. 앱 정보
   - 버전
   - "♥ 하나님의 말씀과 함께" 같은 문구
   - 사용된 API 출처 크레딧

모든 설정은 IndexedDB settings 테이블에 저장.
변경 시 즉시 반영.
```

### 프롬프트 7-2: 다크모드 시스템

```
다크모드 시스템을 전체적으로 정리해줘.

src/hooks/useDarkMode.ts:
- 설정에서 값 읽어옴
- html 태그에 'dark' 클래스 토글
- 시스템 테마 변경 감지 (prefers-color-scheme)
- 토글 함수 제공

tailwind.config.ts에 커스텀 색상 추가:
- bible-bg: light #FAFAF5 / dark #000000
- bible-text: light #1a1a1a / dark #e0e0e0
- bible-accent: #8B7355 (우드 브라운)
- bible-verse-num: light #999 / dark #666
- bible-highlight-yellow: light #FFF9C4 / dark #3D3800
- bible-highlight-green: light #C8E6C9 / dark #1B3D1C
- bible-highlight-blue: light #BBDEFB / dark #0D2B4A
- bible-highlight-pink: light #F8BBD0 / dark #4A0D2B
- bible-highlight-purple: light #E1BEE7 / dark #2D0D3D

layout.tsx에서 useDarkMode 훅을 Provider로 감싸서 전체 앱에 적용.
```

### 프롬프트 7-3: PWA 최종 설정 & 배포 준비

```
PWA 최종 설정과 배포 준비를 해줘.

1. public/manifest.json 업데이트:
   - name: "나의 성경"
   - short_name: "성경"
   - description: "나만의 성경 앱"
   - theme_color: "#1a1a2e"
   - background_color: "#FAFAF5"
   - display: "standalone"
   - orientation: "portrait"
   - start_url: "/"
   - icons: 여러 사이즈 (192x192, 512x512)

2. Service Worker 설정:
   - 정적 자산 캐싱 (JS, CSS, 폰트)
   - API 응답 캐싱 (성경 텍스트 - 변하지 않으므로 오래 캐시)
   - 오프라인 시 캐시된 데이터 제공
   - 오프라인 fallback 페이지

3. public/icons/ 생성:
   - 간단한 SVG 아이콘 생성 (십자가 + 책 모양, 미니멀)
   - favicon.ico

4. SEO & 메타 태그:
   - Open Graph 태그
   - apple-touch-icon
   - apple-mobile-web-app-status-bar-style: "black-translucent"

5. Vercel 배포 설정:
   - vercel.json (있으면)
   - 환경변수 없음 (API 키 불필요)
   - 그냥 `vercel deploy`로 배포 가능하게

6. README.md 작성:
   - 프로젝트 설명
   - 기능 목록
   - 로컬 개발 방법
   - 배포 방법
```

---

## Phase 8 (선택) — 고급 기능

### 프롬프트 8-1: 오늘의 말씀

```
오늘의 말씀 기능을 만들어줘.

src/lib/dailyVerse.ts:
- 유명한 성경 구절 100개 목록 (하드코딩)
  - 각 항목: { book, chapter, verse, preview } (한글 미리보기 텍스트)
- getDailyVerse(): 날짜 기반으로 하루에 하나씩 돌아가며 선택 (seed = 날짜)
- 같은 날에는 항상 같은 구절 반환

홈 페이지에 표시:
- 카드 형태
- "오늘의 말씀" 타이틀
- 구절 텍스트 (API에서 가져옴)
- 출처 (요한복음 3:16)
- 공유 버튼 (Web Share API)
```

### 프롬프트 8-2: 읽기 통독 트래커

```
성경 통독 트래커를 만들어줘.

src/app/tracker/page.tsx:
- 전체 진행률 (원형 프로그레스)
- 구약/신약 별도 진행률
- 66권 책 목록 (그리드)
  - 각 책: 이름 + 진행률 바 (읽은 장 / 전체 장)
  - 완독한 책은 체크 표시
- 통독 시작일 / 현재까지 일수
- 일일 평균 장수

읽기 페이지에서 장을 끝까지 스크롤하면 "이 장을 읽음으로 표시" 버튼 표시.
자동으로 readingProgress에 기록.
```

---

## 실행 순서 요약

| 순서 | Phase | 예상 시간 | 설명 |
|------|-------|----------|------|
| 1 | 1-1 | 5분 | 프로젝트 생성 |
| 2 | 1-2 | 5분 | 타입 정의 |
| 3 | 1-3 | 10분 | 성경 66권 메타데이터 |
| 4 | 1-4 | 3분 | 버전 목록 |
| 5 | 2-1 | 15분 | API 레이어 |
| 6 | 2-2 | 5분 | useBible 훅 |
| 7 | 3-1 | 10분 | IndexedDB 설정 |
| 8 | 3-2 | 10분 | DB 훅들 |
| 9 | 4-1 | 15분 | 레이아웃 & 네비게이션 |
| 10 | 4-2 | 10분 | 책/장 선택 UI |
| 11 | 4-3 | 20분 | 성경 읽기 메인 뷰 ⭐ |
| 12 | 4-4 | 10분 | 버전 비교 |
| 13 | 5-1 | 10분 | 검색 |
| 14 | 6-1 | 20분 | 메모 & 설교 노트 |
| 15 | 7-1 | 10분 | 설정 |
| 16 | 7-2 | 5분 | 다크모드 |
| 17 | 7-3 | 10분 | PWA & 배포 |

**총 예상 시간: 약 3~4시간** (Claude Code 실행 기준)

---

## 트러블슈팅 팁

1. **API 응답 형식이 예상과 다를 때**: 각 API의 실제 응답을 console.log로 찍어보고, 파싱 로직을 조정하세요.

2. **wldeh/bible-api의 book ID 매핑**: API마다 book ID가 다를 수 있습니다 (예: "Genesis" vs "GEN" vs "gen"). 매핑 테이블을 만들어 해결하세요.

3. **IndexedDB 스키마 변경**: Dexie 버전을 올리고 마이그레이션 코드를 추가하세요.

4. **PWA가 업데이트 안 될 때**: Service Worker 캐시를 버전으로 관리하세요. 캐시 이름에 버전을 포함 (예: 'bible-v1.0.1').

5. **다크모드 깜빡임**: layout.tsx에서 초기 렌더 전에 로컬스토리지/IndexedDB에서 설정을 읽어 적용하세요. script 태그로 blocking 처리.

6. **한글 검색이 안 될 때**: wldeh API는 검색이 안 될 수 있습니다. 이 경우 helloao API의 검색을 활용하거나, 로컬에 성경 전체를 캐시한 후 IndexedDB에서 검색하세요.

---

## 사용할 수 있는 무료 성경 버전 정리

### 확실히 무료 (Public Domain / 자유 라이선스)
- 🇰🇷 개역한글 (KRV) — 2012년 저작권 만료
- 🇺🇸 KJV — Public Domain
- 🇺🇸 ASV — Public Domain  
- 🇺🇸 WEB — Public Domain
- 🇺🇸 BSB — CC BY-SA 4.0 (출처 표시 필요)

### 저작권 있음 (무료 API로 접근 가능하나 제한)
- 🇰🇷 개역개정 (NKRV) — 대한성서공회 저작권
- 🇺🇸 NIV — Biblica 저작권
- 🇺🇸 ESV — Crossway (비상업 API 무료)
- 🇺🇸 NASB — Lockman Foundation 저작권
