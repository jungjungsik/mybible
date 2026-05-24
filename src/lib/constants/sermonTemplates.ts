/**
 * Sermon note templates — preset markdown skeletons users can start from.
 * Keep each template short; readers want a frame, not a wall of placeholders.
 */

export interface SermonTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const SERMON_TEMPLATES: SermonTemplate[] = [
  {
    id: 'blank',
    name: '빈 노트',
    description: '템플릿 없이 시작',
    content: '',
  },
  {
    id: 'standard',
    name: '표준',
    description: '본문 / 요지 / 적용 / 기도',
    content:
      '## 본문\n\n> 인용 구절을 여기에\n\n## 요지\n\n- \n\n## 적용\n\n- \n\n## 기도\n\n',
  },
  {
    id: 'three-points',
    name: '3대지',
    description: '서론 / 대지 1·2·3 / 결론',
    content:
      '## 서론\n\n\n\n## 1. \n\n\n\n## 2. \n\n\n\n## 3. \n\n\n\n## 결론\n\n',
  },
  {
    id: 'qt',
    name: '큐티 (QT)',
    description: '관찰 / 해석 / 적용 / 기도',
    content:
      '## 관찰 (무엇을 말하는가)\n\n- \n\n## 해석 (무엇을 의미하는가)\n\n- \n\n## 적용 (어떻게 살 것인가)\n\n- \n\n## 기도\n\n',
  },
];

export function getSermonTemplate(id: string): SermonTemplate | undefined {
  return SERMON_TEMPLATES.find((t) => t.id === id);
}
