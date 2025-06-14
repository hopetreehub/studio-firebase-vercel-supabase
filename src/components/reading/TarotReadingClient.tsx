
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { TarotCard, TarotInterpretationMethod, SpreadConfiguration } from '@/types';
import { interpretationMethods, tarotSpreads } from '@/types';
import { tarotDeck as allCards } from '@/lib/tarot-data';
import { generateTarotInterpretation } from '@/ai/flows/generate-tarot-interpretation';
import Image from 'next/image';
import { Sparkles, Loader2, Shuffle, Layers, EyeIcon, WandIcon, CupIcon, SwordIcon, PentacleIcon, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

type ReadingStage = 'setup' | 'deck_ready' | 'shuffling' | 'shuffled' | 'spread_revealed' | 'cards_selected' | 'interpreting' | 'interpretation_ready';

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

const CARD_BACK_IMAGE = '/images/tarot/back.png';
const CARDS_TO_DRAW_FOR_SPREAD = 15; // 펼칠 때 보여줄 카드 수 (선택 풀)

export function TarotReadingClient() {
  const [question, setQuestion] = useState<string>('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfiguration>(tarotSpreads[1]); // Default to 3-card
  const [interpretationMethod, setInterpretationMethod] = useState<TarotInterpretationMethod>(interpretationMethods[0]);
  
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [revealedSpreadCards, setRevealedSpreadCards] = useState<TarotCard[]>([]);
  const [selectedCardsForReading, setSelectedCardsForReading] = useState<TarotCard[]>([]);

  const [interpretation, setInterpretation] = useState<string>('');
  const [displayedInterpretation, setDisplayedInterpretation] = useState<string>('');
  const [stage, setStage] = useState<ReadingStage>('setup');
  
  const { toast } = useToast();
  const deckAnimationControls = useAnimation();
  const spreadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
    setStage('deck_ready');
  }, []);

  const handleShuffle = async () => {
    setStage('shuffling');
    setRevealedSpreadCards([]);
    setSelectedCardsForReading([]);
    setInterpretation('');
    setDisplayedInterpretation('');

    // Deck shuffle animation
    await deckAnimationControls.start({
      x: [0, -10, 10, -5, 5, 0, -2, 2, 0],
      rotate: [0, -3, 3, -2, 2, -1, 1, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    });
    
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
    setStage('shuffled');
    toast({ title: "덱 섞기 완료", description: "카드가 섞였습니다. 이제 카드를 펼쳐보세요." });
  };

  const handleRevealSpread = () => {
    if (deck.length < CARDS_TO_DRAW_FOR_SPREAD) {
      toast({ variant: 'destructive', title: '오류', description: '덱에 카드가 부족합니다. 다시 섞어주세요.' });
      return;
    }
    // Draw a pool of cards for selection, all initially face down
    const drawnPool = deck.slice(0, CARDS_TO_DRAW_FOR_SPREAD).map(card => ({
      ...card,
      isReversed: false, // Will be determined on selection or can be pre-determined
      isFaceUp: false,   // Initially face down
    }));
    setRevealedSpreadCards(drawnPool);
    setStage('spread_revealed');
  };

  const handleCardSelectFromSpread = (clickedCard: TarotCard, index: number) => {
    if (selectedCardsForReading.length >= selectedSpread.numCards && !selectedCardsForReading.find(c => c.id === clickedCard.id)) {
      toast({ description: `최대 ${selectedSpread.numCards}장까지 선택할 수 있습니다.` });
      return;
    }

    const alreadySelected = selectedCardsForReading.find(c => c.id === clickedCard.id);
    let newSelectedCards;

    if (alreadySelected) {
      // Deselect card - remove from selected, put back to spread (conceptually)
      newSelectedCards = selectedCardsForReading.filter(c => c.id !== clickedCard.id);
      // Update the card in revealedSpreadCards to be face down again
      setRevealedSpreadCards(prev => prev.map(card => card.id === clickedCard.id ? {...card, isFaceUp: false} : card));
    } else if (selectedCardsForReading.length < selectedSpread.numCards) {
      // Select card
      const cardToSelect = { ...clickedCard, isReversed: Math.random() > 0.5, isFaceUp: true };
      newSelectedCards = [...selectedCardsForReading, cardToSelect];
      // Update the card in revealedSpreadCards to be face up
      setRevealedSpreadCards(prev => prev.map(card => card.id === clickedCard.id ? {...card, isFaceUp: true, isReversed: cardToSelect.isReversed} : card));
    } else {
      return; // Max cards selected
    }
    
    setSelectedCardsForReading(newSelectedCards);

    if (newSelectedCards.length === selectedSpread.numCards) {
      setStage('cards_selected');
    } else {
      setStage('spread_revealed'); 
    }
  };

  const handleGetInterpretation = async () => {
    if (!question.trim()) {
      toast({ variant: 'destructive', title: '질문 필요', description: '해석을 받기 전에 질문을 입력해주세요.' });
      return;
    }
    if (selectedCardsForReading.length !== selectedSpread.numCards) {
      toast({ variant: 'destructive', title: '카드 부족', description: `스프레드에 필요한 ${selectedSpread.numCards}장의 카드를 모두 선택해주세요.` });
      return;
    }

    setStage('interpreting');
    setDisplayedInterpretation('');

    const cardInterpretationsText = selectedCardsForReading.map((card, index) => {
      const orientation = card.isReversed ? '역방향' : '정방향';
      const meaning = card.isReversed ? card.meaningReversed : card.meaningUpright;
      const positionName = selectedSpread.positions?.[index] ? ` (${selectedSpread.positions[index]})` : '';
      return `${card.name}${positionName} (${orientation}): ${meaning.substring(0,100)}...`;
    }).join('\n');
    
    try {
      const result = await generateTarotInterpretation({
        question: `${question} (해석 스타일: ${interpretationMethod})`,
        cardSpread: selectedSpread.name,
        cardInterpretations: cardInterpretationsText,
      });
      setInterpretation(result.interpretation);
      setStage('interpretation_ready');
    } catch (error) {
      console.error('해석 생성 오류:', error);
      toast({ variant: 'destructive', title: '해석 오류', description: 'AI 해석을 생성하는 데 실패했습니다.' });
      setStage('cards_selected'); 
    }
  };
  
  useEffect(() => {
    if (interpretation && stage === 'interpretation_ready') {
      let index = 0;
      setDisplayedInterpretation('');
      const intervalId = setInterval(() => {
        setDisplayedInterpretation(prev => prev + interpretation[index]);
        index++;
        if (index === interpretation.length) {
          clearInterval(intervalId);
        }
      }, 25); 
      return () => clearInterval(intervalId);
    }
  }, [interpretation, stage]);

  const cardStack = (
    <motion.div animate={deckAnimationControls} className="relative w-36 h-56 md:w-40 md:h-60 mx-auto cursor-pointer group" onClick={stage === 'deck_ready' || stage === 'shuffled' ? handleShuffle : undefined}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute w-full h-full rounded-lg shadow-xl overflow-hidden border-2 border-primary/30"
          style={{
            transform: `translateX(${i * 1.5}px) translateY(${i * -1.5}px)`,
            zIndex: 5 - i,
          }}
        >
          <Image src={CARD_BACK_IMAGE} alt="카드 뒷면 뭉치" layout="fill" objectFit="cover" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg pointer-events-none">
        <p className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity">
          {stage === 'shuffling' ? '섞는 중...' : '덱 (섞기)'}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">타로 리딩 설정</CardTitle>
          <CardDescription>리딩 환경을 설정하고 질문을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-lg font-semibold text-foreground/90">당신의 질문:</Label>
            <Textarea
              id="question"
              placeholder="카드에게 무엇을 묻고 싶나요? 예: 저의 현재 연애운은 어떤가요?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] text-base bg-background/70 border-input focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spread-type" className="text-lg font-semibold text-foreground/90">스프레드 선택:</Label>
              <Select 
                value={selectedSpread.id} 
                onValueChange={(value) => {
                  const newSpread = tarotSpreads.find(s => s.id === value) || tarotSpreads[0];
                  setSelectedSpread(newSpread);
                  setStage('deck_ready'); 
                  setRevealedSpreadCards([]);
                  setSelectedCardsForReading([]);
                }}
              >
                <SelectTrigger id="spread-type" className="h-12 text-base">
                  <SelectValue placeholder="스프레드 선택" />
                </SelectTrigger>
                <SelectContent>
                  {tarotSpreads.map(spread => (
                    <SelectItem key={spread.id} value={spread.id}>{spread.name} ({spread.numCards}장)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interpretation-method" className="text-lg font-semibold text-foreground/90">해석 스타일:</Label>
              <Select value={interpretationMethod} onValueChange={(value) => setInterpretationMethod(value as TarotInterpretationMethod)}>
                <SelectTrigger id="interpretation-method" className="h-12 text-base">
                  <SelectValue placeholder="해석 스타일 선택" />
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
      </Card>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">리딩 진행</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-around gap-4 items-center">
            <Button onClick={handleShuffle} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={stage === 'interpreting' || stage === 'shuffling' || stage === 'spread_revealed'}>
                {stage === 'shuffling' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Shuffle className="mr-2 h-5 w-5" />}
                {stage === 'shuffling' ? '섞는 중...' : '카드 섞기'}
            </Button>
            <Button onClick={handleRevealSpread} disabled={stage !== 'shuffled'} className="w-full sm:w-auto">
                <Layers className="mr-2 h-5 w-5" /> 카드 펼치기
            </Button>
            <Button onClick={handleGetInterpretation} disabled={stage !== 'cards_selected' && stage !== 'interpretation_ready'} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6 shadow-md">
                {stage === 'interpreting' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                {stage === 'interpreting' ? '해석 중...' : 'AI 해석 받기'}
            </Button>
        </CardContent>
      </Card>
      
      {(stage === 'deck_ready' || stage === 'shuffled' || stage === 'shuffling') && !revealedSpreadCards.length && (
        <div className="my-8 flex justify-center">
          {cardStack}
        </div>
      )}

      {revealedSpreadCards.length > 0 && (stage === 'spread_revealed' || stage === 'cards_selected') && (
        <Card className="shadow-xl border-primary/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">펼쳐진 카드 ({selectedCardsForReading.length}/{selectedSpread.numCards} 선택됨)</CardTitle>
            <CardDescription>{selectedSpread.description} 카드를 클릭하여 {selectedSpread.numCards}장 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent 
            ref={spreadContainerRef} 
            className="overflow-x-auto py-6 px-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-primary/10 bg-primary/5 rounded-lg"
          >
            <div className="flex flex-nowrap gap-[-40px] sm:gap-[-60px] justify-start min-w-max px-2 pb-2 h-[250px] items-center"> {/* Overlapping cards */}
              <AnimatePresence>
                {revealedSpreadCards.map((card, index) => {
                  const isSelected = selectedCardsForReading.some(sc => sc.id === card.id);
                  const actualCardData = isSelected ? selectedCardsForReading.find(sc => sc.id === card.id) : card;
                  
                  return (
                    <motion.div
                      key={card.id + '-revealed-' + index}
                      initial={{ opacity: 0, y: 50, x: index === 0 ? 0 : -60 }}
                      animate={{ 
                        opacity: 1, 
                        y: isSelected ? -20 : 0, 
                        x: 0,
                        scale: isSelected ? 1.05 : 1,
                      }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleCardSelectFromSpread(card, index)}
                      className={`w-32 h-48 md:w-36 md:h-56 shrink-0 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:z-20 ${isSelected ? 'z-10' : 'z-0'}`}
                      style={{ 
                        marginLeft: index > 0 ? (window.innerWidth < 640 ? '-80px' : '-100px') : '0px', // Overlap
                       }} 
                    >
                      <Card className={`relative w-full h-full overflow-hidden shadow-lg rounded-md ${isSelected ? 'ring-4 ring-accent shadow-2xl' : 'shadow-md'}`}>
                        <AnimatePresence initial={false}>
                          {(isSelected && actualCardData?.isFaceUp) || card.isFaceUp ? (
                            <motion.div
                              key="front"
                              initial={{ rotateY: card.isFaceUp && !isSelected ? 0 : -90, opacity: 0 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: 90, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className={`absolute inset-0 ${actualCardData?.isReversed ? 'transform rotate-180' : ''}`}
                            >
                              <Image src={actualCardData!.imageSrc} alt={actualCardData!.name} layout="fill" objectFit="cover" data-ai-hint={actualCardData!.dataAiHint} className="rounded-md" />
                               <div className={`absolute bottom-1 left-1 right-1 p-1 bg-black/60 text-white text-center text-[10px] rounded-b-md ${actualCardData?.isReversed ? 'transform rotate-180' : ''}`}>
                                {actualCardData!.name.split('(')[0]}
                                {actualCardData?.isReversed && " (역)"}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="back"
                              initial={{ rotateY: 0, opacity: 1 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: -90, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="absolute inset-0"
                            >
                              <Image src={CARD_BACK_IMAGE} alt="카드 뒷면" layout="fill" objectFit="cover" className="rounded-md"/>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCardsForReading.length > 0 && (stage === 'cards_selected' || stage === 'interpretation_ready' || stage === 'interpreting') && (
        <Card className="shadow-xl border-primary/10 animate-fade-in mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">선택된 카드 ({selectedCardsForReading.length}/{selectedSpread.numCards})</CardTitle>
            <CardDescription>아래 카드들을 바탕으로 AI 해석을 진행합니다.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className={`grid gap-4 ${selectedCardsForReading.length === 1 ? 'max-w-xs mx-auto' : `grid-cols-2 sm:grid-cols-3 md:grid-cols-${Math.min(selectedCardsForReading.length, 5)}`}`}>
              {selectedCardsForReading.map((card, index) => (
                <motion.div
                  key={card.id + '-selected-' + index}
                  layout // Animate layout changes
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="transform-gpu"
                >
                  <Card className={`overflow-hidden shadow-lg h-full flex flex-col rounded-lg ${card.isReversed ? 'border-2 border-red-400 bg-red-500/5' : 'border-transparent'}`}>
                    <div className={`relative aspect-[3/5] w-full overflow-hidden ${card.isReversed ? 'transform rotate-180' : ''}`}>
                      <Image src={card.imageSrc} alt={card.name} width={300} height={500} className="object-cover w-full h-full rounded-t-lg" data-ai-hint={card.dataAiHint} />
                    </div>
                    <CardHeader className={`p-2 text-center ${card.isReversed ? 'transform rotate-180' : ''}`}>
                      <CardTitle className="font-headline text-sm sm:text-base text-primary truncate">{card.name.split('(')[0]}</CardTitle>
                      {selectedSpread.positions?.[index] && <p className="text-xs text-muted-foreground">{selectedSpread.positions[index]}</p>}
                      {card.isReversed && <CardDescription className="text-xs text-red-500">(역방향)</CardDescription>}
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(stage === 'interpreting' || stage === 'interpretation_ready') && (
        <Card className="shadow-xl border-primary/10 animate-fade-in mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Sparkles className="mr-2 h-7 w-7 text-accent" /> AI 해석
            </CardTitle>
             {stage === 'interpreting' && <CardDescription>AI가 당신을 위해 지혜를 엮고 있습니다...</CardDescription>}
             {stage === 'interpretation_ready' && interpretation && <CardDescription>카드와 AI가 당신의 질문에 대해 제안하는 내용입니다.</CardDescription>}
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary prose-p:text-foreground/80 prose-strong:text-primary/90 min-h-[150px]">
            {stage === 'interpreting' && !displayedInterpretation && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap' }} className="text-base leading-relaxed">{displayedInterpretation}</div>
            {stage === 'interpretation_ready' && !interpretation && !displayedInterpretation && (
                <p className="text-muted-foreground">아직 해석이 없습니다. 위의 "AI 해석 받기" 버튼을 클릭하세요.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

