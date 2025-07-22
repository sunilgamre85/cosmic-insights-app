'use server';
/**
 * @fileOverview An AI agent for interpreting a three-card tarot spread.
 *
 * - tarotCardReading - A function that handles the tarot reading process.
 * - TarotCardReadingInput - The input type for the tarotCardReading function.
 * - TarotCardReadingOutput - The return type for the tarotCardReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TarotCardReadingInputSchema = z.object({
  card1: z.string().describe("The name of the first card, representing the Past."),
  card2: z.string().describe("The name of the second card, representing the Present."),
  card3: z.string().describe("The name of the third card, representing the Future."),
  language: z.string().optional().describe("The language for the interpretation (e.g., 'English', 'Hindi')."),
});
export type TarotCardReadingInput = z.infer<typeof TarotCardReadingInputSchema>;

const TarotCardReadingOutputSchema = z.object({
  pastInterpretation: z.string().describe("An interpretation of the Past card in the context of the spread."),
  presentInterpretation: z.string().describe("An interpretation of the Present card in the context of the spread."),
  futureInterpretation: z.string().describe("An interpretation of the Future card in the context of the spread."),
  overallSummary: z.string().describe("A summary that synthesizes the meaning of all three cards together to provide a cohesive message or guidance."),
});
export type TarotCardReadingOutput = z.infer<typeof TarotCardReadingOutputSchema>;

export async function tarotCardReading(input: TarotCardReadingInput): Promise<TarotCardReadingOutput> {
  return tarotCardReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tarotCardReadingPrompt',
  input: {schema: TarotCardReadingInputSchema},
  output: {schema: TarotCardReadingOutputSchema},
  config: {
    temperature: 0.5,
  },
  prompt: `You are an expert tarot reader. The user has drawn a three-card spread for Past, Present, and Future. Provide a thoughtful and insightful interpretation.

You MUST provide the entire interpretation in the following language: {{{language}}}

- Past Card: {{{card1}}}
- Present Card: {{{card2}}}
- Future Card: {{{card3}}}

First, interpret each card individually in its position (Past, Present, Future). Then, create an overall summary that connects the themes of the three cards into a single, flowing narrative or piece of advice for the user. Be encouraging and focus on empowerment.
`,
});

const tarotCardReadingFlow = ai.defineFlow(
  {
    name: 'tarotCardReadingFlow',
    inputSchema: TarotCardReadingInputSchema,
    outputSchema: TarotCardReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        ...input,
        language: input.language || 'English',
    });
    return output!;
  }
);
