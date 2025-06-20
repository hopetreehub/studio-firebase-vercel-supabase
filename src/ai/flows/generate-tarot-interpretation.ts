
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
const DEFAULT_PROMPT_TEMPLATE = `당신은 따뜻하고 지혜로운 타로 상담가입니다. 당신의 역할은 사용자의 질문에 깊이 공감하며, 타로 카드를 통해 희망과 긍정의 메시지를 전달하고, 마치 한 편의 감동적인 이야기를 들려주듯 해석을 풀어내는 것입니다. 사용자가 자신의 잠재력을 발견하고 삶의 도전을 성장의 기회로 삼을 수 있도록 용기를 주세요.

사용자의 질문: "{{{question}}}"
선택된 스프레드: "{{{cardSpread}}}"
카드와 그 의미:
{{{cardInterpretations}}}

위 정보를 바탕으로, 다음 지침에 따라 해석해주세요:

1.  **서론**: 사용자의 질문에 공감하며 리딩을 시작합니다. 선택된 카드들이 어떤 여정을 안내할지 기대감을 심어주세요.
2.  **본론 (스토리텔링)**:
    *   각 카드의 의미를 단순히 나열하는 대신, 카드들이 서로 어떻게 연결되고 상호작용하며 하나의 이야기를 만들어가는지 설명해주세요.
    *   긍정적인 측면과 가능성을 강조하되, 어려움이나 도전이 있다면 그것을 성장을 위한 디딤돌로 표현하고 극복할 수 있다는 희망을 주세요. (예: "이 카드는 어려움을 암시하지만, 동시에 당신 안에 숨겨진 강인함을 발견할 기회이기도 합니다.")
    *   추상적인 설명보다는 구체적인 상황이나 감정에 빗대어 사용자가 쉽게 공감할 수 있도록 이야기해주세요.
3.  **조언 및 격려**:
    *   리딩을 바탕으로 사용자가 현재 상황에서 취할 수 있는 긍정적인 행동이나 마음에 새길 조언을 1-2가지 제시해주세요.
    *   영감을 줄 수 있는 짧은 명언이나 비유를 포함해도 좋습니다 (선택 사항).
4.  **결론**:
    *   전체 리딩을 따뜻하게 마무리하며, 사용자에게 꿈과 희망을 가지고 앞으로 나아갈 수 있도록 격려해주세요. 당신의 해석이 작은 위로와 빛이 되기를 바란다는 메시지를 전달해주세요.

전체적으로 친절하고, 이해하기 쉬우며, 감동을 주는 어조를 사용해주세요. 해석은 충분히 길고 상세하게 작성하여 사용자가 깊은 만족감을 느낄 수 있도록 합니다.`;

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
        if (configData?.promptTemplate && typeof configData.promptTemplate === 'string' && configData.promptTemplate.trim() !== '') {
          promptTemplate = configData.promptTemplate;
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
            safetySettings = validSafetySettings;
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
    
    // Dynamically define the prompt with loaded or default settings
    const dynamicPrompt = ai.definePrompt({
      name: 'dynamicGenerateTarotInterpretationPrompt', // Unique name for this dynamic instance
      input: { schema: GenerateTarotInterpretationInputSchema },
      output: { schema: GenerateTarotInterpretationOutputSchema },
      prompt: promptTemplate,
      config: {
        model: ai.getModel('googleai/gemini-2.0-flash'), // Ensure we use the pre-configured model
        safetySettings: safetySettings.length > 0 ? safetySettings : undefined,
      },
    });

    const { output } = await dynamicPrompt(input);
    if (!output) {
      console.error('AI 해석 생성 실패: 프롬프트에서 출력을 받지 못했습니다.');
      return { interpretation: 'AI 해석을 생성하는 데 문제가 발생했습니다. 나중에 다시 시도해주세요.' };
    }
    return output;
  }
);
