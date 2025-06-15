
// src/components/reading/TarotReadingClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import type {
  TarotCard,
  TarotInterpretationMethod,
  SpreadConfiguration,
} from '@/types';
import { interpretationMethods, tarotSpreads } from '@/types';
import { tarotDeck as allCards } from '@/lib/tarot-data';
import { generateTarotInterpretation } from '@/ai/flows/generate-tarot-interpretation';

import Image from 'next/image';
import {
  Sparkles,
  Loader2,
  Shuffle,
  Layers,
  // Eye as EyeIcon, // Not used
  // Star, // Not used
} from 'lucide-react';
// import { WandIcon } from '@/components/icons/WandIcon'; // Not used
// import { CupIcon } from '@/components/icons/CupIcon'; // Not used
// import { SwordIcon } from '@/components/icons/SwordIcon'; // Not used
// import { PentacleIcon } from '@/components/icons/PentacleIcon'; // Not used

import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

type ReadingStage =
  | 'setup'
  | 'deck_ready'
  | 'shuffling'
  | 'shuffled'
  | 'spread_revealed'
  | 'cards_selected'
  | 'interpreting'
  | 'interpretation_ready';

const CARD_BACK_IMAGE = '/images/tarot/back.png';
const NUM_VISUAL_CARDS_IN_STACK = 15; // Increased for thicker look
const N_ANIMATING_CARDS_FOR_SHUFFLE = 7; // Number of cards to animate during shuffle

export function TarotReadingClient() {
  const [question, setQuestion] = useState<string>('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfiguration>(
    tarotSpreads[1],
  );
  const [interpretationMethod, setInterpretationMethod] =
    useState<TarotInterpretationMethod>(interpretationMethods[0]);

  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [revealedSpreadCards, setRevealedSpreadCards] = useState<TarotCard[]>(
    [],
  );
  const [selectedCardsForReading, setSelectedCardsForReading] = useState<
    TarotCard[]
  >([]);

  const [interpretation, setInterpretation] = useState<string>('');
  const [displayedInterpretation, setDisplayedInterpretation] =
    useState<string>('');
  const [stage, setStage] = useState<ReadingStage>('setup');

  const { toast } = useToast();
  const spreadContainerRef = useRef<HTMLDivElement>(null);

  const visualCardAnimControls = Array.from({
    length: NUM_VISUAL_CARDS_IN_STACK,
  }).map(() => useAnimation());
  const [isShufflingAnimationActive, setIsShufflingAnimationActive] =
    useState(false);

  useEffect(() => {
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
    setStage('deck_ready');
    // Initialize visual cards to their stacked positions (dense stack)
    visualCardAnimControls.forEach((controls, i) => {
      controls.start(
        {
          x: i * 0.2, // Smaller offset for denser stack
          y: i * -0.2, // Smaller offset for denser stack
          zIndex: NUM_VISUAL_CARDS_IN_STACK - i,
          rotate: 0,
          opacity: 1,
        },
        { duration: 0 },
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShuffle = async () => {
    if (isShufflingAnimationActive) return;

    setIsShufflingAnimationActive(true);
    setStage('shuffling');
    setRevealedSpreadCards([]);
    setSelectedCardsForReading([]);
    setInterpretation('');
    setDisplayedInterpretation('');

    const deckX = 0;
    const pileSpacing = 100;
    const cardOffsetY = 2; // Reduced for tighter piles if animating more cards
    const shufflePileCardRotation = -8; // Slightly less rotation

    // Animate only the top N_ANIMATING_CARDS_FOR_SHUFFLE
    const animatingControls = visualCardAnimControls.slice(0, N_ANIMATING_CARDS_FOR_SHUFFLE);
    
    // Phase 1: Split animating cards to left and right piles
    const leftPileAnimatingIndices: number[] = [];
    const rightPileAnimatingIndices: number[] = [];

    for (let i = 0; i < N_ANIMATING_CARDS_FOR_SHUFFLE; i++) {
      if (i % 2 === 0) leftPileAnimatingIndices.push(i);
      else rightPileAnimatingIndices.push(i);
    }
    
    const splitPromises = [];
    leftPileAnimatingIndices.forEach((controlIndex, pileOrder) => {
      splitPromises.push(
        animatingControls[controlIndex].start({
          x: -pileSpacing,
          y: pileOrder * cardOffsetY,
          rotate: shufflePileCardRotation,
          zIndex: NUM_VISUAL_CARDS_IN_STACK + pileOrder, // Keep zIndex high
          transition: { duration: 0.25, ease: 'easeOut', delay: pileOrder * 0.04 },
        }),
      );
    });
    rightPileAnimatingIndices.forEach((controlIndex, pileOrder) => {
      splitPromises.push(
        animatingControls[controlIndex].start({
          x: pileSpacing,
          y: pileOrder * cardOffsetY,
          rotate: -shufflePileCardRotation,
          zIndex: NUM_VISUAL_CARDS_IN_STACK + pileOrder,
          transition: { duration: 0.25, ease: 'easeOut', delay: pileOrder * 0.04 + 0.02 },
        }),
      );
    });
    await Promise.all(splitPromises);
    await new Promise((r) => setTimeout(r, 150));

    // Phase 2: Interleave animating cards back to center
    const interleaveOrderDefinition: number[] = [];
    const maxPileLength = Math.max(leftPileAnimatingIndices.length, rightPileAnimatingIndices.length);
    for (let i = 0; i < maxPileLength; i++) {
      if (leftPileAnimatingIndices[i] !== undefined) interleaveOrderDefinition.push(leftPileAnimatingIndices[i]);
      if (rightPileAnimatingIndices[i] !== undefined) interleaveOrderDefinition.push(rightPileAnimatingIndices[i]);
    }

    for (let i = 0; i < interleaveOrderDefinition.length; i++) {
      const controlIndex = interleaveOrderDefinition[i];
      await animatingControls[controlIndex].start({
        x: deckX + i * 0.2, // Denser stack offset
        y: i * -0.2,        // Denser stack offset
        rotate: 0,
        zIndex: NUM_VISUAL_CARDS_IN_STACK * 2 + i, // High zIndex
        transition: { duration: 0.1, ease: 'easeIn' },
      });
    }
    await new Promise((r) => setTimeout(r, 200));

    // Actual deck shuffle
    setDeck([...allCards].sort(() => 0.5 - Math.random()));
    setStage('shuffled');

    // Reset all visual cards to initial dense stacked appearance
    visualCardAnimControls.forEach((controls, i) => {
      controls.start({
        x: i * 0.2,
        y: i * -0.2,
        zIndex: NUM_VISUAL_CARDS_IN_STACK - i,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      });
    });
    setIsShufflingAnimationActive(false);

    toast({
      title: '덱 섞기 완료',
      description: '카드가 섞였습니다. 이제 카드를 펼쳐보세요.',
    });
  };

  const handleRevealSpread = () => {
    if (deck.length === 0) { // Check if deck is empty
      toast({
        variant: 'destructive',
        title: '오류',
        description: '덱에 카드가 없습니다. 다시 섞어주세요.',
      });
      return;
    }
    // Reveal all cards from the deck, face down
    const drawnPool = [...deck].map((card) => ({ ...card, isFaceUp: false, isReversed: Math.random() > 0.5 }));
    setRevealedSpreadCards(drawnPool);
    setStage('spread_revealed');
  };

  const handleCardSelectFromSpread = (clickedSpreadCard: TarotCard, indexInSpread: number) => {
    // Find if this *position* in spread is already tied to a selected card for reading
     const existingSelectedCardIndex = selectedCardsForReading.findIndex(
      (c) => c.id === clickedSpreadCard.id // This assumes IDs are unique for this selection purpose
    );


    if (selectedCardsForReading.length >= selectedSpread.numCards && existingSelectedCardIndex === -1) {
      toast({
        description: `최대 ${selectedSpread.numCards}장까지 선택할 수 있습니다.`,
      });
      return;
    }

    let newSelectedCards: TarotCard[];

    if (existingSelectedCardIndex !== -1) {
      // Card is already selected, deselect it
      newSelectedCards = selectedCardsForReading.filter(
        (_, i) => i !== existingSelectedCardIndex,
      );
    } else {
      // Card not selected, add it. It's already face down from spread.
      // For selected area, we want it face up.
      const originalCardData = allCards.find(c => c.id === clickedSpreadCard.id);
      if (!originalCardData) {
        toast({ variant: 'destructive', title: '오류', description: '선택한 카드를 찾을 수 없습니다.'});
        return;
      }
      const cardToAdd = {
        ...originalCardData, // Get fresh data
        isReversed: clickedSpreadCard.isReversed, // Preserve reversed status from spread draw
        isFaceUp: true, // Show face up in selected area
      };
      newSelectedCards = [...selectedCardsForReading, cardToAdd];
    }

    setSelectedCardsForReading(newSelectedCards);
    setStage(
      newSelectedCards.length === selectedSpread.numCards
        ? 'cards_selected'
        : 'spread_revealed',
    );
  };


  const handleGetInterpretation = async () => {
    if (!question.trim()) {
      toast({
        variant: 'destructive',
        title: '질문 필요',
        description: '해석을 받기 전에 질문을 입력해주세요.',
      });
      return;
    }
    if (selectedCardsForReading.length !== selectedSpread.numCards) {
      toast({
        variant: 'destructive',
        title: '카드 부족',
        description: `스프레드에 필요한 ${selectedSpread.numCards}장의 카드를 모두 선택해주세요.`,
      });
      return;
    }

    setStage('interpreting');
    setDisplayedInterpretation('');

    const cardInterpretationsText = selectedCardsForReading
      .map((card, index) => {
        const orientation = card.isReversed ? '역방향' : '정방향';
        const meaning = card.isReversed
          ? card.meaningReversed
          : card.meaningUpright;
        const pos = selectedSpread.positions?.[index]
          ? ` (${selectedSpread.positions[index]})`
          : '';
        return `${card.name}${pos} (${orientation}): ${meaning.substring(
          0,
          100,
        )}...`;
      })
      .join('\n');

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
      toast({
        variant: 'destructive',
        title: '해석 오류',
        description: 'AI 해석을 생성하는 데 실패했습니다.',
      });
      setStage('cards_selected');
    }
  };

  useEffect(() => {
    if (interpretation && stage === 'interpretation_ready') {
      let index = 0;
      setDisplayedInterpretation('');
      const intervalId = setInterval(() => {
        setDisplayedInterpretation((prev) => prev + interpretation[index]);
        index++;
        if (index === interpretation.length) clearInterval(intervalId);
      }, 25);
      return () => clearInterval(intervalId);
    }
  }, [interpretation, stage]);

  const cardStack = (
    <div
      className="relative mx-auto h-56 w-36 cursor-pointer group md:h-60 md:w-40"
      onClick={
        (stage === 'deck_ready' || stage === 'shuffled') &&
        !isShufflingAnimationActive
          ? handleShuffle
          : undefined
      }
      aria-disabled={isShufflingAnimationActive}
    >
      {visualCardAnimControls.map((controls, i) => (
        <motion.div
          key={`visual-card-${i}`}
          className="absolute h-full w-full overflow-hidden rounded-lg border-2 border-primary/30 shadow-xl"
          animate={controls}
          initial={{
            x: i * 0.2, // Dense stack
            y: i * -0.2, // Dense stack
            zIndex: NUM_VISUAL_CARDS_IN_STACK - i,
            opacity: 1,
            rotate: 0,
          }}
        >
          <Image
            src={CARD_BACK_IMAGE}
            alt="카드 뒷면 뭉치"
            fill
            sizes="(max-width: 768px) 144px, 160px" // Adjusted for w-36/w-40
            className="object-cover"
            priority={i < N_ANIMATING_CARDS_FOR_SHUFFLE} // Prioritize animating cards
          />
        </motion.div>
      ))}
      {(stage === 'deck_ready' || stage === 'shuffled') &&
        !isShufflingAnimationActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
            <p className="text-xl font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              덱 (섞기)
            </p>
          </div>
        )}
      {stage === 'shuffling' && isShufflingAnimationActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="border-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">
            타로 리딩 설정
          </CardTitle>
          <CardDescription>
            리딩 환경을 설정하고 질문을 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="question"
              className="text-lg font-semibold text-foreground/90"
            >
              당신의 질문:
            </Label>
            <Textarea
              id="question"
              placeholder="카드에게 무엇을 묻고 싶나요? 예: 저의 현재 연애운은 어떤가요?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] bg-background/70 text-base"
              disabled={isShufflingAnimationActive}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="spread-type"
                className="text-lg font-semibold text-foreground/90"
              >
                스프레드 선택:
              </Label>
              <Select
                value={selectedSpread.id}
                onValueChange={(value) => {
                  const newSpread =
                    tarotSpreads.find((s) => s.id === value) ||
                    tarotSpreads[0];
                  setSelectedSpread(newSpread);
                  setStage('deck_ready');
                  setRevealedSpreadCards([]);
                  setSelectedCardsForReading([]);
                }}
                disabled={isShufflingAnimationActive || stage === 'shuffling'}
              >
                <SelectTrigger id="spread-type" className="h-12 text-base">
                  <SelectValue placeholder="스프레드 선택" />
                </SelectTrigger>
                <SelectContent>
                  {tarotSpreads.map((spread) => (
                    <SelectItem key={spread.id} value={spread.id}>
                      {spread.name} ({spread.numCards}장)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="interpretation-method"
                className="text-lg font-semibold text-foreground/90"
              >
                해석 스타일:
              </Label>
              <Select
                value={interpretationMethod}
                onValueChange={(value) =>
                  setInterpretationMethod(value as TarotInterpretationMethod)
                }
                disabled={isShufflingAnimationActive || stage === 'shuffling'}
              >
                <SelectTrigger
                  id="interpretation-method"
                  className="h-12 text-base"
                >
                  <SelectValue placeholder="해석 스타일 선택" />
                </SelectTrigger>
                <SelectContent>
                  {interpretationMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            리딩 진행
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-around gap-4 sm:flex-row">
          <Button
            onClick={handleShuffle}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            disabled={
              isShufflingAnimationActive || stage === 'interpreting'
            }
          >
            {isShufflingAnimationActive || stage === 'shuffling' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Shuffle className="mr-2 h-5 w-5" />
            )}
            {isShufflingAnimationActive || stage === 'shuffling'
              ? '섞는 중...'
              : '카드 섞기'}
          </Button>
          <Button
            onClick={handleRevealSpread}
            disabled={isShufflingAnimationActive || stage !== 'shuffled'}
            className="w-full sm:w-auto"
          >
            <Layers className="mr-2 h-5 w-5" />
            카드 펼치기
          </Button>
          <Button
            onClick={handleGetInterpretation}
            disabled={
              isShufflingAnimationActive ||
              (stage !== 'cards_selected' && stage !== 'interpretation_ready')
            }
            className="w-full bg-accent px-6 py-3 text-lg text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            {stage === 'interpreting' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {stage === 'interpreting' ? '해석 중...' : 'AI 해석 받기'}
          </Button>
        </CardContent>
      </Card>

      {(stage === 'deck_ready' ||
        stage === 'shuffled' ||
        stage === 'shuffling') &&
        !revealedSpreadCards.length && (
          <div className="my-8 flex justify-center">{cardStack}</div>
        )}

      {revealedSpreadCards.length > 0 &&
        (stage === 'spread_revealed' || stage === 'cards_selected') && (
          <Card className="border-primary/10 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                펼쳐진 카드 ({selectedCardsForReading.length}/
                {selectedSpread.numCards} 선택됨)
              </CardTitle>
              <CardDescription>
                {selectedSpread.description} 카드를 클릭하여{' '}
                {selectedSpread.numCards}장 선택하세요.
              </CardDescription>
            </CardHeader>
            <CardContent
              ref={spreadContainerRef}
              className="scrollbar-track-primary/10 scrollbar-thumb-primary/50 scrollbar-thin bg-primary/5 rounded-lg px-2 pb-2 pt-6 overflow-x-auto"
            >
              <div className="flex min-w-max items-start justify-start px-2 pb-4 h-[260px] sm:h-[280px]">
                <AnimatePresence>
                  {revealedSpreadCards.map((cardInSpread, index) => {
                    const isSelected = selectedCardsForReading.some(
                      (sc) => sc.id === cardInSpread.id 
                    );

                    return (
                      <motion.div
                        key={`${cardInSpread.id}-revealed-${index}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{
                          opacity: 1,
                          y: isSelected ? -15 : 0,
                          scale: isSelected ? 1.05 : 1,
                          zIndex: isSelected ? 10 : 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -50,
                          scale: 0.8,
                          zIndex: 0,
                        }}
                        transition={{ duration: 0.3, delay: index * 0.01 }} // Reduced delay for many cards
                        onClick={() => handleCardSelectFromSpread(cardInSpread, index)}
                        // Adjusted width and negative margin for more overlap with many cards
                        className="transform transition-all duration-200 hover:scale-105 hover:z-20 w-32 shrink-0 cursor-pointer md:w-32 -mr-28"
                      >
                        <motion.div
                          className={`relative aspect-[3/5] w-full overflow-hidden rounded-lg shadow-lg transition-all duration-200 ease-in-out ${
                            isSelected
                              ? 'ring-2 ring-accent ring-offset-1 ring-offset-background'
                              : 'border border-primary/20'
                          }`}
                        >
                          <Image
                            src={CARD_BACK_IMAGE} // Always show back for spread cards
                            alt={`카드 ${index + 1} 뒷면`}
                            fill
                            sizes="128px" // w-32 is 128px
                            className="object-cover rounded-lg"
                          />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        )}

      {selectedCardsForReading.length > 0 &&
        (stage === 'cards_selected' ||
          stage === 'interpretation_ready' ||
          stage === 'interpreting') && (
          <Card className="border-primary/10 shadow-xl animate-fade-in mt-8">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                선택된 카드 ({selectedCardsForReading.length}/
                {selectedSpread.numCards})
              </CardTitle>
              <CardDescription>
                아래 카드들을 바탕으로 AI 해석을 진행합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`grid gap-4 ${
                  selectedCardsForReading.length === 1
                    ? 'mx-auto max-w-xs'
                    : `grid-cols-2 sm:grid-cols-3 md:grid-cols-${Math.min(
                        selectedCardsForReading.length,
                        5,
                      )}`
                }`}
              >
                {selectedCardsForReading.map((card, index) => (
                  <motion.div
                    key={`${card.id}-selected-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="transform-gpu"
                  >
                    <div
                      className={`flex h-full flex-col overflow-hidden rounded-lg shadow-lg ${
                        card.isReversed
                          ? 'border-2 border-red-400 bg-red-500/5'
                          : 'border-transparent'
                      }`}
                    >
                      <div
                        className={`relative aspect-[3/5] w-full overflow-hidden ${
                          card.isReversed ? 'rotate-180 transform' : ''
                        }`}
                      >
                        <Image
                          src={card.imageSrc} // Show front for selected cards
                          alt={card.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                          className="h-full w-full object-cover rounded-t-lg"
                          data-ai-hint={card.dataAiHint}
                        />
                      </div>
                      <div
                        className={`p-2 text-center ${
                          card.isReversed ? 'rotate-180 transform' : ''
                        }`}
                      >
                        <h3 className="font-headline truncate text-sm text-primary sm:text-base">
                          {card.name.split('(')[0]}
                        </h3>
                        {selectedSpread.positions?.[index] && (
                          <p className="text-xs text-muted-foreground">
                            {selectedSpread.positions[index]}
                          </p>
                        )}
                        {card.isReversed && (
                          <p className="text-xs text-red-500">(역방향)</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {(stage === 'interpreting' || stage === 'interpretation_ready') && (
        <Card className="border-primary/10 shadow-xl animate-fade-in mt-8">
          <CardHeader>
            <CardTitle className="font-headline flex items-center text-3xl text-primary">
              <Sparkles className="mr-2 h-7 w-7 text-accent" />
              AI 해석
            </CardTitle>
            {stage === 'interpreting' && (
              <CardDescription>
                AI가 당신을 위해 지혜를 엮고 있습니다...
              </CardDescription>
            )}
            {stage === 'interpretation_ready' && interpretation && (
              <CardDescription>
                카드와 AI가 당신의 질문에 대해 제안하는 내용입니다.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="prose min-h-[150px] max-w-none prose-lg prose-headings:font-headline prose-headings:text-primary prose-p:text-foreground/80 prose-strong:text-primary/90">
            {stage === 'interpreting' && !displayedInterpretation && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
              </div>
            )}
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className="text-base leading-relaxed"
            >
              {displayedInterpretation}
            </div>
            {stage === 'interpretation_ready' &&
              !interpretation &&
              !displayedInterpretation && (
                <p className="text-muted-foreground">
                  아직 해석이 없습니다. 위의 &quot;AI 해석 받기&quot; 버튼을
                  클릭하세요.
                </p>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
