'use server';

/**
 * @fileOverview A flow for configuring AI prompt settings related to tarot card interpretations.
 *
 * This file exports:
 * - `configureAIPromptSettings`: A function to update AI prompt settings.
 * - `ConfigureAIPromptSettingsInput`: The input type for the configureAIPromptSettings function.
 * - `ConfigureAIPromptSettingsOutput`: The output type for the configureAIPromptSettings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConfigureAIPromptSettingsInputSchema = z.object({
  promptTemplate: z
    .string()
    .describe('The new prompt template to use for generating tarot card interpretations.'),
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
export type ConfigureAIPromptSettingsInput = z.infer<
  typeof ConfigureAIPromptSettingsInputSchema
>;

const ConfigureAIPromptSettingsOutputSchema = z.object({
  success: z.boolean().describe('Whether the prompt settings were updated successfully.'),
  message: z.string().describe('A message indicating the result of the update.'),
});
export type ConfigureAIPromptSettingsOutput = z.infer<
  typeof ConfigureAIPromptSettingsOutputSchema
>;

export async function configureAIPromptSettings(
  input: ConfigureAIPromptSettingsInput
): Promise<ConfigureAIPromptSettingsOutput> {
  return configureAIPromptSettingsFlow(input);
}

const configureAIPromptSettingsFlow = ai.defineFlow(
  {
    name: 'configureAIPromptSettingsFlow',
    inputSchema: ConfigureAIPromptSettingsInputSchema,
    outputSchema: ConfigureAIPromptSettingsOutputSchema,
  },
  async input => {
    try {
      // Here, instead of calling an LLM, we would typically update
      // a configuration file or a database with the new prompt settings.
      // For this example, we'll just log the settings.
      console.log('New prompt template:', input.promptTemplate);
      console.log('New safety settings:', input.safetySettings);

      // In a real application, you might save the prompt template and safety settings
      // to a database or configuration file here.

      // For now, just return a success message.
      return {
        success: true,
        message: 'AI Prompt settings updated successfully.',
      };
    } catch (error: any) {
      console.error('Failed to update AI Prompt settings:', error);
      return {
        success: false,
        message: `Failed to update AI Prompt settings: ${error.message}`,
      };
    }
  }
);
