'use client';

import { Header } from '@/components/layout/Header';

const COMMANDMENTS = [
  {
    number: 1,
    title: '제1계명',
    text: '너는 나 외에는 다른 신들을 네게 있게 말지니라',
    reference: '출애굽기 20:3',
  },
  {
    number: 2,
    title: '제2계명',
    text: '너를 위하여 새긴 우상을 만들지 말고 또 위로 하늘에 있는 것이나 아래로 땅에 있는 것이나 땅 아래 물 속에 있는 것의 아무 형상이든지 만들지 말며 그것들에게 절하지 말며 그것들을 섬기지 말라 나 여호와 너의 하나님은 질투하는 하나님인즉 나를 미워하는 자의 죄를 갚되 아비의 죄를 자손 삼사 대까지 이르게 하거니와 나를 사랑하고 내 계명을 지키는 자에게는 천 대까지 은혜를 베푸느니라',
    reference: '출애굽기 20:4-6',
  },
  {
    number: 3,
    title: '제3계명',
    text: '너는 너의 하나님 여호와의 이름을 망령되이 일컫지 말라 나 여호와는 나의 이름을 망령되이 일컫는 자를 죄 없다 하지 아니하리라',
    reference: '출애굽기 20:7',
  },
  {
    number: 4,
    title: '제4계명',
    text: '안식일을 기억하여 거룩히 지키라 엿새 동안은 힘써 네 모든 일을 행할 것이나 제칠일은 너의 하나님 여호와의 안식일인즉 너나 네 아들이나 네 딸이나 네 남종이나 네 여종이나 네 육축이나 네 문 안에 유하는 객이라도 아무 일도 하지 말라 이는 엿새 동안에 나 여호와가 하늘과 땅과 바다와 그 가운데 모든 것을 만들고 제칠일에 쉬었음이라 그러므로 나 여호와가 안식일을 복되게 하여 그 날을 거룩하게 하였느니라',
    reference: '출애굽기 20:8-11',
  },
  {
    number: 5,
    title: '제5계명',
    text: '네 부모를 공경하라 그리하면 너의 하나님 나 여호와가 네게 준 땅에서 네 생명이 길리라',
    reference: '출애굽기 20:12',
  },
  {
    number: 6,
    title: '제6계명',
    text: '살인하지 말지니라',
    reference: '출애굽기 20:13',
  },
  {
    number: 7,
    title: '제7계명',
    text: '간음하지 말지니라',
    reference: '출애굽기 20:14',
  },
  {
    number: 8,
    title: '제8계명',
    text: '도적질하지 말지니라',
    reference: '출애굽기 20:15',
  },
  {
    number: 9,
    title: '제9계명',
    text: '네 이웃에 대하여 거짓 증거하지 말지니라',
    reference: '출애굽기 20:16',
  },
  {
    number: 10,
    title: '제10계명',
    text: '네 이웃의 집을 탐내지 말지니라 네 이웃의 아내나 그의 남종이나 그의 여종이나 그의 소나 그의 나귀나 무릇 네 이웃의 소유를 탐내지 말지니라',
    reference: '출애굽기 20:17',
  },
];

export default function CommandmentsPage() {
  return (
    <>
      <Header title="십계명" showBack />
      <main className="p-4 pb-24 max-w-2xl mx-auto">

        {/* Title card */}
        <div className="card p-6 mb-6 text-center">
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest mb-2">
            출애굽기 20:1-17
          </p>
          <h1 className="text-2xl font-display text-bible-accent font-bold">
            십계명
          </h1>
          <p className="text-sm font-serif text-bible-text-secondary dark:text-bible-text-secondary-dark mt-2 italic">
            하나님이 이 모든 말씀으로 일러 가라사대
          </p>
        </div>

        {/* Commandments list */}
        <div className="space-y-4">
          {COMMANDMENTS.map((cmd) => (
            <div key={cmd.number} className="card p-5">
              <div className="flex items-start gap-4">
                {/* Number badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bible-accent/10 dark:bg-bible-accent/20 flex items-center justify-center">
                  <span className="text-lg font-display font-bold text-bible-accent">
                    {cmd.number}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display text-bible-accent font-medium uppercase tracking-wider mb-1.5">
                    {cmd.title}
                  </p>
                  <p className="text-base font-serif leading-relaxed text-bible-text dark:text-bible-text-dark">
                    {cmd.text}
                  </p>
                  <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mt-2">
                    {cmd.reference}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer ornament */}
        <div className="divider-ornament text-sm font-display mt-8">✦</div>
      </main>
    </>
  );
}
