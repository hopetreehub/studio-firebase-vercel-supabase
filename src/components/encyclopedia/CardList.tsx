
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
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30]; // Removed "All" as an explicit number for now

export function CardList({ cards }: CardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(ITEMS_PER_PAGE_OPTIONS[0]);

  if (!cards || cards.length === 0) {
    return <p className="text-center text-muted-foreground">카드를 찾을 수 없습니다.</p>;
  }

  const handleItemsPerPageChange = (value: string) => {
    if (value === 'all') {
      setItemsPerPage('all');
    } else {
      setItemsPerPage(parseInt(value, 10));
    }
    setCurrentPage(1); // 페이지당 항목 수가 변경되면 첫 페이지로 리셋
  };

  const cardsToDisplay = itemsPerPage === 'all' ? cards : cards.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(cards.length / (itemsPerPage as number));

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  return (
    <div className="space-y-8">
      <div className="max-w-2xl lg:max-w-3xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Label htmlFor="items-per-page-select" className="text-sm font-medium text-muted-foreground">페이지당 카드 수:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger id="items-per-page-select" className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <SelectItem key={option} value={option.toString()}>{option}장</SelectItem>
              ))}
              <SelectItem value="all">모두 보기</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">이전</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages} 페이지
            </span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <span className="mr-1">다음</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {cardsToDisplay.map((card) => (
          <Link key={card.id} href={`/encyclopedia/${card.id}`} passHref legacyBehavior>
            <a className="block group max-w-2xl lg:max-w-3xl mx-auto w-full">
              <Card className="flex flex-col md:flex-row h-full overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-transparent bg-card/90 backdrop-blur-sm">
                <div className="md:w-48 w-full shrink-0 bg-primary/5 relative aspect-[275/475] md:aspect-auto md:h-auto rounded-t-lg md:rounded-l-lg md:rounded-r-none overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                    data-ai-hint={card.dataAiHint}
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
                  <CardHeader className="p-0 pb-2 sm:pb-3">
                    <CardTitle className="font-headline text-xl md:text-2xl text-primary group-hover:text-accent transition-colors mb-1.5 line-clamp-2">
                      {card.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant={card.suit === 'major' ? 'default' : 'secondary'} className="capitalize text-[11px] px-2 py-0.5">
                        <SuitIcon suit={card.suit} className="w-3 h-3 mr-1.5" />
                        {card.suit === 'major' ? '메이저' : card.suit}
                      </Badge>
                      {(card.number !== undefined) && (
                         <span className="font-mono text-xs">
                           No. {card.suit === 'major' ? card.number : (typeof card.number === 'string' ? card.number.charAt(0).toUpperCase() + card.number.slice(1) : card.number)}
                         </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 sm:mt-3 flex-grow space-y-2">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-0.5">정방향 키워드:</h4>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {card.keywordsUpright.join(', ')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mt-1.5 mb-0.5">역방향 키워드:</h4>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {card.keywordsReversed.join(', ')}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-0 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/20">
                    <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80 text-sm ml-auto">
                      <span>자세히 보기 &rarr;</span>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
      
      {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="max-w-2xl lg:max-w-3xl mx-auto w-full flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">이전</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages} 페이지
            </span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <span className="mr-1">다음</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
    </div>
  );
}
