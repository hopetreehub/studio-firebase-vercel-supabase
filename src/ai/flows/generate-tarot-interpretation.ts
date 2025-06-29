
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
  question: z.string().describe('The user provided question for the tarot reading, potentially including an interpretation style cue like "(해석 스타일: 스타일 이름)".'),
  cardSpread: z.string().describe('The selected tarot card spread (e.g., 1-card, 3-card, custom). Also includes card position names if defined for the spread.'),
  cardInterpretations: z.string().describe('The interpretation of each card in the spread, including its name, orientation (upright/reversed), and potentially its position in the spread. This is a single string containing all card details.'),
  isGuestUser: z.boolean().optional().describe('Whether the user is a guest (not logged in). If true, provide a shorter, teaser interpretation.'),
});
export type GenerateTarotInterpretationInput = z.infer<typeof GenerateTarotInterpretationInputSchema>;

const GenerateTarotInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the tarot card spread.'),
});
export type GenerateTarotInterpretationOutput = z.infer<typeof GenerateTarotInterpretationOutputSchema>;

const DEFAULT_PROMPT_TEMPLATE = `[SYSTEM INSTRUCTIONS START]
You are a compassionate, insightful, and wise tarot reader. Your primary goal is to provide a hopeful, empowering, and positive interpretation based on the user's unique situation and the cards drawn. You must synthesize the provided information into a coherent, flowing narrative.

YOUR ENTIRE RESPONSE MUST BE IN KOREAN.

[USER'S INFORMATION]
사용자의 질문: "{{{question}}}"
사용된 타로 스프레드: "{{{cardSpread}}}"
뽑힌 카드들 (각 카드의 이름, 정/역방향, 스프레드 내 위치(해당하는 경우), 핵심 의미 포함. 이 정보를 바탕으로 해석을 구성하세요):
{{{cardInterpretations}}}
[END USER'S INFORMATION]

{{#if isGuestUser}}
[GUEST MODE INSTRUCTIONS]
- Provide a concise and engaging summary of the reading. It should be about 3-4 sentences long.
- Briefly touch on the core message of the cards.
- DO NOT provide a full, section-by-section analysis with Markdown headers.
- The goal is to give a taste of the reading to encourage the user to sign up for the full version.
- Your entire response should be a single block of text, without markdown headers. Start your response with a sentence like "당신의 질문과 카드를 보니..."
[END GUEST MODE INSTRUCTIONS]
{{else}}
[FULL INTERPRETATION GUIDELINES - 응답을 작성할 때 이 지침을 주의 깊게 따르세요.]
YOUR RESPONSE MUST USE MARKDOWN H2 (e.g., "## 서론") FOR THE SECTION TITLES: 서론, 본론, 실행 가능한 조언과 격려, 결론.
WHEN YOU GENERATE THE RESPONSE:
- DO NOT repeat or output the "[USER'S INFORMATION]" block.
- Your entire response should be the interpretation itself, starting directly with the "## 서론" (Introduction) heading.
- USE the data within "[USER'S INFORMATION]" as the FACTUAL basis for your KOREAN interpretation.
- PAY CLOSE ATTENTION to the "해석 스타일" (interpretation style) if mentioned within the "{{{question}}}". This style is CRUCIAL for shaping your response.

## 서론: 공감적 연결 및 상황 설정
사용자의 질문 ("{{{question}}}")에 진심으로 공감하며 이해했음을 보여주며 시작하세요. 질문에 명시된 "해석 스타일"을 파악하고, 이를 반영하여 리딩의 톤과 방향을 설정하세요.
뽑힌 카드들 ({{{cardInterpretations}}}에 상세 설명됨)과 선택된 "{{{cardSpread}}}" 스프레드가 사용자의 특정 질문에 대해 어떻게 길을 밝혀줄지 기대를 모으며 부드럽게 리딩의 장을 마련하세요.

## 본론: 스토리텔링 방식의 카드 분석 - 해석의 핵심
"{{{cardInterpretations}}}"에 나열된 각 카드에 대해, 그 카드가 사용자의 질문 ("{{{question}}}")과 어떤 관련이 있는지 설명하세요. 카드의 이름, 정/역방향, 그리고 "{{{cardSpread}}}" 내에서의 특정 위치(예: "과거", "현재", "도전 과제", "결과" - "{{{cardInterpretations}}}"에 위치명이 제공된 경우 사용)를 반드시 고려해야 합니다. 주어진 카드 정보를 바탕으로 새로운 문장과 이야기를 만드세요. 단순히 카드 정보를 나열하지 마세요.
***매우 중요:*** 사용자의 질문에 포함된 "해석 스타일" 지침이 있다면, 그 스타일에 맞춰 카드 분석의 깊이, 사용하는 어휘, 강조점을 적극적으로 조절하세요. 예를 들어, "실질적 행동 지침" 스타일이라면 각 카드가 어떤 행동을 암시하는지, "심리학적 원형 탐구" 스타일이라면 각 카드가 어떤 내면의 상태나 원형을 나타내는지 등을 구체적으로 연결하여 설명해야 합니다.
"{{{cardSpread}}}"의 전체적인 의미나 흐름을 당신의 이야기에 엮어 넣으세요. 예를 들어, "{{{cardSpread}}}"가 "과거-현재-미래" 구조를 나타낸다면, 이 타임라인을 따라 이야기를 구성하고 이전 카드가 이후 카드에 어떻게 영향을 미치는지 설명하세요.
개별 카드 해석을 하나의 흐르는, 통일된 이야기로 연결하세요. 카드들이 서로 어떻게 영향을 주고받으며 "{{{question}}}"에 답하는지 보여주세요.
긍정적인 잠재력, 강점, 성장의 기회를 강조하세요. 도전적인 카드가 나타나면, 그것을 교훈, 인식해야 할 영역, 또는 통찰과 노력으로 극복할 수 있는 장애물로 건설적으로 해석하세요. 전반적인 메시지는 힘을 실어주고 희망을 심어주면서도 현실을 인정해야 합니다. 풍부하고 묘사적이며 사려 깊은 언어를 사용하세요.

## 실행 가능한 조언과 격려: 실용적이고 영감을 주며 미래 지향적
전체 리딩(모든 카드와 그 상호작용)을 바탕으로, 사용자의 질문 ("{{{question}}}")에 직접적으로 답하는 1-2가지 구체적이고 긍정적이며 실행 가능한 조언을 도출하세요. 이 조언은 해석의 자연스러운 결과처럼 느껴져야 합니다. 사용자가 요청한 "해석 스타일" (예: "실질적 행동 지침")을 이 부분에서 적극적으로 반영하여 조언의 성격을 결정하세요.
선택적으로, 유기적으로 어울리고 메시지를 강화한다면, 짧고 희망적인 인용구나 부드러운 은유를 포함할 수 있습니다.

## 결론: 따뜻한 마무리와 지속적인 희망
따뜻하고 격려적인 메시지로 해석을 마무리하세요. 사용자의 내면의 힘, 잠재력, 그리고 상황을 긍정적으로 헤쳐나갈 가능성을 다시 한번 강조하세요.
그들의 여정에 대한 희망, 지지, 그리고 안녕을 비는 마지막 감정을 전달하세요.
[END FULL INTERPRETATION GUIDELINES]
{{/if}}
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
      isGuestUser: flowInput.isGuestUser || false,
    };

    try {
      const tarotPrompt = ai.definePrompt({
        name: 'generateTarotInterpretationRuntimePrompt', 
        input: { schema: GenerateTarotInterpretationInputSchema }, 
        prompt: promptTemplateToUse, 
        model: 'googleai/gemini-1.5-flash-latest', 
        config: {
          safetySettings: safetySettingsToUse.length > 0 ? safetySettingsToUse : undefined,
        },
      });

      const llmResponse = await tarotPrompt(promptInputData); 
      const interpretationText = llmResponse.text; 

      if (!interpretationText) {
        console.error('AI 해석 생성 실패: 생성된 텍스트가 없습니다. 응답:', llmResponse);
        return { interpretation: 'AI 해석을 생성하는 데 문제가 발생했습니다. 생성된 내용이 없습니다.' };
      }

      return { interpretation: interpretationText };

    } catch (e: any) {
      console.error('AI 프롬프트 실행 중 오류 발생:', e);
      let userMessage = 'AI 해석 생성 중 일반 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      if (e.message) {
        userMessage = `AI 해석 오류: ${e.message}`;
        if (e.message.toLowerCase().includes('json')) {
             userMessage += ' (데이터 형식 오류 가능성 있음)';
        }
      }
      if ((e as any).finishReason && (e as any).finishReason !== 'STOP') {
         userMessage = `AI 생성이 완료되지 못했습니다 (이유: ${(e as any).finishReason}). 콘텐츠 안전 문제 또는 다른 제약 때문일 수 있습니다. 프롬프트를 조정하거나 안전 설정을 확인해보세요.`;
      }
      if (e.toString && e.toString().includes("SAFETY")) {
         userMessage = "생성된 콘텐츠가 안전 기준에 부합하지 않아 차단되었습니다. 질문이나 해석 요청 내용을 수정해 보세요.";
      }
      if (e.toString && e.toString().includes("no valid candidates")) {
         userMessage = "AI가 현재 요청에 대해 적절한 답변을 찾지 못했습니다. 질문을 조금 다르게 해보거나, 나중에 다시 시도해주세요. (No Valid Candidates)";
      }
      if (e.name === 'SyntaxError' && e.message && e.message.startsWith('JSON5')) {
        userMessage = `AI 응답 처리 중 내부 오류가 발생했습니다: ${e.message}. 프롬프트나 AI 설정을 확인해주세요.`;
      }
      
      return { interpretation: userMessage };
    }
  }
);
