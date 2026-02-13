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

  const speakVerse = useCallback((index: number) => {
    if (!isSupported || index >= versesRef.current.length) {
      // Done reading all verses
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentVerseIndex(null);
      return;
    }

    const verse = versesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(verse.text);
    utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = rate;

    // Try to find a good voice for the language
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang === 'ko' ? 'ko' : 'en';
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    setCurrentVerseIndex(index);
    indexRef.current = index;

    utterance.onend = () => {
      if (isPlayingRef.current) {
        speakVerse(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        // Try next verse on error
        if (isPlayingRef.current) {
          speakVerse(index + 1);
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, lang, rate]);

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
