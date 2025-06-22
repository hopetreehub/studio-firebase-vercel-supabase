
'use server';

/**
 * @fileOverview A flow for configuring AI prompt settings for dream interpretations.
 *
 * This file exports:
 * - `configureDreamPromptSettings`: A function to update dream prompt settings.
 * - `ConfigureDreamPromptSettingsInput`: The input type for the function.
 * - `ConfigureDreamPromptSettingsOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { firestore } from '@/lib/firebase/admin';

const ConfigureDreamPromptSettingsInputSchema = z.object({
  promptTemplate: z
    .string()
    .describe('The new prompt template to use for generating dream interpretations.'),
  safetySettings: z
    .array(
      z.object({
        category: z.enum([
          'HARM_CATEGORY_HATE_SPEECH',
          'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'HARM_CATEGORY_HARASSMENT',
          'HARM_CATEGORY_DANGEROUS_CONTENT',
          'HARM_CATEGORY_CIVIC_INTEGRITY',
        ]),
        threshold: z.enum([
          'BLOCK_LOW_AND_ABOVE',
          'BLOCK_MEDIUM_AND_ABOVE',
          'BLOCK_ONLY_HIGH',
          'BLOCK_NONE',
        ]),
      })
    )
    .optional()
    .describe('Optional safety settings to apply to the prompt.'),
});
export type ConfigureDreamPromptSettingsInput = z.infer<
  typeof ConfigureDreamPromptSettingsInputSchema
>;

const ConfigureDreamPromptSettingsOutputSchema = z.object({
  success: z.boolean().describe('Whether the prompt settings were updated successfully.'),
  message: z.string().describe('A message indicating the result of the update.'),
});
export type ConfigureDreamPromptSettingsOutput = z.infer<
  typeof ConfigureDreamPromptSettingsOutputSchema
>;

export async function configureDreamPromptSettings(
  input: ConfigureDreamPromptSettingsInput
): Promise<ConfigureDreamPromptSettingsOutput> {
  return configureDreamPromptSettingsFlow(input);
}

const configureDreamPromptSettingsFlow = ai.defineFlow(
  {
    name: 'configureDreamPromptSettingsFlow',
    inputSchema: ConfigureDreamPromptSettingsInputSchema,
    outputSchema: ConfigureDreamPromptSettingsOutputSchema,
  },
  async (input: ConfigureDreamPromptSettingsInput) => {
    try {
      const settingsToSave = {
        promptTemplate: input.promptTemplate,
        safetySettings: input.safetySettings || [],
      };

      await firestore.collection('aiConfiguration').doc('dreamPromptSettings').set(settingsToSave);
      
      console.log('Dream AI Prompt settings saved to Firestore:', settingsToSave);

      return {
        success: true,
        message: '꿈 해몽 AI 프롬프트 설정이 Firestore에 성공적으로 저장되었습니다.',
      };
    } catch (error: any) {
      console.error('Failed to save Dream AI Prompt settings to Firestore:', error);
      return {
        success: false,
        message: `꿈 해몽 AI 프롬프트 설정 저장 실패: ${error.message}`,
      };
    }
  }
);
