export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export type TarotCard = {
  id: string; 
  name: string;
  suit: Suit;
  number?: string | number; // e.g., 'ace', 2, 'page', 'knight', 'queen', 'king' or 0-21 for major arcana
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
  element?: string; // Fire, Water, Air, Earth
};

export type TarotInterpretationMethod = 
  | "Traditional RWS" 
  | "Thoth Inspired"
  | "Psychological Archetypes"
  | "Spiritual Guidance"
  | "Action-Oriented Advice"
  | "Shadow Work Focus";

export const interpretationMethods: TarotInterpretationMethod[] = [
  "Traditional RWS",
  "Thoth Inspired",
  "Psychological Archetypes",
  "Spiritual Guidance",
  "Action-Oriented Advice",
  "Shadow Work Focus"
];
