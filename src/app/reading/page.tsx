import { TarotReadingClient } from '@/components/reading/TarotReadingClient';
import type { Metadata } from 'next';
import { Wand } from 'lucide-react'; // Example icon, can be more specific

export const metadata: Metadata = {
  title: 'Tarot Reading - MysticSight Tarot',
  description: 'Get your personalized AI-powered tarot reading. Ask your question and choose your spread.',
};

export default function TarotReadingPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Wand className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Seek Your Wisdom</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Ask your question, select your spread, and let the cards guide you. Our AI will help interpret their messages.
        </p>
      </header>
      <TarotReadingClient />
    </div>
  );
}
