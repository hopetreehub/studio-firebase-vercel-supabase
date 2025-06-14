// This is a server-side file.
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

export async function generateTarotInterpretation(input: GenerateTarotInterpretationInput): Promise<GenerateTarotInterpretationOutput> {
  return generateTarotInterpretationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTarotInterpretationPrompt',
  input: {schema: GenerateTarotInterpretationInputSchema},
  output: {schema: GenerateTarotInterpretationOutputSchema},
  prompt: `You are a tarot card expert. Provide an insightful interpretation of the card spread in relation to the user's question.

  Question: {{{question}}}
  Card Spread: {{{cardSpread}}}
  Card Interpretations: {{{cardInterpretations}}}

  Interpretation: `,
});

const generateTarotInterpretationFlow = ai.defineFlow(
  {
    name: 'generateTarotInterpretationFlow',
    inputSchema: GenerateTarotInterpretationInputSchema,
    outputSchema: GenerateTarotInterpretationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
