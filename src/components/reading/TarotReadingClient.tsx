
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
import { WandIcon } from '@/components/icons/WandIcon';
import { CupIcon } from '@/components/icons/CupIcon';
import { SwordIcon } from '@/components/icons/SwordIcon';
import { PentacleIcon } from '@/components/icons/PentacleIcon';
import { Star, Sparkles, Loader2, RefreshCw, Layers, Shuffle, EyeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

type ReadingStage = 'setup' | 'shuffled' | 'spread_revealed' | 'cards_selected' | 'interpreting' | 'interpretation_ready';

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

// 카드 뒷면 이미지 경로 (public 폴더에 있어야 함)
const CARD_BACK_IMAGE = '/images/tarot/card-back.png'; // 이 이미지를 준비해주세요!

export function TarotReadingClient() {
  const [question, setQuestion] = useState<string>('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfiguration>(tarotSpreads[1]); // Default to 3-card
  const [interpretationMethod, setInterpretationMethod] = useState<TarotInterpretationMethod>(interpretationMethods[0]);
  
  const [deck, setDeck] = useState<TarotCard[]>([]); // 셔플된 덱
  const [revealedSpreadCards, setRevealedSpreadCards] = useState<TarotCard[]>([]); // 화면에 펼쳐진 카드들 (선택 전)
  const [selectedCardsForReading, setSelectedCardsForReading] = useState<TarotCard[]>([]); // 최종 선택된 카드들

  const [interpretation, setInterpretation] = useState<string>('');
  const [displayedInterpretation, setDisplayedInterpretation] = useState<string>('');
  const [stage, setStage] = useState<ReadingStage>('setup');
  
  const { toast } = useToast();
  const controls = useAnimation();
  const spreadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize deck on mount
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
  }, []);

  const handleShuffle = async () => {
    setRevealedSpreadCards([]);
    setSelectedCardsForReading([]);
    setInterpretation('');
    setDisplayedInterpretation('');

    // Simple shuffle animation
    await controls.start({ 
      x: [0, -5, 5, -5, 5, 0], 
      rotate: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.5 } 
    });
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
    setStage('shuffled');
    toast({ title: "덱 섞기 완료", description: "카드가 섞였습니다. 이제 카드를 펼쳐보세요." });
  };

  const handleRevealSpread = () => {
    if (deck.length < selectedSpread.numCards) {
      toast({ variant: 'destructive', title: '오류', description: '덱에 카드가 부족합니다. 다시 섞어주세요.' });
      return;
    }
    // For simplicity, cards are dealt face down visually, then flipped on selection
    const drawn = deck.slice(0, selectedSpread.numCards).map(card => ({
      ...card,
      // isReversed will be determined on actual selection/flip or randomly here
      isReversed: Math.random() > 0.5 
    }));
    setRevealedSpreadCards(drawn);
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
      newSelectedCards = selectedCardsForReading.filter(c => c.id !== clickedCard.id);
    } else {
      // Flip the card if it's being selected for the first time
      const cardToSelect = { ...clickedCard, isReversed: Math.random() > 0.5 }; // Or use pre-determined isReversed
      newSelectedCards = [...selectedCardsForReading, cardToSelect];
    }
    
    setSelectedCardsForReading(newSelectedCards);

    if (newSelectedCards.length === selectedSpread.numCards) {
      setStage('cards_selected');
    } else {
      setStage('spread_revealed'); // Still in selection mode
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
      setStage('cards_selected'); // Go back to selected stage
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

  return (
    <div className="space-y-8">
      {/* 설정 카드 */}
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
                  setStage('setup'); // Reset stage when spread changes
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

      {/* 컨트롤 버튼 영역 */}
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">리딩 진행</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-around gap-4 items-center">
            <Button onClick={handleShuffle} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={stage === 'interpreting'}>
                <Shuffle className="mr-2 h-5 w-5" /> 카드 섞기
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
      
      {/* 카드 덱 시각화 (셔플 애니메이션용) */}
      {stage === 'setup' && (
        <motion.div animate={controls} className="mx-auto w-32 h-48 md:w-40 md:h-60">
            <Card className="relative w-full h-full shadow-xl overflow-hidden group cursor-pointer">
                <Image src={CARD_BACK_IMAGE} alt="카드 뒷면" layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white font-bold text-lg group-hover:opacity-80 transition-opacity">덱</p>
                </div>
            </Card>
        </motion.div>
      )}


      {/* 펼쳐진 카드 영역 (선택용) */}
      {revealedSpreadCards.length > 0 && (stage === 'spread_revealed' || stage === 'cards_selected') && (
        <Card className="shadow-xl border-primary/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">펼쳐진 카드 ({selectedCardsForReading.length}/{selectedSpread.numCards} 선택됨)</CardTitle>
            <CardDescription>{selectedSpread.description} 카드를 클릭하여 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent 
            ref={spreadContainerRef} 
            className="overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-primary/10"
          >
            <div className="flex flex-nowrap gap-4 justify-start min-w-max px-2 pb-2">
              <AnimatePresence>
                {revealedSpreadCards.map((card, index) => {
                  const isSelected = selectedCardsForReading.some(sc => sc.id === card.id);
                  const actualCardInSelection = selectedCardsForReading.find(sc => sc.id === card.id) || card;
                  
                  return (
                    <motion.div
                      key={card.id + '-revealed-' + index}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleCardSelectFromSpread(card, index)}
                      className={`w-32 h-48 md:w-36 md:h-56 shrink-0 cursor-pointer transform transition-all duration-300 hover:scale-105 ${isSelected ? 'ring-4 ring-accent shadow-2xl -translate-y-2' : 'shadow-lg'}`}
                    >
                      <Card className={`relative w-full h-full overflow-hidden ${isSelected ? 'border-accent' : 'border-transparent'}`}>
                        <AnimatePresence initial={false}>
                          {isSelected ? (
                            <motion.div
                              key="front"
                              initial={{ rotateY: -90, opacity: 0 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: 90, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className={`absolute inset-0 ${actualCardInSelection.isReversed ? 'transform rotate-180' : ''}`}
                            >
                              <Image src={actualCardInSelection.imageSrc} alt={actualCardInSelection.name} layout="fill" objectFit="cover" data-ai-hint={actualCardInSelection.dataAiHint} />
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
                              <Image src={CARD_BACK_IMAGE} alt="카드 뒷면" layout="fill" objectFit="cover" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                         {isSelected && (
                          <div className={`absolute bottom-1 left-1 right-1 p-1 bg-black/50 text-white text-center text-xs rounded ${actualCardInSelection.isReversed ? 'transform rotate-180' : ''}`}>
                            {actualCardInSelection.name.split('(')[0]}
                            {actualCardInSelection.isReversed && " (역)"}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 선택된 카드 (해석 대상) */}
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
                  layoutId={`card-${card.id}`} // For potential future animation from spread
                  className="transform-gpu"
                >
                  <Card className={`overflow-hidden shadow-lg h-full flex flex-col ${card.isReversed ? 'border-red-500/50 bg-red-500/5' : 'border-transparent'}`}>
                    <div className={`relative aspect-[3/5] w-full overflow-hidden ${card.isReversed ? 'transform rotate-180' : ''}`}>
                      <Image src={card.imageSrc} alt={card.name} width={300} height={500} className="object-cover w-full h-full" data-ai-hint={card.dataAiHint} />
                    </div>
                    <CardHeader className={`p-2 text-center ${card.isReversed ? 'transform rotate-180' : ''}`}>
                      <CardTitle className="font-headline text-base text-primary truncate">{card.name.split('(')[0]}</CardTitle>
                      {selectedSpread.positions?.[index] && <p className="text-xs text-muted-foreground">{selectedSpread.positions[index]}</p>}
                      {card.isReversed && <CardDescription className="text-xs text-red-600">(역방향)</CardDescription>}
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI 해석 결과 */}
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
