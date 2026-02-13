# Quick Start Guide - 나의 성경 (My Bible)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
# Navigate to project directory
cd my-bible

# Install dependencies (if not already done)
npm install
```

## Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

**Development mode features:**
- Hot reload on file changes
- PWA disabled (for faster development)
- Source maps enabled

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Open browser to http://localhost:3000
```

**Production mode features:**
- Optimized bundle size
- PWA enabled with service worker
- Static page generation

## Optional: Generate PNG Icons

For better PWA support, generate PNG icons from the SVG:

```bash
# Install sharp (one-time)
npm install --save-dev sharp

# Generate icons
node scripts/generate-icons.js
```

This creates:
- `/public/icons/icon-192.png` (192x192)
- `/public/icons/icon-512.png` (512x512)

## Verification

Check that everything is working:

```bash
# Type checking
npx tsc --noEmit

# Should output: (no errors)

# Lint check
npm run lint

# Build check
npm run build

# Should output: ✓ Compiled successfully
```

## PWA Installation

When running in production:

1. Open the app in a browser (Chrome, Edge, Safari)
2. Look for "Install" prompt in address bar
3. Click to install as PWA
4. App icon appears on home screen/desktop

## Features Overview

### Main Navigation (Bottom Bar)

1. **📖 성경 (Bible)** - Browse and read Bible
2. **🔍 검색 (Search)** - Search verses
3. **🔁 비교 (Compare)** - Compare versions
4. **📝 노트 (Notes)** - View notes and bookmarks
5. **⚙️ 설정 (Settings)** - Preferences

### Reading Bible

1. Tap **성경** tab
2. Select testament (구약 or 신약)
3. Tap a book (e.g., 창세기, 요한복음)
4. Select chapter number
5. Read and interact with verses

### Verse Actions

Tap any verse to:
- 📝 Add note/memo
- 🔖 Bookmark
- 🎨 Highlight (7 colors)

### Creating Notes

**Verse Note:**
1. Tap verse → Add note
2. Enter text
3. Save

**Sermon Note:**
1. Go to **노트** tab
2. Tap **+ 새 설교노트**
3. Fill in title, date, reference, content
4. Add tags (optional)
5. Save

### Quick Navigation

- **Quick Jump**: Tap 🎯 icon in header to jump to any book/chapter
- **Chapter Navigation**: Use ← → buttons to move between chapters
- **Version Selector**: Tap version badge to change Bible version

### Search

1. Go to **검색** tab
2. Enter search term (Korean or English)
3. Select version to search
4. Results show matching verses with context

### Version Comparison

1. Go to **비교** tab
2. Enter reference (e.g., "요한복음 3:16")
3. Select versions to compare
4. View side-by-side

### Settings

Customize:
- **Text Size**: Small / Medium / Large
- **Theme**: Light / Dark / System
- **Default Version**: Set preferred Bible version

## Keyboard Shortcuts

(When Quick Jump is open)
- `ESC` - Close Quick Jump
- `ENTER` - Navigate to selected chapter

## Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Build errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### PWA not installing

- Ensure running in production mode (`npm run build && npm start`)
- Use HTTPS or localhost
- Check browser console for errors
- Verify `manifest.json` and service worker are accessible

### IndexedDB not working

- Check browser permissions
- Clear browser cache and reload
- Ensure not in incognito/private mode

## Offline Usage

After visiting the app once:
- Static assets are cached
- App shell loads offline
- Bible text requires internet (or browser cache)

For full offline support, visit chapters you want to read offline at least once while online.

## Data Management

### Export Notes

1. Go to **노트** tab
2. Tap **내보내기** on any note
3. Copy or share note content

### Clear Data

To reset all local data:
1. Browser DevTools → Application → Storage
2. Clear IndexedDB → `BibleDB`
3. Or clear all site data

## Browser Support

**Recommended:**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

**Required features:**
- IndexedDB
- Service Worker
- ES2020+

## Development Tips

### File Structure

```
src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and API
└── types/         # TypeScript types
```

### API Providers

- Primary: wldeh API (6 versions)
- Fallback: helloao API (개역개정 only)
- Abstraction: `lib/api/bibleApi.ts`

### Database Schema

```typescript
// Verse notes
verses: {
  id: string (auto)
  verseId: string (unique)
  content: string
  note: string
  tags: string[]
  highlightColor: string
  createdAt: Date
  updatedAt: Date
}

// Bookmarks
bookmarks: {
  id: string (auto)
  reference: string
  note: string
  createdAt: Date
  updatedAt: Date
}

// Sermon notes
sermonNotes: {
  id: string (auto)
  title: string
  date: Date
  reference: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

## Support

For issues or questions:
1. Check `IMPLEMENTATION_COMPLETE.md` for technical details
2. Review source code comments
3. Check browser console for errors

---

**Version:** 1.0.0
**Last Updated:** February 13, 2026
**Status:** ✅ Production Ready
