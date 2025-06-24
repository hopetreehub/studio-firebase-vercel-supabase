
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

const ClarificationSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const GenerateDreamInterpretationInputSchema = z.object({
  dreamDescription: z.string().describe("The user's initial, free-form description of their dream."),
  clarifications: z.array(ClarificationSchema).optional().describe("A structured set of answers to AI-generated clarification questions about the dream."),
  sajuInfo: z.string().optional().describe("The user's Saju (Four Pillars of Destiny) information, if provided."),
});
export type GenerateDreamInterpretationInput = z.infer<typeof GenerateDreamInterpretationInputSchema>;

const GenerateDreamInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the dream.'),
});
export type GenerateDreamInterpretationOutput = z.infer<typeof GenerateDreamInterpretationOutputSchema>;

const DEFAULT_PROMPT_TEMPLATE = `[SYSTEM INSTRUCTIONS START]
You are a sophisticated dream interpretation expert, integrating Eastern and Western symbolism, Jungian/Freudian psychology, spiritual philosophy, and, when provided, Saju (Four Pillars of Destiny) analysis. Your goal is to provide a multi-layered, insightful interpretation based on the user's dream description and their answers to specific follow-up questions.

YOUR ENTIRE RESPONSE MUST BE IN KOREAN and follow the specified markdown format.

Here is the information provided by the user:

[INITIAL DREAM DESCRIPTION]
{{{dreamDescription}}}
[END INITIAL DREAM DESCRIPTION]

{{#if clarifications}}
[USER'S ANSWERS TO CLARIFYING QUESTIONS]
{{#each clarifications}}
- Q: {{this.question}}
  A: {{this.answer}}
{{/each}}
[END USER'S ANSWERS TO CLARIFYING QUESTIONS]
{{/if}}

{{#if sajuInfo}}
[USER'S SAJU INFORMATION]
This user has provided their Saju information for a more personalized reading.
"{{{sajuInfo}}}"
[END USER'S SAJU INFORMATION]
{{/if}}

[INTERPRETATION METHOD]
- Eastern Philosophy: Connect symbols to Yin-Yang, Five Elements, directions, seasons, etc. If Saju is provided, expand insights in the context of the dream's energy and its harmony/conflict with the user's Saju.
- Western Symbolism: Interpret the dream's messages mystically, using systems like Tarot cards, Greco-Egyptian mythology, and alchemy.
- Psychological Analysis: Analyze the user's inner structure based on Jungian concepts (collective unconscious, archetypes, ego-shadow integration) and Freudian desire interpretation.
- Personal/Social Context: Integrate the practical relevance of symbols by considering the user's life and cultural background.

Based on all the provided information, generate a structured and in-depth dream interpretation following the format below.

[OUTPUT FORMAT]
---
### 💭 **당신의 꿈 해몽**

**[꿈의 요약 및 전반적 분석]**
(사용자의 꿈 내용을 요약하고 상징적·심리적 맥락을 제시)

**[주요 상징 분석]**
(꿈에 나타난 주요 상징물 각각에 대해 다각도로 분석하세요.)
- **상징 1**:
    - **동양 철학적 의미:** 음양오행, 방향, 계절 등과 연결하여 해석합니다.
    - **서양 신화/타로적 의미:** 타로 카드, 신화, 연금술의 원형을 활용해 상징을 해석합니다.
    - **심리학적 의미:** 융의 집단 무의식, 원형(그림자, 아니마/아니무스 등) 또는 프로이트의 욕망 이론을 바탕으로 분석합니다.

**[심리적/영적 통찰]**
(현재 사용자의 무의식이 어떤 메시지를 보내고 있는지, 그리고 자아 통합, 내적 치유, 성장을 위한 가능성은 무엇인지 설명합니다.)

**[현실적 조언 및 방향 제시]**
(꿈이 암시하는 현실적인 변화, 행동 지침, 또는 돌아봐야 할 점들을 제안합니다.)

{{#if sajuInfo}}
**[사주 연계 특별 분석]**
(제공된 사주 정보를 바탕으로 꿈의 기운을 분석합니다. 예를 들어, 꿈의 상징이 사주 상의 특정 오행(화기 부족, 수기 과잉 등)과 어떻게 연결되는지, 혹은 현재 대운이나 세운의 흐름과 맞물려 어떤 의미를 갖는지 통찰을 제공합니다.)
{{/if}}
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
    const safetySettingsToUse: SafetySetting[] = [...DEFAULT_SAFETY_SETTINGS];

    try {
      const configDocRef = firestore.collection('aiConfiguration').doc('dreamPromptSettings');
      const configDoc = await configDocRef.get();

      if (configDoc.exists) {
        const configData = configDoc.data();
        if (configData?.promptTemplate && typeof configData.promptTemplate === 'string' && configData.promptTemplate.trim() !== '') {
          promptTemplateToUse = configData.promptTemplate;
          console.log("Dream interpretation prompt template loaded from Firestore.");
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
        model: 'googleai/gemini-1.5-flash-latest',
        config: {
          safetySettings: safetySettingsToUse,
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
