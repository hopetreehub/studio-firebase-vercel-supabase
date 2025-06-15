
import { getCardById, tarotDeck } from '@/lib/tarot-data';
import type { TarotCard as TarotCardType } from '@/types'; // Renamed to avoid conflict
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WandIcon } from '@/components/icons/WandIcon';
import { CupIcon } from '@/components/icons/CupIcon';
import { SwordIcon } from '@/components/icons/SwordIcon';
import { PentacleIcon } from '@/components/icons/PentacleIcon';
import { Star, Sparkles, Users, Brain, Anchor, Zap, BookOpenText } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type Props = {
  params: { cardId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const card = getCardById(params.cardId);
  const cardName = card ? card.name : '카드를 찾을 수 없습니다';
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${cardName} - 타로 백과사전 - InnerSpell`,
    description: card ? `${cardName}의 의미와 키워드. ${card.meaningUpright.substring(0,100)}...` : '타로 카드 상세 정보.',
    openGraph: {
      images: card ? [card.imageSrc, ...previousImages] : previousImages,
    },
  };
}

export async function generateStaticParams() {
  return tarotDeck.map((card) => ({
    cardId: card.id,
  }));
}

const SuitIconDetail = ({ suit, className }: { suit: TarotCardType['suit'], className?: string }) => {
  const props = { className: className || "w-5 h-5" };
  switch (suit) {
    case 'wands': return <WandIcon {...props} />;
    case 'cups': return <CupIcon {...props} />;
    case 'swords': return <SwordIcon {...props} />;
    case 'pentacles': return <PentacleIcon {...props} />;
    case 'major': return <Star {...props} />;
    default: return null;
  }
};

const DetailSection: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
  <div>
    <h3 className="font-headline text-xl text-primary mb-2 flex items-center">
      {icon} <span className="ml-2">{title}</span>
    </h3>
    <div className="text-foreground/80 space-y-1">{children}</div>
  </div>
);


export default function CardDetailPage({ params }: Props) {
  const card = getCardById(params.cardId);

  if (!card) {
    return (
      <div className="text-center py-10">
        <h1 className="font-headline text-3xl text-destructive mb-4">카드를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">찾으시는 타로 카드가 존재하지 않습니다.</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/encyclopedia">
            <ChevronLeft className="mr-2 h-4 w-4" /> 백과사전으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8"> {/* Added py-8 for consistent padding */}
      <Card className="overflow-hidden shadow-xl border-primary/10">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 p-4 sm:p-6 bg-primary/5 flex justify-center items-center">
            <Image
              src={card.imageSrc} // Ensure this path points to where user will place images
              alt={card.name}
              width={300}
              height={500}
              className="rounded-lg shadow-lg object-contain max-h-[500px] w-auto"
              data-ai-hint={card.dataAiHint}
              priority
            />
          </div>
          <div className="md:col-span-2 p-6 sm:p-8">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={card.suit === 'major' ? 'default' : 'secondary'} className="capitalize text-sm px-2 py-1">
                  <SuitIconDetail suit={card.suit} className="w-4 h-4 mr-1.5" />
                  {card.suit} 아르카나
                </Badge>
                {card.number !== undefined && (
                  <span className="font-mono text-lg text-primary font-semibold">
                    {card.suit === 'major' ? card.number : typeof card.number === 'string' ? card.number.charAt(0).toUpperCase() + card.number.slice(1) : card.number}
                  </span>
                )}
              </div>
              <CardTitle className="font-headline text-4xl text-primary">{card.name}</CardTitle>
              {card.description && <CardDescription className="text-md text-foreground/70 mt-2">{card.description}</CardDescription>}
            </CardHeader>
            
            <Separator className="my-6 bg-primary/20" />

            <CardContent className="p-0 space-y-6">
              <DetailSection title="키워드" icon={<Sparkles className="w-5 h-5 text-accent" />}>
                <div>
                  <h4 className="font-semibold text-primary/90">정방향:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {card.keywordsUpright.map(keyword => <Badge key={keyword} variant="outline" className="bg-accent/5 border-accent/30 text-accent">{keyword}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary/90">역방향:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {card.keywordsReversed.map(keyword => <Badge key={keyword} variant="outline" className="bg-muted/50 border-muted-foreground/30 text-muted-foreground">{keyword}</Badge>)}
                  </div>
                </div>
              </DetailSection>

              <Separator className="my-4 bg-primary/10" />

              <DetailSection title="의미" icon={<BookOpenText className="w-5 h-5 text-accent" />}>
                <div>
                  <h4 className="font-semibold text-primary/90">정방향:</h4>
                  <p className="leading-relaxed">{card.meaningUpright}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary/90">역방향:</h4>
                  <p className="leading-relaxed">{card.meaningReversed}</p>
                </div>
              </DetailSection>

              {card.fortuneTelling && card.fortuneTelling.length > 0 && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="점괘" icon={<Zap className="w-5 h-5 text-accent" />}>
                    <ul className="list-disc list-inside space-y-1">
                      {card.fortuneTelling.map((fortune, i) => <li key={i}>{fortune}</li>)}
                    </ul>
                  </DetailSection>
                </>
              )}

              {card.questionsToAsk && card.questionsToAsk.length > 0 && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="질문해볼 것들" icon={<Brain className="w-5 h-5 text-accent" />}>
                     <ul className="list-disc list-inside space-y-1">
                      {card.questionsToAsk.map((question, i) => <li key={i}>{question}</li>)}
                    </ul>
                  </DetailSection>
                </>
              )}
              
              {(card.astrology || card.element) && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="상응 관계" icon={<Anchor className="w-5 h-5 text-accent" />}>
                    {card.astrology && <p><span className="font-semibold">점성술:</span> {card.astrology}</p>}
                    {card.element && <p><span className="font-semibold">원소:</span> {card.element}</p>}
                  </DetailSection>
                </>
              )}

              {card.affirmation && (
                 <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="확언" icon={<Users className="w-5 h-5 text-accent" />}>
                    <p className="italic">"{card.affirmation}"</p>
                  </DetailSection>
                </>
              )}

            </CardContent>
          </div>
        </div>
      </Card>

      <Button asChild variant="outline" className="mt-8 group hover:bg-primary/5"> {/* Added mt-8 for spacing */}
        <Link href="/encyclopedia">
          <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> 
          백과사전으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
