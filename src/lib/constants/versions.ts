import { BibleVersion } from '@/types/bible';

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'krv', name: '개역한글', shortName: '개역한글', language: 'ko', sourceApi: 'helloao' },
  { id: 'kjv', name: 'King James Version', shortName: 'KJV', language: 'en', sourceApi: 'wldeh' },
  { id: 'bsb', name: 'Berean Standard Bible', shortName: 'BSB', language: 'en', sourceApi: 'wldeh' },
  { id: 'web', name: 'World English Bible', shortName: 'WEB', language: 'en', sourceApi: 'wldeh' },
  { id: 'asv', name: 'American Standard Version', shortName: 'ASV', language: 'en', sourceApi: 'wldeh' },
  { id: 'lsv', name: 'Literal Standard Version', shortName: 'LSV', language: 'en', sourceApi: 'wldeh' },
  { id: 'fbv', name: 'Free Bible Version', shortName: 'FBV', language: 'en', sourceApi: 'wldeh' },
];

export function getVersionById(id: string): BibleVersion | undefined {
  return BIBLE_VERSIONS.find(v => v.id === id);
}

export function getKoreanVersions(): BibleVersion[] {
  return BIBLE_VERSIONS.filter(v => v.language === 'ko');
}

export function getEnglishVersions(): BibleVersion[] {
  return BIBLE_VERSIONS.filter(v => v.language === 'en');
}

export function getAllVersions(): BibleVersion[] {
  return BIBLE_VERSIONS;
}
