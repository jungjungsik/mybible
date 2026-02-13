'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BibleVerse } from '@/types/bible';

interface UseTTSOptions {
  lang: string; // 'ko' or 'en'
  rate?: number; // speech rate, default 1.0
}

interface UseTTSResult {
  isPlaying: boolean;
  currentVerseIndex: number | null;
  play: (verses: BibleVerse[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

// Split Korean text at natural break points for better 띄어읽기
function splitKoreanForSpeech(text: string): string[] {
  // Split at sentence-ending punctuation, commas, and Korean connectors
  const segments = text
    .split(/(?<=[.!?])\s+|(?<=,)\s+|(?<=\u3002)\s*|(?<=\uff0c)\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // If no splits happened, try splitting at common Korean particles/connectors
  if (segments.length <= 1 && text.length > 30) {
    const koreanSplit = text
      .split(/(?<=하고|하며|하여|하니|하면|이요|니라|도다|리라|리니|이니|더라|더니|라 |니 |며 |고 |여 |면 )\s*/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (koreanSplit.length > 1) return koreanSplit;
  }

  return segments;
}

export function useTTS({ lang, rate = 1.0 }: UseTTSOptions): UseTTSResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const versesRef = useRef<BibleVerse[]>([]);
  const indexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speakSegments = useCallback((segments: string[], segIndex: number, verseIndex: number, onDone: () => void) => {
    if (!isSupported || segIndex >= segments.length || !isPlayingRef.current) {
      onDone();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segments[segIndex]);
    utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = lang === 'ko' ? Math.min(rate, 0.95) : rate;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang === 'ko' ? 'ko' : 'en';
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        // Add a small pause between segments for natural 띄어읽기
        const pauseMs = lang === 'ko' ? 250 : 100;
        setTimeout(() => speakSegments(segments, segIndex + 1, verseIndex, onDone), pauseMs);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && isPlayingRef.current) {
        speakSegments(segments, segIndex + 1, verseIndex, onDone);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, lang, rate]);

  const speakVerse = useCallback((index: number) => {
    if (!isSupported || index >= versesRef.current.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentVerseIndex(null);
      return;
    }

    const verse = versesRef.current[index];
    setCurrentVerseIndex(index);
    indexRef.current = index;

    // For Korean, split text at natural break points for better 띄어읽기
    const segments = lang === 'ko' ? splitKoreanForSpeech(verse.text) : [verse.text];

    speakSegments(segments, 0, index, () => {
      if (isPlayingRef.current) {
        // Pause between verses
        setTimeout(() => speakVerse(index + 1), lang === 'ko' ? 400 : 200);
      }
    });
  }, [isSupported, lang, speakSegments]);

  const play = useCallback((verses: BibleVerse[], startIndex = 0) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    versesRef.current = verses;
    setIsPlaying(true);
    isPlayingRef.current = true;
    speakVerse(startIndex);
  }, [isSupported, speakVerse]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPlaying(true);
    isPlayingRef.current = true;
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentVerseIndex(null);
  }, [isSupported]);

  return { isPlaying, currentVerseIndex, play, pause, resume, stop, isSupported };
}
