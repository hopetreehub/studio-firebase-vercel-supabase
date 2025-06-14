
import type { TarotCard } from '@/types';

// 참고: 전체 78장의 카드 데이터와 한국어 번역이 필요합니다.
// 아래는 예시이며, 이미지 경로는 public/images/tarot/ 폴더에 맞게 설정해야 합니다.
export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    id: 'major-0',
    name: 'The Fool (광대)',
    suit: 'major',
    number: 0,
    imageSrc: '/images/tarot/00-TheFool.jpg',
    dataAiHint: 'fool 광대',
    keywordsUpright: ['시작', '순수', '자발성', '자유로운 영혼', '믿음', '독창성'],
    keywordsReversed: ['순진함', '어리석음', '무모함', '위험 감수', '주저함', '우둔함'],
    meaningUpright: '광대는 새로운 시작, 미래에 대한 믿음, 미숙함, 예측 불가능함, 초심자의 행운, 즉흥성, 우주에 대한 믿음을 나타냅니다.',
    meaningReversed: '순진하거나 잘 속아 넘어감. 불필요한 위험을 감수하거나 무모함. 자신의 행동 결과에 대한 이해 부족. 큰 그림을 보지 못함.',
    description: '광대는 경험을 찾아 나서는 영혼입니다. 그는 우리 내면의 이성을 초월한 신비로운 영리함, 세상의 내적 작용에 동조하는 어린아이 같은 능력을 나타냅니다.',
    fortuneTelling: ['새로운 모험이 눈앞에 있습니다.', '열린 마음으로 미지의 세계를 받아들이세요.'],
    questionsToAsk: ['나는 어떤 새로운 여정을 시작하고 있는가?', '나는 믿음의 도약을 할 준비가 되었는가?'],
    astrology: '천왕성',
    affirmation: '나는 열린 마음과 정신으로 새로운 시작을 받아들인다.',
    element: '공기'
  },
  {
    id: 'major-1',
    name: 'The Magician (마법사)',
    suit: 'major',
    number: 1,
    imageSrc: '/images/tarot/01-TheMagician.jpg',
    dataAiHint: 'magician 마법사',
    keywordsUpright: ['현현', '수완', '힘', '영감받은 행동', '기술', '집중'],
    keywordsReversed: ['조작', '부실한 계획', '미개발된 재능', '기만', '환상'],
    meaningUpright: '마법사는 영적 영역과 물질적 영역 사이의 통로입니다. 그는 자신의 욕망을 현실로 만들 도구, 자원, 에너지를 가지고 있습니다. 이 카드는 당신의 잠재력을 최대한 발휘하고 영감받은 행동을 취할 때임을 알립니다.',
    meaningReversed: '목표와 행동 사이에 단절을 경험하고 있을 수 있습니다. 조작이 작용하고 있거나 기술을 제대로 활용하지 못하고 있을 수 있습니다. 더 효과적으로 집중하고 계획할 필요가 있습니다.',
    description: '마법사는 현현의 달인이며, 의지력과 아이디어를 현실로 바꾸는 능력의 상징입니다. 그는 우리에게 자신만의 세계를 창조할 힘이 있음을 상기시킵니다.',
    fortuneTelling: ['당신은 원하는 것을 현실로 만들 힘이 있습니다.', '숙련된 사람이 당신의 삶에 나타날 것입니다.'],
    questionsToAsk: ['나는 무엇을 현현시키려 하는가?', '목표 달성을 위해 어떤 기술을 활용해야 하는가?'],
    astrology: '수성',
    affirmation: '나는 나의 욕망을 현현시키고 원하는 현실을 창조할 힘이 있다.',
    element: '공기'
  },
  {
    id: 'major-2',
    name: 'The High Priestess (여사제)',
    suit: 'major',
    number: 2,
    imageSrc: '/images/tarot/02-TheHighPriestess.jpg',
    dataAiHint: 'priestess 여사제',
    keywordsUpright: ['직관', '무의식', '신비', '비밀', '지혜', '내면의 목소리'],
    keywordsReversed: ['억압된 직관', '비밀 유지', '표면적 지식', '혼란', '침묵'],
    meaningUpright: '여사제는 직관, 잠재의식, 신성한 여성성, 숨겨진 지식을 상징합니다. 이 카드는 당신의 내면의 목소리에 귀 기울이고, 꿈과 상징에 주의를 기울이며, 아직 드러나지 않은 것을 탐구하라고 격려합니다.',
    meaningReversed: '직관을 무시하거나 내면의 지혜와 단절되어 있을 수 있습니다. 비밀이나 숨겨진 정보가 문제를 일으킬 수 있으며, 피상적인 이해에 만족하고 있을 수 있습니다. 더 깊이 성찰해야 할 때입니다.',
    description: '여사제는 베일 뒤에 숨겨진 지혜의 수호자입니다. 그녀는 직관의 힘과 잠재의식의 깊이를 나타냅니다.',
    fortuneTelling: ['당신의 직관을 믿으세요, 그것이 당신을 진실로 인도할 것입니다.', '숨겨진 정보가 곧 드러날 수 있습니다.'],
    questionsToAsk: ['나의 직관이 무엇을 말하고 있는가?', '내가 무시하고 있는 내면의 목소리는 무엇인가?'],
    astrology: '달',
    affirmation: '나는 나의 직관을 신뢰하고 내면의 지혜에 귀 기울인다.',
    element: '물'
  },
  // ... (다른 메이저 아르카나 카드 추가 필요) ...

  // Wands
  {
    id: 'wands-ace',
    name: 'Ace of Wands (완드 에이스)',
    suit: 'wands',
    number: 'ace',
    imageSrc: '/images/tarot/Wands01.jpg',
    dataAiHint: 'ace wands',
    keywordsUpright: ['영감', '새로운 기회', '성장', '잠재력', '창의성', '행동'],
    keywordsReversed: ['지연', '동기 부족', '망설임', '창의적 막힘', '잘못된 시작'],
    meaningUpright: '완드 에이스는 새로운 영감의 불꽃, 창의적 에너지의 급증, 또는 흥미로운 새 사업의 시작을 나타냅니다. 아이디어를 행동으로 옮기고 성장을 위한 새로운 기회를 받아들이도록 격려합니다.',
    meaningReversed: '영감을 받지 못하거나 창의적인 막힘에 직면하고 있을 수 있습니다. 지연이나 동기 부족이 진행을 방해할 수 있습니다. 열정을 재평가하고 새로운 영감의 원천을 찾아야 할 때일 수 있습니다.',
    element: '불'
  },
  // ... (다른 완드 카드 추가 필요) ...

  // Cups
  {
    id: 'cups-ace',
    name: 'Ace of Cups (컵 에이스)',
    suit: 'cups',
    number: 'ace',
    imageSrc: '/images/tarot/Cups01.jpg',
    dataAiHint: 'ace cups',
    keywordsUpright: ['사랑', '새로운 관계', '연민', '창의성', '감정적 시작', '기쁨'],
    keywordsReversed: ['감정적 상실', '막힌 창의성', '공허함', '억압된 감정'],
    meaningUpright: '컵 에이스는 종종 사랑, 연민 또는 기쁨의 형태로 새로운 감정적 시작을 의미합니다. 감정의 분출과 타인 또는 자신의 창조적 정신과의 깊은 연결을 나타냅니다.',
    meaningReversed: '감정적 막힘이나 공허감을 경험하고 있을 수 있습니다. 이 카드는 억압된 감정이나 새로운 관계 형성에 어려움을 나타낼 수 있습니다. 마음을 열고 감정적 상처를 다루라는 부름입니다.',
    element: '물'
  },
  // ... (다른 컵 카드 추가 필요) ...

  // Swords
  {
    id: 'swords-ace',
    name: 'Ace of Swords (검 에이스)',
    suit: 'swords',
    number: 'ace',
    imageSrc: '/images/tarot/Swords01.jpg',
    dataAiHint: 'ace swords',
    keywordsUpright: ['돌파구', '새로운 아이디어', '정신적 명료함', '진실', '성공', '집중'],
    keywordsReversed: ['혼란', '잘못된 정보', '명확성 부족', '정신적 막힘', '잘못된 결정'],
    meaningUpright: '검 에이스는 돌파구의 순간, 새로운 아이디어 또는 정신적 명료함의 급증을 나타냅니다. 진실, 지적 능력, 혼란을 헤치고 성공을 달성하는 능력을 의미합니다.',
    meaningReversed: '혼란, 정신적 막힘 또는 잘못된 정보를 다루고 있을 수 있습니다. 명확성 부족은 잘못된 결정으로 이어질 수 있습니다. 이 카드는 진실을 찾고 마음을 맑게 하라고 촉구합니다.',
    element: '공기'
  },
  // ... (다른 검 카드 추가 필요) ...

  // Pentacles
  {
    id: 'pentacles-ace',
    name: 'Ace of Pentacles (펜타클 에이스)',
    suit: 'pentacles',
    number: 'ace',
    imageSrc: '/images/tarot/Pentacles01.jpg',
    dataAiHint: 'ace pentacles',
    keywordsUpright: ['새로운 재정적 기회', '현현', '번영', '풍요', '안정', '새로운 사업'],
    keywordsReversed: ['잃어버린 기회', '계획 부족', '재정적 불안정', '놓친 기회', '잘못된 투자'],
    meaningUpright: '펜타클 에이스는 새로운 직업, 금전적 이익 또는 성공적인 사업과 같은 물질적 세계에서의 새로운 기회를 예고합니다. 현현, 안정, 풍요의 잠재력을 나타냅니다.',
    meaningReversed: '기회를 놓쳤거나 재정적 불안정을 경험하고 있을 수 있습니다. 이 카드는 물질적 문제에 대한 부실한 계획이나 예측 부족을 나타낼 수 있습니다. 자원에 대한 보다 현실적인 접근 방식을 요구합니다.',
    element: '흙'
  }
  // ... (다른 펜타클 카드 및 나머지 메이저 아르카나 카드 추가 필요) ...
];

export const getCardById = (id: string): TarotCard | undefined => {
  return tarotDeck.find(card => card.id === id);
};

export const suits = ['major', 'wands', 'cups', 'swords', 'pentacles'];
