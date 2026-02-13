'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { QuickJump } from '@/components/bible/QuickJump';
import { useSettings } from '@/hooks/useSettings';
import { getDailyVerse } from '@/lib/utils/dailyVerse';
import { formatReference } from '@/lib/utils/formatReference';
import { getBookById } from '@/lib/constants/books';
import { BookOpen, PenSquare, ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { settings, isLoading } = useSettings();
  const dailyVerse = getDailyVerse();
  const dailyBook = getBookById(dailyVerse.book);
  const dailyRef = formatReference(dailyVerse.book, dailyVerse.chapter, dailyVerse.verse);

  const lastReadBook = settings.lastRead ? getBookById(settings.lastRead.book) : null;

  return (
    <>
      <Header title="나의 성경" />
      <main className="p-4 pb-24 space-y-5 max-w-2xl mx-auto">

        {/* ── Ornament Divider ── */}
        <div className="divider-ornament text-sm font-display pt-2">✦</div>

        {/* ── Daily Verse ── */}
        <section
          onClick={() => {
            if (dailyBook) {
              router.push(`/read/${dailyVerse.book}/${dailyVerse.chapter}?verse=${dailyVerse.verse}`);
            }
          }}
          className="card p-6 cursor-pointer active:scale-[0.98] transition-all hover:shadow-warm-lg"
        >
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest mb-3">
            오늘의 말씀
          </p>
          <p className="text-lg leading-relaxed text-bible-text dark:text-bible-text-dark font-serif italic">
            {dailyVerse.preview}
          </p>
          <p className="text-sm font-display text-bible-accent mt-4 font-medium flex items-center gap-1">
            {dailyRef}
            <ChevronRight size={14} />
          </p>
        </section>

        {/* ── Continue Reading ── */}
        {!isLoading && (
          <section>
            {settings.lastRead && lastReadBook ? (
              <button
                onClick={() => router.push(`/read/${settings.lastRead!.book}/${settings.lastRead!.chapter}`)}
                className="btn-primary w-full flex items-center gap-3 px-5 py-4 rounded-xl"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs text-white/70 font-sans">이어서 읽기</p>
                  <p className="text-sm font-medium font-sans text-white">
                    {lastReadBook.name} {settings.lastRead.chapter}장
                  </p>
                </div>
                <ChevronRight size={18} className="text-white/60" />
              </button>
            ) : (
              <button
                onClick={() => router.push('/books')}
                className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-4"
              >
                <BookOpen size={18} />
                성경 읽기 시작
              </button>
            )}
          </section>
        )}

        {/* ── Quick Jump ── */}
        <section className="card p-4">
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest mb-2">
            빠른 이동
          </p>
          <QuickJump />
        </section>

        {/* ── New Sermon Note ── */}
        <button
          onClick={() => router.push('/notes/sermon/new')}
          className="btn-secondary w-full flex items-center gap-3 px-5 py-4 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-bible-accent/10 flex items-center justify-center flex-shrink-0">
            <PenSquare size={20} className="text-bible-accent" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">새 설교 노트</p>
            <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">설교 내용을 기록하세요</p>
          </div>
          <ChevronRight size={18} className="text-bible-text-secondary dark:text-bible-text-secondary-dark" />
        </button>

      </main>
    </>
  );
}
