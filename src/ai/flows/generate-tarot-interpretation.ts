'use server';

/**
 * @fileOverview Generates an AI-powered interpretation of a tarot card spread based on a user's question.
 *
 * - generateTarotInterpretation - A function that handles the tarot card interpretation process.
 * - GenerateTarotInterpretationInput - The input type for the generateTarotInterpretation function.
 * - GenerateTarotInterpretationOutput - The return type for the generateTarotInterpretation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { firestore } from '@/lib/firebase/admin'; // Import Firestore admin instance
import type { SafetySetting } from '@genkit-ai/googleai'; // Import SafetySetting type

const GenerateTarotInterpretationInputSchema = z.object({
  question: z.string().describe('The user provided question for the tarot reading.'),
  cardSpread: z.string().describe('The selected tarot card spread (e.g., 1-card, 3-card, custom).'),
  cardInterpretations: z.string().describe('The interpretation of each card in the spread.'),
});
export type GenerateTarotInterpretationInput = z.infer<typeof GenerateTarotInterpretationInputSchema>;

const GenerateTarotInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the tarot card spread.'),
});
export type GenerateTarotInterpretationOutput = z.infer<typeof GenerateTarotInterpretationOutputSchema>;

// Default prompt template and safety settings if Firestore is unavailable or data is missing
const DEFAULT_PROMPT_TEMPLATE = `You are a tarot card expert. Provide an insightful interpretation of the card spread in relation to the user's question.

  Question: {{{question}}}
  Card Spread: {{{cardSpread}}}
  Card Interpretations: {{{cardInterpretations}}}

  Interpretation: `;

const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];


export async function generateTarotInterpretation(input: GenerateTarotInterpretationInput): Promise<GenerateTarotInterpretationOutput> {
  return generateTarotInterpretationFlow(input);
}

const generateTarotInterpretationFlow = ai.defineFlow(
  {
    name: 'generateTarotInterpretationFlow',
    inputSchema: GenerateTarotInterpretationInputSchema,
    outputSchema: GenerateTarotInterpretationOutputSchema,
  },
  async (input: GenerateTarotInterpretationInput) => {
    let promptTemplate = DEFAULT_PROMPT_TEMPLATE;
    let safetySettings: SafetySetting[] = [...DEFAULT_SAFETY_SETTINGS]; // Use a copy

    try {
      const configDocRef = firestore.collection('aiConfiguration').doc('promptSettings');
      const configDoc = await configDocRef.get();

      if (configDoc.exists) {
        const configData = configDoc.data();
        if (configData?.promptTemplate && typeof configData.promptTemplate === 'string') {
          promptTemplate = configData.promptTemplate;
        }
        if (configData?.safetySettings && Array.isArray(configData.safetySettings)) {
           // Basic validation for safety settings structure
          const validSafetySettings = configData.safetySettings.filter(
            (setting: any) => typeof setting.category === 'string' && typeof setting.threshold === 'string'
          );
          if (validSafetySettings.length > 0) {
            safetySettings = validSafetySettings as SafetySetting[];
          }
        }
        console.log("AI 프롬프트 설정을 Firestore에서 불러왔습니다.");
      } else {
        console.log("Firestore에서 AI 프롬프트 설정을 찾을 수 없습니다. 기본값을 사용합니다.");
      }
    } catch (error) {
      console.error("Firestore에서 AI 프롬프트 설정을 불러오는 중 오류 발생. 기본값을 사용합니다:", error);
    }
    
    // Dynamically define the prompt with loaded or default settings
    const dynamicPrompt = ai.definePrompt({
      name: 'dynamicGenerateTarotInterpretationPrompt', // Unique name for this dynamic instance
      input: { schema: GenerateTarotInterpretationInputSchema },
      output: { schema: GenerateTarotInterpretationOutputSchema },
      prompt: promptTemplate,
      config: {
        safetySettings: safetySettings.length > 0 ? safetySettings : undefined,
      },
    });

    const { output } = await dynamicPrompt(input);
    return output!;
  }
);
