
'use client';

import type { TarotCard } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WandIcon } from '@/components/icons/WandIcon';
import { CupIcon } from '@/components/icons/CupIcon';
import { SwordIcon } from '@/components/icons/SwordIcon';
import { PentacleIcon } from '@/components/icons/PentacleIcon';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardListProps {
  cards: TarotCard[];
}

const SuitIcon = ({ suit, className }: { suit: TarotCard['suit'], className?: string }) => {
  const props = { className: className || "w-4 h-4" };
  switch (suit) {
    case 'wands': return <WandIcon {...props} />;
    case 'cups': return <CupIcon {...props} />;
    case 'swords': return <SwordIcon {...props} />;
    case 'pentacles': return <PentacleIcon {...props} />;
    case 'major': return <Star {...props} />;
    default: return null;
  }
};

export function CardList({ cards }: CardListProps) {
  if (!cards || cards.length === 0) {
    return <p className="text-center text-muted-foreground">카드를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {cards.map((card) => (
        <Link key={card.id} href={`/encyclopedia/${card.id}`} passHref legacyBehavior>
          <a className="block h-full group">
            <Card className="h-full flex flex-col md:flex-row overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-transparent bg-card/80 backdrop-blur-sm">
              {/* Image Container */}
              <div className="md:w-1/3 lg:w-2/5 aspect-[275/475] md:aspect-auto relative shrink-0 overflow-hidden md:rounded-l-lg md:rounded-r-none rounded-t-lg">
                <Image
                  src={card.imageSrc}
                  alt={card.name}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={card.dataAiHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Content Container */}
              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="font-headline text-xl sm:text-2xl text-primary group-hover:text-accent transition-colors">{card.name}</CardTitle>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <Badge variant={card.suit === 'major' ? 'default' : 'secondary'} className="capitalize text-xs px-2 py-0.5">
                      <SuitIcon suit={card.suit} className="w-3 h-3 mr-1.5" />
                      {card.suit === 'major' ? '메이저' : card.suit}
                    </Badge>
                    {(card.number !== undefined) && (
                       <span className="font-mono text-sm">
                         {card.suit === 'major' ? card.number : (typeof card.number === 'string' ? card.number.charAt(0).toUpperCase() + card.number.slice(1) : card.number)}
                       </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 pb-3 flex-grow">
                  <p className="text-sm text-foreground/75 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                    {card.keywordsUpright.slice(0, 4).join(', ')}
                    {card.keywordsUpright.length > 4 ? '...' : ''}
                  </p>
                </CardContent>
                <CardFooter className="p-0 mt-auto">
                  <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80 text-sm">
                    <span>자세히 보기 &rarr;</span>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
}
