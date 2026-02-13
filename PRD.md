# PRD: 나만의 성경 앱 (My Bible)

> 최종 업데이트: 2026-02-12
> 상태: 확정 — 이 문서를 기준으로 개발 진행

---

## 1. 프로젝트 개요

### 1.1 목적
주일 예배 시 사용하는 **개인용 성경 웹앱(PWA)**을 만든다.
기존 성경 앱에 없는 나만의 기능과 UI를 갖춘 독특한 성경책이 목표다.

### 1.2 핵심 사용 시나리오
1. **예배 중**: 목사님이 본문을 말하면 → 빠르게 구절 검색 → 해당 구절 읽기
2. **설교 중**: 설교 들으면서 → 본문 구절 보면서 → 설교 노트 작성
3. **일상**: 성경 통독, 메모 확인, 말씀 묵상

### 1.3 사용자
- 주 사용자: 본인 (개인용)
- 디바이스: 스마트폰 (주), 태블릿/PC (부)
- 사용 환경: 예배당 (어두운 환경, 모바일 데이터)

---

## 2. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Next.js 14 (App Router)** | React 기반, SSG/SSR, PWA 네이티브 지원 |
| 언어 | **TypeScript** | 타입 안전성, 유지보수 |
| 스타일링 | **Tailwind CSS** | 빠른 UI 개발, 반응형, 다크모드 |
| 로컬 DB | **Dexie.js (IndexedDB)** | 서버 없이 메모/하이라이트/북마크 저장 |
| 앱 형태 | **PWA** | 앱스토어 없이 설치, 배포 비용 $0 |
| 배포 | **Vercel** | Next.js 최적화, 무료 tier |
| 아이콘 | **Lucide React** | 경량, 일관된 디자인 |

### 2.1 서버/백엔드
- **없음**. 서버리스 아키텍처.
- 성경 텍스트: 외부 무료 API에서 fetch
- 개인 데이터(메모, 하이라이트): 브라우저 IndexedDB에 저장
- 운영 비용: **$0**

---

## 3. 성경 데이터 소스

### 3.1 사용 가능한 버전

| 역본 | 언어 | ID | API 소스 | 저작권 |
|------|------|----|----------|--------|
| **개역한글 (KRV)** | 🇰🇷 한글 | krv | wldeh/bible-api | ✅ Public Domain (2012 만료) |
| **King James Version** | 🇺🇸 영어 | kjv | wldeh/bible-api | ✅ Public Domain |
| **Berean Standard Bible** | 🇺🇸 영어 | bsb | bible.helloao.org | ✅ CC BY-SA 4.0 |
| **World English Bible** | 🇺🇸 영어 | web | wldeh/bible-api | ✅ Public Domain |
| **American Standard Version** | 🇺🇸 영어 | asv | wldeh/bible-api | ✅ Public Domain |

### 3.2 API 소스

| API | URL | 용도 | 인증 |
|-----|-----|------|------|
| **wldeh/bible-api** | cdn.jsdelivr.net/gh/wldeh/bible-api | 주 데이터 소스 (KRV, KJV, WEB, ASV) | 불필요 |
| **bible.helloao.org** | bible.helloao.org/api | BSB, 1000+ 번역 | 불필요 |

### 3.3 개역개정 (NKRV) 관련
- 대한성서공회가 저작권 보유 → 무료 API 없음
- 개인 비상업 사용 허가를 별도 요청해야 함
- **MVP에서는 제외**, 추후 허가 받으면 추가
- 대안: 개역한글(KRV)이 개역개정과 약 95% 유사

---

## 4. 기능 명세

### 4.1 기능 우선순위

| 순위 | 기능 | Phase | 중요도 |
|------|------|-------|--------|
| 1 | 예배 중 빠른 구절 찾기 | MVP | ⭐⭐⭐ |
| 2 | 설교 노트/메모 | MVP | ⭐⭐⭐ |
| 3 | 다중 버전 비교 | MVP | ⭐⭐ |
| 4 | 읽기 통계/통독 트래커 | Post-MVP | ⭐ |

### 4.2 MVP 기능 상세

#### F1. 성경 읽기 (핵심)
- 66권 전체 읽기 (구약 39권, 신약 27권)
- 책 → 장 → 절 네비게이션
- 버전 선택 드롭다운 (한글/영어)
- 이전 장/다음 장 이동
- 특정 절로 스크롤 (URL: /read/JHN/3?verse=16)
- 마지막 읽은 위치 자동 저장

#### F2. 빠른 구절 점프 (예배 필수)
- 입력창에 "요 3:16" 입력 → 즉시 이동
- 지원 입력 형식:
  - 한글 약어: "창 1:1", "요 3:16", "롬 8:28"
  - 한글 풀네임: "창세기 1장 1절", "요한복음 3장 16절"
  - 영어: "John 3:16", "Gen 1:1", "JHN 3:16"
- 실시간 유효성 표시

#### F3. 검색
- 성경 텍스트 키워드 검색
- 검색어 하이라이트 표시
- 검색 결과에서 해당 구절로 바로 이동
- 최근 검색어 저장 (최대 10개)

#### F4. 설교 노트
- 전용 작성 UI:
  - 날짜 (기본: 오늘)
  - 설교 제목
  - 본문 구절 입력 → 구절 자동 로드 & 표시
  - 메모 영역 (큰 textarea)
  - 태그 (선택)
- 본문 구절을 보면서 메모하는 2-panel 레이아웃
- 자동 저장 (debounce 2초)
- 설교 노트 목록 (날짜순)

#### F5. 절 메모
- 특정 절 선택 → 메모 작성
- 바텀 시트 UI로 작성
- 해당 절에 메모 아이콘 표시

#### F6. 하이라이트
- 절 선택 → 색상 5가지 (yellow, green, blue, pink, purple)
- 하이라이트된 절은 해당 색상 배경
- 토글 (다시 누르면 해제)

#### F7. 북마크
- 절 단위 북마크
- 북마크 목록 페이지
- 리본 아이콘 표시

#### F8. 버전 비교
- 동일 구절을 최대 4개 버전으로 나란히 비교
- 카드 형태로 각 버전 표시

#### F9. 다크모드
- 밝은 테마 (기본): 배경 #FAFAF5 (크림색)
- 다크 테마: 배경 #000000 (순수 검정, OLED 최적화)
- 원터치 토글
- 예배당에서 눈부심 방지

#### F10. 설정
- 기본 버전 선택
- 폰트 크기 조절 (14px ~ 28px)
- 다크모드 토글
- 데이터 내보내기/가져오기 (JSON)
- 데이터 초기화

### 4.3 Post-MVP 기능

| 기능 | 설명 |
|------|------|
| 오늘의 말씀 | 매일 랜덤 유명 구절 표시 |
| 통독 트래커 | 66권 읽기 진행률 시각화 |
| 교차 참조 | 관련 구절 자동 추천 |
| 오프라인 캐싱 | Service Worker로 성경 텍스트 캐시 |
| 데이터 백업 | JSON 내보내기/가져오기 |

---

## 5. 디자인 가이드

### 5.1 컨셉
**미니멀 + 다크모드 전환** — 실제 종이 성경책의 깔끔함을 디지털로.

### 5.2 타이포그래피
- **본문 폰트**: Noto Serif Korean (세리프, 성경책 느낌)
- **UI 폰트**: system-ui (가볍고 빠름)
- **본문 기본 크기**: 18px
- **줄간격**: 1.8
- **절 번호**: 작고 회색, 상첨자 스타일

### 5.3 컬러 팔레트

| 용도 | Light | Dark |
|------|-------|------|
| 배경 | #FAFAF5 (크림) | #000000 (순수 검정) |
| 본문 텍스트 | #1A1A1A | #E0E0E0 |
| 절 번호 | #999999 | #666666 |
| 액센트 | #8B7355 (우드 브라운) | #8B7355 |
| 하이라이트 Yellow | #FFF9C4 | #3D3800 |
| 하이라이트 Green | #C8E6C9 | #1B3D1C |
| 하이라이트 Blue | #BBDEFB | #0D2B4A |
| 하이라이트 Pink | #F8BBD0 | #4A0D2B |
| 하이라이트 Purple | #E1BEE7 | #2D0D3D |

### 5.4 레이아웃
- **모바일 우선** (max-width: 768px, 중앙 정렬)
- 상단 헤더: 48px (sticky)
- 하단 네비게이션: 64px (fixed)
- 탭 4개: 📖 성경 | 🔍 검색 | 📝 노트 | ⚙️ 설정
- 터치 타겟: 최소 44x44px

### 5.5 특수 UI

#### 절 액션 메뉴 (바텀 시트)
절을 탭하면 나타나는 메뉴:
- 📋 복사
- 🖍️ 하이라이트 (색상 선택)
- 🔖 북마크
- 📝 메모 추가
- 🔄 다른 버전으로 보기

#### 설교 노트 모드
- 상단: 본문 구절 표시 (고정)
- 하단: 메모 작성 영역 (스크롤)
- 예배 중 사용에 최적화된 큰 폰트, 넉넉한 여백

---

## 6. 데이터 모델

### 6.1 IndexedDB 테이블

```
notes        — 메모/설교 노트
highlights   — 하이라이트
bookmarks    — 북마크
readingProgress — 읽기 진행
settings     — 앱 설정 (키-값)
```

### 6.2 스키마

#### Note
```typescript
{
  id: string            // UUID
  type: 'verse' | 'sermon'
  book: string          // "GEN", "JHN"
  chapter: number
  verse?: number        // sermon은 없을 수 있음
  title?: string        // 설교 제목
  content: string       // 메모 내용
  date: string          // ISO date (설교 날짜)
  tags?: string[]
  createdAt: number     // timestamp
  updatedAt: number
}
```

#### Highlight
```typescript
{
  id: string
  book: string
  chapter: number
  verse: number
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  version: string
  createdAt: number
}
```

#### Bookmark
```typescript
{
  id: string
  book: string
  chapter: number
  verse: number
  label?: string
  createdAt: number
}
```

#### ReadingProgress
```typescript
{
  id: string
  book: string
  chapter: number
  completedAt: number
}
```

---

## 7. 페이지 구조 (라우팅)

```
/                          → 홈 (이어서 읽기, 빠른 구절 이동)
/books                     → 성경 책 선택 (구약/신약 탭)
/books/[bookId]            → 장 선택 (숫자 그리드)
/read/[bookId]/[chapter]   → 성경 읽기 메인 뷰 ⭐
/compare                   → 버전 비교
/search                    → 검색
/notes                     → 노트 목록 (설교노트/절메모 탭)
/notes/sermon/new          → 새 설교 노트 작성
/notes/sermon/[id]         → 설교 노트 보기/편집
/settings                  → 설정
/tracker                   → 통독 트래커 (Post-MVP)
```

---

## 8. API 연동 설계

### 8.1 추상화 레이어
```
fetchChapter(versionId, bookId, chapter) → BibleChapter
searchBible(versionId, query) → BibleVerse[]
```
- 버전의 sourceApi 필드에 따라 적절한 프로바이더 자동 선택
- 실패 시 다른 프로바이더로 fallback
- 메모리 캐시 (Map, 최대 100개 장)

### 8.2 Book ID 매핑
- 내부 ID: GEN, EXO, LEV ... REV (대문자 3글자)
- 각 API별 ID 형식이 다를 수 있으므로 매핑 함수 필요

---

## 9. 개발 계획

### Phase 1 — 기반 셋업 (Day 1)
- 프로젝트 생성 (Next.js + TS + Tailwind + PWA)
- 타입 정의
- 성경 66권 메타데이터
- 버전 목록
- API 추상화 레이어
- IndexedDB 설정

### Phase 2 — 핵심 읽기 UI (Day 1~2)
- 레이아웃 & 네비게이션
- 책/장 선택 UI
- **성경 읽기 메인 뷰** (가장 중요)
- 빠른 구절 점프
- 다크모드

### Phase 3 — 예배 기능 (Day 2~3)
- 검색
- 설교 노트
- 절 메모
- 하이라이트
- 북마크
- 버전 비교

### Phase 4 — 마무리 (Day 3)
- 설정 페이지
- PWA 최종 설정
- 오프라인 캐싱
- 배포 (Vercel)

### Phase 5 — Post-MVP (선택)
- 오늘의 말씀
- 통독 트래커
- 교차 참조
- 데이터 내보내기/가져오기

---

## 10. 제약사항 & 리스크

| 리스크 | 대응 |
|--------|------|
| API 응답 형식이 문서와 다를 수 있음 | 실제 응답을 console.log로 확인 후 파싱 로직 조정 |
| wldeh API의 book ID 매핑 불일치 | 매핑 테이블 생성으로 해결 |
| 한글 검색이 외부 API에서 안 될 수 있음 | 로컬 캐시 후 IndexedDB에서 검색 |
| PWA 업데이트 반영 안 됨 | Service Worker 캐시 버전 관리 |
| 개역개정 저작권 | MVP에서 제외, 개역한글로 대체 |
| CDN API rate limit | 메모리 캐시로 중복 요청 방지 |

---

## 11. 성공 기준

- [ ] 폰에 PWA 설치하여 앱처럼 실행 가능
- [ ] "요 3:16" 입력 시 2초 내 해당 구절 표시
- [ ] 설교 노트를 본문 보면서 작성 가능
- [ ] 다크모드에서 예배당 사용 시 눈부심 없음
- [ ] 한글(개역한글) + 영어(KJV, BSB) 최소 3개 버전 읽기 가능
- [ ] 메모/하이라이트 데이터가 브라우저에 안전하게 저장됨
- [ ] Vercel에 배포하여 어디서든 접속 가능

---

## 12. 참고 자료

- wldeh/bible-api: https://github.com/wldeh/bible-api
- bible.helloao.org: https://bible.helloao.org/
- 개역한글 저작권 만료 확인: https://bibleportal.com/version/KRV
- Next.js PWA 가이드 (2025): Next.js 공식 문서 내장 지원
- 실행 프롬프트 가이드: bible-app-claude-code-guide.md
