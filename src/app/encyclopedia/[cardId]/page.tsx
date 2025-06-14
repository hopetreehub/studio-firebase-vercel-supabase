import { getCardById, tarotDeck } from '@/lib/tarot-data';
import type { TarotCard }_ from '@/types'; // Renamed to avoid conflict with component
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WandIcon } from '@/components/icons/WandIcon';
import { CupIcon } from '@/components/icons/CupIcon';
import { SwordIcon } from '@/components/icons/SwordIcon';
import { PentacleIcon } from '@/components/icons/PentacleIcon';
import { Star, Sparkles, Users, Brain, Anchor, Zap } from 'lucide-react'; // Added more icons
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
  const cardName = card ? card.name : 'Card Not Found';
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${cardName} - Tarot Encyclopedia - MysticSight Tarot`,
    description: card ? `Meaning and keywords for ${card.name}. ${card.meaningUpright.substring(0,100)}...` : 'Tarot card details.',
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

const SuitIconDetail = ({ suit, className }: { suit: TarotCard_['suit'], className?: string }) => {
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
        <h1 className="font-headline text-3xl text-destructive mb-4">Card Not Found</h1>
        <p className="text-muted-foreground">The tarot card you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/encyclopedia">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Encyclopedia
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button asChild variant="outline" className="mb-6 group hover:bg-primary/5">
        <Link href="/encyclopedia">
          <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> 
          Back to Encyclopedia
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl border-primary/10">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 p-4 sm:p-6 bg-primary/5 flex justify-center items-center">
            <Image
              src={card.imageSrc}
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
                  {card.suit} Arcana
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
              <DetailSection title="Keywords" icon={<Sparkles className="w-5 h-5 text-accent" />}>
                <div>
                  <h4 className="font-semibold text-primary/90">Upright:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {card.keywordsUpright.map(keyword => <Badge key={keyword} variant="outline" className="bg-accent/5 border-accent/30 text-accent">{keyword}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary/90">Reversed:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {card.keywordsReversed.map(keyword => <Badge key={keyword} variant="outline" className="bg-muted/50 border-muted-foreground/30 text-muted-foreground">{keyword}</Badge>)}
                  </div>
                </div>
              </DetailSection>

              <Separator className="my-4 bg-primary/10" />

              <DetailSection title="Meanings" icon={<BookOpenText className="w-5 h-5 text-accent" />}>
                <div>
                  <h4 className="font-semibold text-primary/90">Upright:</h4>
                  <p className="leading-relaxed">{card.meaningUpright}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary/90">Reversed:</h4>
                  <p className="leading-relaxed">{card.meaningReversed}</p>
                </div>
              </DetailSection>

              {card.fortuneTelling && card.fortuneTelling.length > 0 && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="Fortune Telling" icon={<Zap className="w-5 h-5 text-accent" />}>
                    <ul className="list-disc list-inside space-y-1">
                      {card.fortuneTelling.map((fortune, i) => <li key={i}>{fortune}</li>)}
                    </ul>
                  </DetailSection>
                </>
              )}

              {card.questionsToAsk && card.questionsToAsk.length > 0 && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="Questions to Ask" icon={<Brain className="w-5 h-5 text-accent" />}>
                     <ul className="list-disc list-inside space-y-1">
                      {card.questionsToAsk.map((question, i) => <li key={i}>{question}</li>)}
                    </ul>
                  </DetailSection>
                </>
              )}
              
              {(card.astrology || card.element) && (
                <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="Correspondences" icon={<Anchor className="w-5 h-5 text-accent" />}>
                    {card.astrology && <p><span className="font-semibold">Astrology:</span> {card.astrology}</p>}
                    {card.element && <p><span className="font-semibold">Element:</span> {card.element}</p>}
                  </DetailSection>
                </>
              )}

              {card.affirmation && (
                 <>
                  <Separator className="my-4 bg-primary/10" />
                  <DetailSection title="Affirmation" icon={<Users className="w-5 h-5 text-accent" />}>
                    <p className="italic">"{card.affirmation}"</p>
                  </DetailSection>
                </>
              )}

            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
