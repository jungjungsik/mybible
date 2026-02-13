'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSettings } from '@/hooks/useSettings';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { getKoreanVersions, getEnglishVersions } from '@/lib/constants/versions';
import { BIBLE_BOOKS } from '@/lib/constants/books';
import { db } from '@/lib/db/index';
import { ExportData } from '@/types/bible';
import {
  ChevronDown,
  Download,
  Upload,
  Trash2,
  BookOpen,
  Smartphone,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSetting, isLoading } = useSettings();
  const { isDark, toggleDarkMode } = useDarkMode();
  const progress = useReadingProgress();
  const { canInstall, isInstalled, install } = usePWAInstall();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const koreanVersions = getKoreanVersions();
  const englishVersions = getEnglishVersions();

  // ── Reading stats ──
  const totalChapters = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);
  const otBooks = BIBLE_BOOKS.filter(b => b.testament === 'old');
  const ntBooks = BIBLE_BOOKS.filter(b => b.testament === 'new');
  const otTotal = otBooks.reduce((sum, b) => sum + b.chapters, 0);
  const ntTotal = ntBooks.reduce((sum, b) => sum + b.chapters, 0);

  const readSet = new Set((progress ?? []).map(p => `${p.book}:${p.chapter}`));
  const totalRead = readSet.size;
  const otRead = (progress ?? []).filter(p => otBooks.some(b => b.id === p.book)).length;
  const ntRead = (progress ?? []).filter(p => ntBooks.some(b => b.id === p.book)).length;

  // ── Export ──
  const handleExport = useCallback(async () => {
    const [notes, highlights, bookmarks, readingProgress, settingsRecords] = await Promise.all([
      db.notes.toArray(),
      db.highlights.toArray(),
      db.bookmarks.toArray(),
      db.readingProgress.toArray(),
      db.settings.toArray(),
    ]);

    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes,
      highlights,
      bookmarks,
      readingProgress,
      settings: settingsRecords.map(s => ({ key: s.key, value: s.value })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `bible-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Import ──
  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      if (data.version !== 1) {
        setImportStatus('지원하지 않는 백업 형식입니다.');
        return;
      }

      let imported = 0;

      // Merge notes
      if (data.notes?.length) {
        await db.notes.bulkPut(data.notes);
        imported += data.notes.length;
      }
      // Merge highlights
      if (data.highlights?.length) {
        await db.highlights.bulkPut(data.highlights);
        imported += data.highlights.length;
      }
      // Merge bookmarks
      if (data.bookmarks?.length) {
        await db.bookmarks.bulkPut(data.bookmarks);
        imported += data.bookmarks.length;
      }
      // Merge reading progress
      if (data.readingProgress?.length) {
        await db.readingProgress.bulkPut(data.readingProgress);
        imported += data.readingProgress.length;
      }
      // Merge settings
      if (data.settings?.length) {
        for (const s of data.settings) {
          await db.settings.put({ key: s.key, value: s.value });
        }
        imported += data.settings.length;
      }

      setImportStatus(`${imported}개 항목을 가져왔습니다.`);
    } catch {
      setImportStatus('파일을 읽을 수 없습니다. 올바른 백업 파일인지 확인해주세요.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // ── Reset all data ──
  const handleReset = useCallback(async () => {
    await Promise.all([
      db.notes.clear(),
      db.highlights.clear(),
      db.bookmarks.clear(),
      db.readingProgress.clear(),
      db.settings.clear(),
    ]);
    setShowResetConfirm(false);
  }, []);

  if (isLoading) {
    return (
      <>
        <Header title="설정" />
        <main className="p-4 pb-24">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </main>
      </>
    );
  }

  function ProgressBar({ label, read, total }: { label: string; read: number; total: number }) {
    const pct = total > 0 ? Math.round((read / total) * 100) : 0;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-sans">
          <span className="text-bible-text-secondary dark:text-bible-text-secondary-dark">{label}</span>
          <span className="font-medium text-bible-text dark:text-bible-text-dark">{read.toLocaleString()} / {total.toLocaleString()} 장 ({pct}%)</span>
        </div>
        <div className="w-full h-2 bg-bible-border/50 dark:bg-bible-border-dark/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-bible-accent rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="설정" />
      <main className="p-4 pb-24 space-y-6 max-w-2xl mx-auto">

        {/* ── 1. Bible Version ── */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-sans font-medium text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-wider mb-3">
            성경 버전
          </h2>
          <div className="relative">
            <select
              value={settings.currentVersion}
              onChange={(e) => updateSetting('currentVersion', e.target.value)}
              className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-bible-border dark:border-bible-border-dark bg-bible-surface dark:bg-bible-surface-dark text-sm font-sans focus:outline-none focus:ring-2 focus:ring-bible-accent/50"
            >
              <optgroup label="한국어">
                {koreanVersions.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.shortName})</option>
                ))}
              </optgroup>
              <optgroup label="English">
                {englishVersions.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.shortName})</option>
                ))}
              </optgroup>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bible-text-secondary dark:text-bible-text-secondary-dark" />
          </div>
        </section>

        {/* ── 2. Display Settings ── */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-sans font-medium text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-wider mb-3">
            화면 설정
          </h2>

          {/* Bible verse font size */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">성경 글자 크기</label>
              <span className="text-sm text-bible-accent font-mono">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min={14}
              max={28}
              step={1}
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#C4956A' }}
            />
            <p
              className="text-bible-text-secondary dark:text-bible-text-secondary-dark font-serif leading-relaxed mt-2 p-3 bg-bible-surface dark:bg-bible-surface-dark rounded-xl border border-bible-border/30 dark:border-bible-border-dark/30"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라
            </p>
          </div>

          {/* UI menu font size */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">메뉴 글자 크기</label>
              <span className="text-sm text-bible-accent font-mono">{settings.uiFontSize}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={20}
              step={1}
              value={settings.uiFontSize}
              onChange={(e) => updateSetting('uiFontSize', Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#C4956A' }}
            />
            <div
              className="mt-2 p-3 bg-bible-surface dark:bg-bible-surface-dark rounded-xl border border-bible-border/30 dark:border-bible-border-dark/30 space-y-1"
              style={{ fontSize: `${settings.uiFontSize}px` }}
            >
              <p className="font-sans text-bible-text dark:text-bible-text-dark">메뉴 미리보기</p>
              <p className="font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">설정, 검색, 노트 등</p>
            </div>
          </div>

          {/* Dark mode */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">다크 모드</label>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                isDark ? 'bg-bible-accent' : 'bg-bible-border dark:bg-bible-border-dark'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-warm transition-transform duration-200 ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Speech rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">음성 속도</label>
              <span className="text-sm text-bible-accent font-mono">{settings.speechRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={settings.speechRate}
              onChange={(e) => updateSetting('speechRate', Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#C4956A' }}
            />
            <div className="flex justify-between text-[10px] font-sans text-bible-text-secondary/60 dark:text-bible-text-secondary-dark/60">
              <span>느리게</span>
              <span>보통</span>
              <span>빠르게</span>
            </div>
          </div>
        </section>

        {/* ── 3. Data Management ── */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-sans font-medium text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-wider mb-3">
            데이터 관리
          </h2>

          <div className="space-y-3">
            {/* Export */}
            <button
              onClick={handleExport}
              className="btn-primary w-full flex items-center gap-3 px-4 py-3 justify-center"
            >
              <Download size={18} />
              <span className="font-sans">데이터 내보내기</span>
            </button>

            {/* Import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full flex items-center gap-3 px-4 py-3 justify-center"
            >
              <Upload size={18} className="text-bible-accent" />
              <span className="font-sans">데이터 가져오기</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {importStatus && (
              <p className="text-xs text-center font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark py-1">
                {importStatus}
              </p>
            )}

            {/* Reset */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 text-sm font-sans font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={18} />
              <span>모든 데이터 초기화</span>
            </button>
          </div>
        </section>

        {/* ── 4. Reading Statistics ── */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-sans font-medium text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen size={16} />
            읽기 통계
          </h2>

          <div className="space-y-3">
            <ProgressBar label="전체" read={totalRead} total={totalChapters} />
            <ProgressBar label="구약" read={otRead} total={otTotal} />
            <ProgressBar label="신약" read={ntRead} total={ntTotal} />
          </div>
        </section>

        {/* ── 5. App Info ── */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-sans font-medium text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-wider mb-3">
            앱 정보
          </h2>

          <div className="space-y-2 text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
            {/* PWA Install Button */}
            {canInstall && (
              <button
                onClick={install}
                className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
              >
                <Smartphone size={18} />
                <span>앱 설치하기</span>
              </button>
            )}
            {isInstalled && (
              <div className="flex items-center justify-center gap-2 mb-3 text-xs text-bible-accent font-medium">
                <Smartphone size={14} />
                <span>설치됨</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>버전</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>개발자</span>
              <span className="font-medium text-bible-text dark:text-bible-text-dark">Jungsik Jung</span>
            </div>
            <p className="text-center text-bible-accent font-serif italic py-2">
              하나님의 말씀과 함께
            </p>
            <div className="border-t border-bible-border/50 dark:border-bible-border-dark/50 pt-2 space-y-1 text-xs text-bible-text-secondary/60 dark:text-bible-text-secondary-dark/60">
              <p>Data: wldeh/bible-api (GitHub)</p>
              <p>Data: bible.helloao.org</p>
              <p>BSB: CC BY-SA 4.0</p>
            </div>
          </div>
        </section>

      </main>

      {/* Reset confirmation */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="데이터 초기화"
        message="모든 노트, 하이라이트, 북마크, 읽기 진행 상황이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        confirmText="초기화"
        cancelText="취소"
        destructive
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
