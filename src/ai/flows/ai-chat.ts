'use server';
/**
 * @fileOverview A conversational AI agent for astrology questions.
 *
 * - aiChat - A function that handles the chat process.
 * - AiChatInput - The input type for the aiChat function.
 * - AiChatOutput - The return type for the aiChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

const AiChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

export async function aiChat(input: AiChatInput): Promise<AiChatOutput> {
  return aiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatPrompt',
  input: {schema: AiChatInputSchema},
  output: {schema: AiChatOutputSchema},
  prompt: `You are a friendly and knowledgeable AI astrologer named CosmicAI. Your goal is to answer user questions about astrology in a clear, insightful, and engaging way.

Do not answer questions that are not related to astrology, numerology, or other mystical arts. If the user asks a non-astrological question, politely steer the conversation back to astrology.

User's message: {{{message}}}
`,
});

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
