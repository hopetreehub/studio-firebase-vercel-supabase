'use server';

/**
 * @fileOverview Generates clarifying multiple-choice questions about a user's dream.
 *
 * - generateDreamClarificationQuestions: A function that handles generating questions.
 * - GenerateDreamClarificationQuestionsInput: The input type for the function.
 * - GenerateDreamClarificationQuestionsOutput: The return type for the function.
 * - ClarificationQuestion: The type for a single question object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDreamClarificationQuestionsInputSchema = z.object({
  dreamDescription: z.string().describe("The user's initial, free-form description of their dream."),
});
export type GenerateDreamClarificationQuestionsInput = z.infer<typeof GenerateDreamClarificationQuestionsInputSchema>;

const ClarificationQuestionSchema = z.object({
  question: z.string().describe("A question to ask the user to clarify a specific part of their dream."),
  options: z.array(z.string()).length(4).describe("Four plausible, distinct, multiple-choice options for the question."),
});
export type ClarificationQuestion = z.infer<typeof ClarificationQuestionSchema>;

const GenerateDreamClarificationQuestionsOutputSchema = z.object({
  questions: z.array(ClarificationQuestionSchema).min(2).max(4).describe("An array of 2 to 4 clarification questions."),
});
export type GenerateDreamClarificationQuestionsOutput = z.infer<typeof GenerateDreamClarificationQuestionsOutputSchema>;

export async function generateDreamClarificationQuestions(
  input: GenerateDreamClarificationQuestionsInput
): Promise<GenerateDreamClarificationQuestionsOutput> {
  return generateDreamClarificationQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDreamClarificationQuestionsPrompt',
  input: { schema: GenerateDreamClarificationQuestionsInputSchema },
  output: { schema: GenerateDreamClarificationQuestionsOutputSchema },
  prompt: `You are a helpful assistant for a dream interpretation service. Your task is to analyze a user's initial dream description and generate 2 to 4 insightful, multiple-choice questions to gather more specific details. These questions will help provide a more accurate and personalized dream interpretation.

RULES:
1.  Generate between 2 and 4 questions.
2.  Each question MUST have exactly 4 multiple-choice options.
3.  The questions should focus on the most ambiguous or symbolically important parts of the dream. Ask about key characters, emotions, settings, or objects.
4.  The options should be distinct, plausible, and cover a range of possibilities (e.g., different emotions, motivations, or outcomes).
5.  Frame the questions in a gentle and inquisitive tone.
6.  Everything MUST be in KOREAN.

User's Dream Description:
"{{{dreamDescription}}}"

Generate the clarification questions now.`,
});


const generateDreamClarificationQuestionsFlow = ai.defineFlow(
  {
    name: 'generateDreamClarificationQuestionsFlow',
    inputSchema: GenerateDreamClarificationQuestionsInputSchema,
    outputSchema: GenerateDreamClarificationQuestionsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI did not return clarification questions.');
      }
      return output;
    } catch (e: any) {
       console.error('Error generating clarification questions:', e);
      // Fallback or re-throw with a more user-friendly message
      throw new Error('Failed to generate clarification questions from AI.');
    }
  }
);
