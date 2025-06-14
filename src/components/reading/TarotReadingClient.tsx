'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { TarotCard, TarotInterpretationMethod } from '@/types';
import { interpretationMethods } from '@/types';
import { tarotDeck } from '@/lib/tarot-data';
import { generateTarotInterpretation } from '@/ai/flows/generate-tarot-interpretation';
import Image from 'next/image';
import { WandIcon } from '@/components/icons/WandIcon';
import { CupIcon } from '@/components/icons/CupIcon';
import { SwordIcon } from '@/components/icons/SwordIcon';
import { PentacleIcon } from '@/components/icons/PentacleIcon';
import { Star, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion'; // For animations

type SpreadType = '1-card' | '3-card' | 'custom'; // Custom can be more complex later

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


export function TarotReadingClient() {
  const [question, setQuestion] = useState<string>('');
  const [spreadType, setSpreadType] = useState<SpreadType>('3-card');
  const [interpretationMethod, setInterpretationMethod] = useState<TarotInterpretationMethod>(interpretationMethods[0]);
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showInterpretation, setShowInterpretation] = useState<boolean>(false);
  const [displayedInterpretation, setDisplayedInterpretation] = useState<string>('');
  const { toast } = useToast();

  const drawCards = () => {
    setShowInterpretation(false);
    setInterpretation('');
    setDisplayedInterpretation('');
    
    let numCards = 0;
    if (spreadType === '1-card') numCards = 1;
    else if (spreadType === '3-card') numCards = 3;
    // Add logic for custom spread if needed

    const shuffledDeck = [...tarotDeck].sort(() => 0.5 - Math.random());
    const selectedCards = shuffledDeck.slice(0, numCards).map(card => ({
      ...card,
      // Randomly decide if card is upright or reversed for interpretation purposes
      isReversed: Math.random() > 0.5 
    }));
    setDrawnCards(selectedCards as (TarotCard & { isReversed: boolean })[]); // Type assertion
  };

  useEffect(() => {
    // Draw initial cards when component mounts or spread type changes
    if (spreadType) {
      drawCards();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadType]);


  const handleGetInterpretation = async () => {
    if (!question.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter your question.' });
      return;
    }
    if (drawnCards.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please draw cards first.' });
      return;
    }

    setIsLoading(true);
    setShowInterpretation(true);
    setDisplayedInterpretation('');

    const cardInterpretationsText = drawnCards.map(card => {
      const cardData = card as TarotCard & { isReversed: boolean }; // Access isReversed
      const orientation = cardData.isReversed ? 'Reversed' : 'Upright';
      const meaning = cardData.isReversed ? cardData.meaningReversed : cardData.meaningUpright;
      return `${cardData.name} (${orientation}): ${meaning.substring(0,100)}...`; // Shortened for prompt
    }).join('\n');
    
    const spreadName = spreadType === '1-card' ? 'Single Card Draw' : spreadType === '3-card' ? 'Three Card Spread (Past, Present, Future)' : 'Custom Spread';

    try {
      const result = await generateTarotInterpretation({
        question: `${question} (Interpretation style: ${interpretationMethod})`,
        cardSpread: spreadName,
        cardInterpretations: cardInterpretationsText,
      });
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error('Error generating interpretation:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate interpretation.' });
      setShowInterpretation(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (interpretation && isLoading === false) {
      let index = 0;
      setDisplayedInterpretation(''); // Clear previous before starting new one
      const intervalId = setInterval(() => {
        setDisplayedInterpretation(prev => prev + interpretation[index]);
        index++;
        if (index === interpretation.length) {
          clearInterval(intervalId);
        }
      }, 20); // Adjust speed of "streaming" here
      return () => clearInterval(intervalId);
    }
  }, [interpretation, isLoading]);


  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Your Tarot Reading Setup</CardTitle>
          <CardDescription>Configure your reading preferences and ask your question.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-lg font-semibold text-foreground/90">Your Question:</Label>
            <Textarea
              id="question"
              placeholder="What guidance do the cards hold for me regarding..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] text-base bg-background/70 border-input focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spread-type" className="text-lg font-semibold text-foreground/90">Select Spread:</Label>
              <Select value={spreadType} onValueChange={(value) => setSpreadType(value as SpreadType)}>
                <SelectTrigger id="spread-type" className="h-12 text-base">
                  <SelectValue placeholder="Choose a spread" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-card">One Card Draw (Quick Insight)</SelectItem>
                  <SelectItem value="3-card">Three Card Spread (Past, Present, Future)</SelectItem>
                  {/* <SelectItem value="custom" disabled>Custom Spread (Coming Soon)</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interpretation-method" className="text-lg font-semibold text-foreground/90">Interpretation Style:</Label>
              <Select value={interpretationMethod} onValueChange={(value) => setInterpretationMethod(value as TarotInterpretationMethod)}>
                <SelectTrigger id="interpretation-method" className="h-12 text-base">
                  <SelectValue placeholder="Choose interpretation style" />
                </SelectTrigger>
                <SelectContent>
                  {interpretationMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center pt-6 border-t border-border/20">
           <Button variant="outline" onClick={drawCards} className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10">
            <RefreshCw className="mr-2 h-4 w-4" /> Draw New Cards
          </Button>
          <Button onClick={handleGetInterpretation} disabled={isLoading || !question.trim()} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-8 shadow-md">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {isLoading ? 'Interpreting...' : 'Get AI Interpretation'}
          </Button>
        </CardFooter>
      </Card>

      {drawnCards.length > 0 && (
        <Card className="shadow-xl border-primary/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">Your Drawn Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${drawnCards.length === 1 ? 'max-w-xs mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
              <AnimatePresence>
              {drawnCards.map((card, index) => {
                const cardData = card as TarotCard & { isReversed?: boolean };
                return (
                <motion.div
                  key={card.id + '-' + index} // Unique key for animation when redrawing
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 90 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="transform-gpu" // Better performance for transforms
                >
                <Card className={`overflow-hidden shadow-lg h-full flex flex-col border ${cardData.isReversed ? 'border-red-500/50 bg-red-500/5' : 'border-transparent'}`}>
                  <div className={`relative aspect-[3/5] w-full overflow-hidden ${cardData.isReversed ? 'transform rotate-180' : ''}`}>
                    <Image
                      src={cardData.imageSrc}
                      alt={cardData.name}
                      width={300}
                      height={500}
                      className="object-cover w-full h-full"
                      data-ai-hint={cardData.dataAiHint}
                    />
                  </div>
                  <CardHeader className={`p-3 ${cardData.isReversed ? 'transform rotate-180' : ''}`}>
                    <CardTitle className="font-headline text-xl text-primary text-center truncate">{cardData.name}</CardTitle>
                    {cardData.isReversed && <CardDescription className="text-center text-sm text-red-600">(Reversed)</CardDescription>}
                  </CardHeader>
                  <CardContent className={`p-3 text-xs text-foreground/70 flex-grow ${cardData.isReversed ? 'transform rotate-180' : ''}`}>
                     <div className="flex items-center justify-center text-xs text-muted-foreground mb-1">
                        <SuitIcon suit={cardData.suit} className="w-3 h-3 mr-1" />
                        <span className="capitalize">{cardData.suit}</span>
                        {cardData.number !== undefined && card.suit !== 'major' && (
                          <span className="ml-1 font-mono">{typeof cardData.number === 'string' ? cardData.number.charAt(0).toUpperCase() + cardData.number.slice(1) : cardData.number}</span>
                        )}
                         {card.suit === 'major' && <span className="ml-1 font-mono">{cardData.number}</span>}
                      </div>
                    <p className="line-clamp-3">
                      <strong>{cardData.isReversed ? "Reversed:" : "Upright:"}</strong> {cardData.isReversed ? cardData.keywordsReversed[0] : cardData.keywordsUpright[0]}, {cardData.isReversed ? cardData.keywordsReversed[1] : cardData.keywordsUpright[1]}...
                    </p>
                  </CardContent>
                </Card>
                </motion.div>
              );
              })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {showInterpretation && (
        <Card className="shadow-xl border-primary/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Sparkles className="mr-2 h-7 w-7 text-accent" /> AI Interpretation
            </CardTitle>
             {isLoading && <CardDescription>The AI is weaving its wisdom for you...</CardDescription>}
             {!isLoading && interpretation && <CardDescription>Here's what the cards and AI suggest for your question.</CardDescription>}
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary prose-p:text-foreground/80 prose-strong:text-primary/90 min-h-[150px]">
            {isLoading && !displayedInterpretation && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
              </div>
            )}
            {/* Progressive display of interpretation */}
            <div style={{ whiteSpace: 'pre-wrap' }}>{displayedInterpretation}</div>
            {!isLoading && !interpretation && !displayedInterpretation && (
                <p className="text-muted-foreground">No interpretation available yet. Click "Get AI Interpretation" above.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
