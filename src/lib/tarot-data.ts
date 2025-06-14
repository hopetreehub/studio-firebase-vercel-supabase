import type { TarotCard } from '@/types';

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    id: 'major-0',
    name: 'The Fool',
    suit: 'major',
    number: 0,
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot fool',
    keywordsUpright: ['Beginnings', 'Innocence', 'Spontaneity', 'Free spirit', 'Faith', 'Originality'],
    keywordsReversed: ['Naivety', 'Folly', 'Recklessness', 'Risk-taking', 'Holding back', 'Stupidity'],
    meaningUpright: 'The Fool represents new beginnings, faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
    meaningReversed: 'Being naive or gullible. Taking unnecessary risks or being reckless. Lacking understanding of the consequences of one\'s actions. Failing to see the bigger picture.',
    description: 'The Fool is the spirit in search of experience. He represents the mystical cleverness bereft of reason within us, the childlike ability to tune into the inner workings of the world.',
    fortuneTelling: ['A new adventure is on the horizon.', 'Embrace the unknown with open arms.'],
    questionsToAsk: ['What new journey am I embarking on?', 'Am I ready to take a leap of faith?'],
    astrology: 'Uranus',
    affirmation: 'I embrace new beginnings with an open heart and mind.',
    element: 'Air'
  },
  {
    id: 'major-1',
    name: 'The Magician',
    suit: 'major',
    number: 1,
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot magician',
    keywordsUpright: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired action', 'Skill', 'Concentration'],
    keywordsReversed: ['Manipulation', 'Poor planning', 'Untapped talents', 'Deceit', 'Illusion'],
    meaningUpright: 'The Magician is the conduit between the spiritual and physical realms. He has the tools, resources and energy to make his desires manifest. This card signals a time to tap into your full potential and take inspired action.',
    meaningReversed: 'You may be experiencing a disconnect between your goals and actions. There might be manipulation at play, or you could be underutilizing your skills. A need to focus and plan more effectively.',
    description: 'The Magician is the master of manifestation, a symbol of willpower and the ability to turn ideas into reality. He reminds us that we have the power to create our own world.',
    fortuneTelling: ['You have the power to make things happen.', 'A skilled individual will enter your life.'],
    questionsToAsk: ['What am I trying to manifest?', 'What skills do I need to utilize to achieve my goals?'],
    astrology: 'Mercury',
    affirmation: 'I have the power to manifest my desires and create the reality I want.',
    element: 'Air'
  },
  // ... (The Fool and The Magician are examples. A full deck would have 78 cards.)

  // Example Wands
  {
    id: 'wands-ace',
    name: 'Ace of Wands',
    suit: 'wands',
    number: 'ace',
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot ace wands',
    keywordsUpright: ['Inspiration', 'New opportunities', 'Growth', 'Potential', 'Creativity', 'Action'],
    keywordsReversed: ['Delays', 'Lack of motivation', 'Hesitation', 'Creative blocks', 'False starts'],
    meaningUpright: 'The Ace of Wands represents a new spark of inspiration, a surge of creative energy, or the beginning of an exciting new venture. It encourages you to take action on your ideas and embrace new opportunities for growth.',
    meaningReversed: 'You may be feeling uninspired or facing creative blocks. Delays or a lack of motivation could be hindering your progress. It might be a time to reassess your passions and find a new source of inspiration.',
    element: 'Fire'
  },

  // Example Cups
  {
    id: 'cups-ace',
    name: 'Ace of Cups',
    suit: 'cups',
    number: 'ace',
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot ace cups',
    keywordsUpright: ['Love', 'New relationships', 'Compassion', 'Creativity', 'Emotional beginnings', 'Joy'],
    keywordsReversed: ['Emotional loss', 'Blocked creativity', 'Emptiness', 'Repressed emotions'],
    meaningUpright: 'The Ace of Cups signifies new emotional beginnings, often in the form of love, compassion, or joy. It represents an outpouring of emotions and a deep connection with others or with your own creative spirit.',
    meaningReversed: 'You might be experiencing emotional blockages or a sense of emptiness. This card can indicate repressed emotions or difficulties in forming new connections. It’s a call to open your heart and address emotional wounds.',
    element: 'Water'
  },

  // Example Swords
  {
    id: 'swords-ace',
    name: 'Ace of Swords',
    suit: 'swords',
    number: 'ace',
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot ace swords',
    keywordsUpright: ['Breakthroughs', 'New ideas', 'Mental clarity', 'Truth', 'Success', 'Concentration'],
    keywordsReversed: ['Confusion', 'Misinformation', 'Lack of clarity', 'Mental blocks', 'Wrong decisions'],
    meaningUpright: 'The Ace of Swords represents a moment of breakthrough, a new idea, or a surge of mental clarity. It signifies truth, intellectual power, and the ability to cut through confusion to achieve success.',
    meaningReversed: 'You may be experiencing confusion, mental blocks, or dealing with misinformation. A lack of clarity could lead to poor decisions. This card urges you to seek truth and clear your mind.',
    element: 'Air'
  },

  // Example Pentacles
  {
    id: 'pentacles-ace',
    name: 'Ace of Pentacles',
    suit: 'pentacles',
    number: 'ace',
    imageSrc: 'https://placehold.co/300x500.png',
    dataAiHint: 'tarot ace pentacles',
    keywordsUpright: ['New financial opportunity', 'Manifestation', 'Prosperity', 'Abundance', 'Stability', 'New venture'],
    keywordsReversed: ['Lost opportunity', 'Lack of planning', 'Financial instability', 'Missed chances', 'Poor investment'],
    meaningUpright: 'The Ace of Pentacles heralds new opportunities in the material world, such as a new job, financial gain, or a successful venture. It represents manifestation, stability, and the potential for abundance.',
    meaningReversed: 'You might have missed an opportunity or are experiencing financial instability. This card can indicate poor planning or a lack of foresight in material matters. It calls for a more grounded approach to your resources.',
    element: 'Earth'
  }
];

export const getCardById = (id: string): TarotCard | undefined => {
  return tarotDeck.find(card => card.id === id);
};

export const suits = ['major', 'wands', 'cups', 'swords', 'pentacles'];
