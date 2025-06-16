
import { CardList } from '@/components/encyclopedia/CardList';
import { tarotDeck } from '@/lib/tarot-data';
import type { Metadata } from 'next';
import { BookOpenText } from 'lucide-react';

export const metadata: Metadata = {
  title: '타로 백과사전 - InnerSpell',
  description: '78장 타로 카드 각각의 의미, 키워드, 상징, 이미지를 깊이 있게 탐색하세요. 메이저 아르카나와 마이너 아르카나의 지혜를 발견하세요.',
  openGraph: {
    title: 'InnerSpell 타로 카드 백과사전',
    description: '타로 카드의 세계를 탐험하고 각 카드가 지닌 심오한 메시지를 알아보세요.',
    // images: (Can be set if there's a generic encyclopedia OG image)
  },
};

export default function EncyclopediaPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <BookOpenText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">타로 카드 백과사전</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로의 풍부한 상징과 의미를 깊이 알아보세요. 각 카드는 우주적 지혜와 내면의 목소리를 담고 있습니다. 카드를 클릭하여 자세히 알아보세요.
        </p>
      </header>
      <CardList cards={tarotDeck} />
    </div>
  );
}

    