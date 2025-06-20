
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
  isReversed?: boolean; 
  isFaceUp?: boolean; 
};

export type TarotInterpretationMethod =
  | "전통 RWS"
  | "토트 기반"
  | "심리학적 원형"
  | "영적 안내"
  | "행동 지향적 조언"
  | "그림자 작업 초점";

export type InterpretationStyleInfo = {
  id: TarotInterpretationMethod;
  name: string;
  description: string;
};

export const tarotInterpretationStyles: InterpretationStyleInfo[] = [
  {
    id: "전통 RWS",
    name: "전통 라이더-웨이트-스미스 (RWS)",
    description: "고전 RWS 덱 상징 기반 해석.",
  },
  {
    id: "토트 기반",
    name: "토트 기반",
    description: "토트 덱 비교(秘敎) 및 점성학적 탐구.",
  },
  {
    id: "심리학적 원형",
    name: "심리학적 원형",
    description: "칼 융 심리학 기반 원형 상징 해석.",
  },
  {
    id: "영적 안내",
    name: "영적 안내",
    description: "영적 성장과 자기 성찰을 위한 메시지.",
  },
  {
    id: "행동 지향적 조언",
    name: "행동 지향적 조언",
    description: "실질적이고 구체적인 행동 방침 조언.",
  },
  {
    id: "그림자 작업 초점",
    name: "그림자 작업 초점",
    description: "내면의 숨겨진 그림자 탐색 및 통합.",
  },
];


export type SpreadConfiguration = {
  id: string;
  name: string; 
  description: string; 
  numCards: number;
  positions?: string[]; 
};

export const tarotSpreads: SpreadConfiguration[] = [
  { id: 'single-spark', name: '한 장의 불꽃 (Single Spark)', description: '빠른 통찰을 위한 단일 카드입니다.', numCards: 1, positions: ['현재 상황/조언'] },
  { id: 'trinity-view', name: '삼위일체 조망 (Trinity View)', description: '과거, 현재, 미래를 아우르는 세 장의 카드입니다.', numCards: 3, positions: ['과거', '현재', '미래'] },
  { id: 'pentagram-insight', name: '오각별 통찰 (Pentagram Insight)', description: '상황의 여러 측면을 살펴보는 다섯 장의 카드입니다.', numCards: 5, positions: ['상황의 핵심', '내적 영향', '외적 영향', '극복할 과제', '잠재적 결과'] },
  { id: 'seven-stars-path', name: '일곱 별의 길 (Seven Stars Path)', description: '더 깊은 분석을 위한 일곱 장의 카드입니다.', numCards: 7, positions: ['현재 상황', '즉각적 과거', '가까운 미래', '핵심 문제', '주변 환경', '희망과 두려움', '최종 결과'] },
  { id: 'nine-realms-journey', name: '아홉 영역의 여정 (Nine Realms Journey)', description: '포괄적인 이해를 위한 아홉 장의 카드입니다.', numCards: 9 },
  { id: 'celtic-cross-wisdom', name: '켈틱 크로스 지혜 (Celtic Cross Wisdom)', description: '가장 전통적이고 심층적인 열 장의 카드 스프레드입니다.', numCards: 10, positions: ['현재 상황', '도전 과제', '과거 기반', '가까운 미래', '목표/의식', '무의식적 영향', '조언', '외부 영향', '희망과 두려움', '최종 결과'] },
];

export type BlogPost = {
  id: string; 
  title: string;
  date: string; 
  excerpt: string;
  imageSrc: string;
  dataAiHint: string;
  slug: string;
  content: string;
  author?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date; // Added for sitemap and JSON-LD
};
