
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
import { firestore } from '@/lib/firebase/admin';
import type { SafetySetting } from '@genkit-ai/googleai';

const GenerateTarotInterpretationInputSchema = z.object({
  question: z.string().describe('The user provided question for the tarot reading.'),
  cardSpread: z.string().describe('The selected tarot card spread (e.g., 1-card, 3-card, custom). Also includes card position names if defined for the spread.'),
  cardInterpretations: z.string().describe('The interpretation of each card in the spread, including its name, orientation (upright/reversed), and potentially its position in the spread.'),
});
export type GenerateTarotInterpretationInput = z.infer<typeof GenerateTarotInterpretationInputSchema>;

const GenerateTarotInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the tarot card spread.'),
});
export type GenerateTarotInterpretationOutput = z.infer<typeof GenerateTarotInterpretationOutputSchema>;

const DEFAULT_PROMPT_TEMPLATE = `[SYSTEM INSTRUCTIONS START]
You are a compassionate, insightful, and wise tarot reader. Your primary goal is to provide a hopeful, empowering, and positive interpretation based on the user's unique situation and the cards drawn. You must synthesize the provided information into a coherent, flowing narrative.

WHEN YOU GENERATE THE RESPONSE:
- DO NOT repeat or output the "[USER'S INFORMATION]" block that follows in your response.
- Your entire response should be the interpretation itself, starting directly with the "Introduction".
- USE the data within "[USER'S INFORMATION]" (User's Question, Tarot Spread Used, Cards Drawn) as the Factual basis for your interpretation.
- Adhere strictly to the "GUIDELINES FOR INTERPRETATION" section below.

[USER'S INFORMATION]
User's Question: "{{{question}}}"
Tarot Spread Used: "{{{cardSpread}}}"
Cards Drawn (Includes Name, Orientation (Upright/Reversed), Position in Spread if applicable, and core meaning for each card):
{{{cardInterpretations}}}
[END USER'S INFORMATION]

[GUIDELINES FOR INTERPRETATION - FOLLOW THESE CAREFULLY TO CRAFT YOUR RESPONSE]
Based *only* on the "[USER'S INFORMATION]" provided above, craft a personalized, story-like interpretation.

1.  **Introduction (Empathetic Connection and Setting the Scene):**
    *   Begin by acknowledging the user's question ("{{{question}}}") with genuine empathy and understanding. Reflect that you've understood their query.
    *   Gently set the stage for the reading, building anticipation for how the drawn cards (detailed in "{{{cardInterpretations}}}") and the chosen "{{{cardSpread}}}" spread will illuminate their path regarding their specific question.

2.  **Main Body (Storytelling Card Analysis - The Core of the Interpretation):**
    *   **Card-by-Card Synthesis within the Spread's Context:** For each card listed in "{{{cardInterpretations}}}", explain its specific relevance to the user's question ("{{{question}}}"). Crucially, consider the card's name, its orientation (Upright/Reversed as provided), and its specific position within the "{{{cardSpread}}}" (e.g., "Past", "Present", "Challenge", "Outcome" - use the position names if they are provided in "{{{cardInterpretations}}}").
    *   **Integrate Spread Narrative:** Weave the overall meaning or flow of the "{{{cardSpread}}}" into your narrative. For example, if "{{{cardSpread}}}" indicates a "Past-Present-Future" structure, organize your story along this timeline, explaining how earlier cards influence later ones. If it’s a Celtic Cross, explain how cards in their respective traditional positions contribute to the overall picture for the user's question.
    *   **Narrative Cohesion and Interaction:** Connect the interpretations of individual cards into a flowing, unified story. Show how the cards influence each other and build upon one another to answer "{{{question}}}". Avoid treating each card in complete isolation.
    *   **Balanced, Hopeful, and Empowering Tone:** Emphasize positive potentials, strengths, and opportunities for growth. If challenging cards appear, interpret them constructively as lessons, areas for awareness, or obstacles that can be overcome with insight and effort. The overall message should be empowering and instill hope, while acknowledging realities. Use rich, descriptive, and thoughtful language. The goal is to provide comfort and clarity, not to predict a fixed doom.

3.  **Actionable Advice and Encouragement (Practical, Inspiring, and Forward-Looking):**
    *   Based on the entire reading (all cards and their interplay), derive 1-2 concrete, positive, and actionable pieces of advice that directly address the user's question ("{{{question}}}"). This advice should feel like a natural outcome of the interpretation.
    *   Optionally, if it fits organically and enhances the message, include a brief, uplifting quote or a gentle metaphor.

4.  **Conclusion (Warm Closing and Lasting Hope):**
    *   Conclude your interpretation with a warm, encouraging message. Reiterate the user's inner strength, potential, and the possibility of navigating their situation positively.
    *   Offer a final sentiment of hope, support, and well-wishing for their journey forward.
[SYSTEM INSTRUCTIONS END]
`;

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
  async (flowInput: GenerateTarotInterpretationInput) => {
    let promptTemplateToUse = DEFAULT_PROMPT_TEMPLATE;
    let safetySettingsToUse: SafetySetting[] = [...DEFAULT_SAFETY_SETTINGS]; 

    try {
      const configDocRef = firestore.collection('aiConfiguration').doc('promptSettings');
      const configDoc = await configDocRef.get();

      if (configDoc.exists) {
        const configData = configDoc.data();
        if (configData?.promptTemplate && typeof configData.promptTemplate === 'string' && configData.promptTemplate.trim() !== '') {
          promptTemplateToUse = configData.promptTemplate;
          console.log("AI 프롬프트 템플릿을 Firestore에서 불러왔습니다.");
        } else {
          console.log("Firestore에서 유효한 AI 프롬프트 템플릿을 찾을 수 없습니다. 기본 템플릿을 사용합니다.");
        }

        if (configData?.safetySettings && Array.isArray(configData.safetySettings)) {
          const validSafetySettings = configData.safetySettings.filter(
            (setting: any): setting is SafetySetting => 
              setting && typeof setting.category === 'string' && typeof setting.threshold === 'string'
          );
          if (validSafetySettings.length > 0) {
            safetySettingsToUse = validSafetySettings;
            console.log("AI 안전 설정을 Firestore에서 불러왔습니다.");
          } else {
            console.log("Firestore에서 유효한 AI 안전 설정을 찾을 수 없습니다. 기본 설정을 사용합니다.");
          }
        } else {
           console.log("Firestore에 AI 안전 설정이 없거나 형식이 올바르지 않습니다. 기본 설정을 사용합니다.");
        }
      } else {
        console.log("Firestore에서 AI 프롬프트 설정 문서를 찾을 수 없습니다. 기본값을 사용합니다.");
      }
    } catch (error) {
      console.error("Firestore에서 AI 프롬프트 설정을 불러오는 중 오류 발생. 기본값을 사용합니다:", error);
    }
    
    const promptInputData = {
      question: flowInput.question,
      cardSpread: flowInput.cardSpread,
      cardInterpretations: flowInput.cardInterpretations,
    };

    try {
      const generationResult = await ai.generate({
        prompt: promptTemplateToUse, 
        input: promptInputData,      
        config: {
          safetySettings: safetySettingsToUse.length > 0 ? safetySettingsToUse : undefined,
        },
      });

      const interpretationText = generationResult.text; 

      if (!interpretationText) {
        console.error('AI 해석 생성 실패: 생성된 텍스트가 없습니다.');
        return { interpretation: 'AI 해석을 생성하는 데 문제가 발생했습니다. 생성된 내용이 없습니다.' };
      }
      
      return { interpretation: interpretationText };

    } catch (e: any) {
      console.error('AI.generate 호출 중 오류 발생:', e);
      let userMessage = 'AI 해석 생성 중 일반 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      if (e.message) {
        userMessage = `AI 해석 오류: ${e.message}`;
      }
      if (e.finishReason && e.finishReason !== 'STOP') {
         userMessage = `AI 생성이 완료되지 못했습니다 (이유: ${e.finishReason}). 콘텐츠 안전 문제 또는 다른 제약 때문일 수 있습니다. 프롬프트를 조정하거나 안전 설정을 확인해보세요.`;
      }
      if (e.toString && e.toString().includes("SAFETY")) {
         userMessage = "생성된 콘텐츠가 안전 기준에 부합하지 않아 차단되었습니다. 질문이나 해석 요청 내용을 수정해 보세요.";
      }
       if (e.toString && e.toString().includes("no valid candidates")) {
         userMessage = "AI가 현재 요청에 대해 적절한 답변을 찾지 못했습니다. 질문을 조금 다르게 해보거나, 나중에 다시 시도해주세요. (No Valid Candidates)";
       }


      return { interpretation: userMessage };
    }
  }
);

