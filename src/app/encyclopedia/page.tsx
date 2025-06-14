import { CardList } from '@/components/encyclopedia/CardList';
import { tarotDeck } from '@/lib/tarot-data';
import type { Metadata } from 'next';
import { BookOpenText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tarot Encyclopedia - MysticSight Tarot',
  description: 'Explore the meanings, keywords, and imagery of each tarot card.',
};

export default function EncyclopediaPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <BookOpenText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Tarot Card Encyclopedia</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Delve into the rich symbolism and meanings of the Tarot. Click on a card to learn more.
        </p>
      </header>
      <CardList cards={tarotDeck} />
    </div>
  );
}
