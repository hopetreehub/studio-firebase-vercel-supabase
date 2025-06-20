
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
  const props = { className: className || "w-3 h-3" };
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"> {/* Reverted to multi-column grid */}
      {cards.map((card) => (
        <Link key={card.id} href={`/encyclopedia/${card.id}`} passHref legacyBehavior>
          <a className="block group h-full"> {/* Added h-full for consistent card heights if needed by grid */}
            <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-transparent bg-card/90 backdrop-blur-sm">
              {/* Image Container: Aspect ratio for tarot card, responsive height */}
              <div className="relative w-full aspect-[275/475] overflow-hidden rounded-t-lg bg-primary/5">
                <Image
                  src={card.imageSrc}
                  alt={card.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  data-ai-hint={card.dataAiHint}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Adjusted sizes
                />
              </div>
              
              {/* Content Container */}
              <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="font-headline text-lg md:text-xl text-primary group-hover:text-accent transition-colors mb-1 line-clamp-2">
                    {card.name}
                  </CardTitle>
                  <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <Badge variant={card.suit === 'major' ? 'default' : 'secondary'} className="capitalize text-[10px] px-1.5 py-0.5">
                      <SuitIcon suit={card.suit} className="w-2.5 h-2.5 mr-1" />
                      {card.suit === 'major' ? '메이저' : card.suit}
                    </Badge>
                    {(card.number !== undefined) && (
                       <span className="font-mono text-[11px]">
                         No. {card.suit === 'major' ? card.number : (typeof card.number === 'string' ? card.number.charAt(0).toUpperCase() + card.number.slice(1) : card.number)}
                       </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 mt-2 flex-grow space-y-1.5">
                  <div>
                    <h4 className="text-[11px] font-semibold text-muted-foreground">정방향 키워드:</h4>
                    <p className="text-xs text-foreground/75 line-clamp-2">
                      {card.keywordsUpright.join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold text-muted-foreground mt-1">역방향 키워드:</h4>
                    <p className="text-xs text-foreground/75 line-clamp-2">
                      {card.keywordsReversed.join(', ')}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="p-0 mt-2 pt-2 border-t border-border/20">
                  <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80 text-xs ml-auto">
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
