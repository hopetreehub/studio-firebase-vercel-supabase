
import { CardList } from '@/components/encyclopedia/CardList';
import { tarotDeck } from '@/lib/tarot-data';
import type { Metadata } from 'next';
import { BookOpenText } from 'lucide-react';

export const metadata: Metadata = {
  title: '타로 백과사전 - InnerSpell',
  description: '각 타로 카드의 의미, 키워드, 이미지를 탐색하세요.',
};

export default function EncyclopediaPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <BookOpenText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">타로 카드 백과사전</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로의 풍부한 상징과 의미를 깊이 알아보세요. 카드를 클릭하여 자세히 알아보세요.
        </p>
      </header>
      <CardList cards={tarotDeck} />
    </div>
  );
}
