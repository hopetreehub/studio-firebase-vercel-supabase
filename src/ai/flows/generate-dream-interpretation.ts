
'use server';

/**
 * @fileOverview Generates an AI-powered interpretation of a user's dream.
 *
 * - generateDreamInterpretation - A function that handles the dream interpretation process.
 * - GenerateDreamInterpretationInput - The input type for the function.
 * - GenerateDreamInterpretationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { firestore } from '@/lib/firebase/admin';
import type { SafetySetting } from '@genkit-ai/googleai';

const GenerateDreamInterpretationInputSchema = z.object({
  dreamDescription: z.string().describe("The user's description of their dream."),
});
export type GenerateDreamInterpretationInput = z.infer<typeof GenerateDreamInterpretationInputSchema>;

const GenerateDreamInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the dream.'),
});
export type GenerateDreamInterpretationOutput = z.infer<typeof GenerateDreamInterpretationOutputSchema>;

const DEFAULT_PROMPT_TEMPLATE = `[SYSTEM INSTRUCTIONS START]
You are a wise and insightful dream interpreter, drawing upon psychological, symbolic, and spiritual traditions. Your primary goal is to provide a comprehensive, balanced, and empowering interpretation of the user's dream.

YOUR ENTIRE RESPONSE MUST BE IN KOREAN.
YOUR RESPONSE MUST USE MARKDOWN for clear formatting. Use headings (e.g., "## 주요 상징 분석"), bullet points, and bold text to structure the interpretation.

RESPONSE STRUCTURE:
1.  **## 꿈의 핵심 요약 (Core Dream Summary):** Briefly summarize the main events and feelings of the dream.
2.  **## 주요 상징 분석 (Key Symbol Analysis):** Identify the key symbols in the dream (e.g., mountains, jewels, animals) and explain their common psychological and spiritual meanings.
3.  **## 심리적 해석 (Psychological Interpretation):** Interpret the dream from a psychological perspective. What might this dream reflect about the user's current emotional state, subconscious thoughts, challenges, or desires?
4.  **## 종합적인 조언 (Integrative Advice):** Synthesize the analysis into practical, encouraging advice. What message is the subconscious trying to send? How can the user apply this insight to their waking life for growth and self-understanding?

[USER'S DREAM DESCRIPTION]
{{{dreamDescription}}}
[END USER'S DREAM DESCRIPTION]

Now, please provide the interpretation based on the structure above.
[SYSTEM INSTRUCTIONS END]
`;

const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

export async function generateDreamInterpretation(input: GenerateDreamInterpretationInput): Promise<GenerateDreamInterpretationOutput> {
  return generateDreamInterpretationFlow(input);
}

const generateDreamInterpretationFlow = ai.defineFlow(
  {
    name: 'generateDreamInterpretationFlow',
    inputSchema: GenerateDreamInterpretationInputSchema,
    outputSchema: GenerateDreamInterpretationOutputSchema,
  },
  async (flowInput: GenerateDreamInterpretationInput) => {
    let promptTemplateToUse = DEFAULT_PROMPT_TEMPLATE;
    let safetySettingsToUse: SafetySetting[] = [...DEFAULT_SAFETY_SETTINGS];

    try {
      const configDocRef = firestore.collection('aiConfiguration').doc('dreamPromptSettings');
      const configDoc = await configDocRef.get();

      if (configDoc.exists) {
        const configData = configDoc.data();
        if (configData?.promptTemplate && typeof configData.promptTemplate === 'string' && configData.promptTemplate.trim() !== '') {
          promptTemplateToUse = configData.promptTemplate;
          console.log("Dream interpretation prompt template loaded from Firestore.");
        }
        if (configData?.safetySettings && Array.isArray(configData.safetySettings)) {
           const validSafetySettings = configData.safetySettings.filter(
            (setting: any): setting is SafetySetting =>
              setting && typeof setting.category === 'string' && typeof setting.threshold === 'string'
          );
          if (validSafetySettings.length > 0) {
            safetySettingsToUse = validSafetySettings;
            console.log("Dream interpretation safety settings loaded from Firestore.");
          }
        }
      }
    } catch (error) {
      console.error("Error loading dream interpretation prompt settings from Firestore. Using defaults.", error);
    }

    try {
      const dreamPrompt = ai.definePrompt({
        name: 'generateDreamInterpretationRuntimePrompt',
        input: { schema: GenerateDreamInterpretationInputSchema },
        prompt: promptTemplateToUse,
        model: 'googleai/gemini-2.0-flash',
        config: {
          safetySettings: safetySettingsToUse.length > 0 ? safetySettingsToUse : undefined,
        },
      });

      const llmResponse = await dreamPrompt(flowInput);
      const interpretationText = llmResponse.text;

      if (!interpretationText) {
        return { interpretation: 'AI 해석을 생성하는 데 문제가 발생했습니다. 생성된 내용이 없습니다.' };
      }

      return { interpretation: interpretationText };
    } catch (e: any) {
      console.error('Error executing dream interpretation prompt:', e);
      let userMessage = 'AI 해석 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      if (e.toString && e.toString().includes("SAFETY")) {
         userMessage = "생성된 콘텐츠가 안전 기준에 부합하지 않아 차단되었습니다. 꿈 내용을 수정해 보세요.";
      }
      return { interpretation: userMessage };
    }
  }
);
