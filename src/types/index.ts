
export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export type TarotCard = {
  id: string; 
  name: string;
  suit: Suit;
  number?: string | number; 
  imageSrc: string; 
  dataAiHint: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  meaningUpright: string;
  meaningReversed: string;
  description?: string; 
  fortuneTelling?: string[];
  questionsToAsk?: string[];
  astrology?: string;
  affirmation?: string;
  element?: string;
  isReversed?: boolean; // Added for card orientation during reading
};

export type TarotInterpretationMethod = 
  | "전통 RWS" 
  | "토트 기반"
  | "심리학적 원형"
  | "영적 안내"
  | "행동 지향적 조언"
  | "그림자 작업 초점";

export const interpretationMethods: TarotInterpretationMethod[] = [
  "전통 RWS",
  "토트 기반",
  "심리학적 원형",
  "영적 안내",
  "행동 지향적 조언",
  "그림자 작업 초점"
];

export type SpreadConfiguration = {
  id: string;
  name: string; // 멋있는 이름
  description: string; // 간단한 설명
  numCards: number;
  positions?: string[]; // 각 카드 위치의 의미 (예: 과거, 현재, 미래)
};

// 전통적인 카드 스프레드 방법들
export const tarotSpreads: SpreadConfiguration[] = [
  { id: 'single-spark', name: '한 장의 불꽃 (Single Spark)', description: '빠른 통찰을 위한 단일 카드입니다.', numCards: 1, positions: ['현재 상황/조언'] },
  { id: 'trinity-view', name: '삼위일체 조망 (Trinity View)', description: '과거, 현재, 미래를 아우르는 세 장의 카드입니다.', numCards: 3, positions: ['과거', '현재', '미래'] },
  { id: 'pentagram-insight', name: '오각별 통찰 (Pentagram Insight)', description: '상황의 여러 측면을 살펴보는 다섯 장의 카드입니다.', numCards: 5, positions: ['상황의 핵심', '내적 영향', '외적 영향', '극복할 과제', '잠재적 결과'] },
  { id: 'seven-stars-path', name: '일곱 별의 길 (Seven Stars Path)', description: '더 깊은 분석을 위한 일곱 장의 카드입니다.', numCards: 7, positions: ['현재 상황', '즉각적 과거', '가까운 미래', '핵심 문제', '주변 환경', '희망과 두려움', '최종 결과'] },
  { id: 'nine-realms-journey', name: '아홉 영역의 여정 (Nine Realms Journey)', description: '포괄적인 이해를 위한 아홉 장의 카드입니다.', numCards: 9 }, // positions는 생략하거나 더 상세하게 추가 가능
  { id: 'celtic-cross-wisdom', name: '켈틱 크로스 지혜 (Celtic Cross Wisdom)', description: '가장 전통적이고 심층적인 열 장의 카드 스프레드입니다.', numCards: 10, positions: ['현재 상황', '도전 과제', '과거 기반', '가까운 미래', '목표/의식', '무의식적 영향', '조언', '외부 영향', '희망과 두려움', '최종 결과'] },
];
