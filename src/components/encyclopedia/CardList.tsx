
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
    return <p className="text-center text-muted-foreground">No cards found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"> {/* Added xl:grid-cols-6 for larger screens */}
      {cards.map((card) => (
        <Link key={card.id} href={`/encyclopedia/${card.id}`} passHref>
          <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-transparent group">
            <CardHeader className="p-0 relative aspect-[275/475] w-full overflow-hidden"> {/* Enforce aspect ratio */}
              <Image
                src={card.imageSrc}
                alt={card.name}
                width={275} // Base width
                height={475} // Base height for correct aspect ratio
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={card.dataAiHint}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.6vw" // More granular sizes
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
               <div className="absolute bottom-2 left-2 right-2 p-1">
                 <h3 className="font-headline text-lg font-semibold text-primary-foreground truncate group-hover:text-primary-foreground/80 transition-colors">
                   {card.name}
                 </h3>
               </div>
            </CardHeader>
            <CardContent className="p-3 flex-grow">
               <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <Badge variant={card.suit === 'major' ? 'default' : 'secondary'} className="capitalize text-xs px-1.5 py-0.5">
                  <SuitIcon suit={card.suit} className="w-3 h-3 mr-1" />
                  {card.suit}
                </Badge>
                {card.number !== undefined && card.suit !== 'major' && (
                   <span className="font-mono">{typeof card.number === 'string' ? card.number.charAt(0).toUpperCase() + card.number.slice(1) : card.number}</span>
                )}
                {card.suit === 'major' && <span className="font-mono">{card.number}</span>}
              </div>
              <p className="text-xs text-foreground/70 line-clamp-2">
                {card.keywordsUpright[0]}, {card.keywordsUpright[1]}...
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
