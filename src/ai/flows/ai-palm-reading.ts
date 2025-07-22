'use server';

/**
 * @fileOverview Analyzes a user-uploaded palm image to provide insights into their personality and future.
 *
 * - analyzePalm - A function that handles the palm image analysis process.
 * - AnalyzePalmInput - The input type for the analyzePalm function.
 * - AnalyzePalmOutput - The return type for the analyzePalm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePalmInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePalmInput = z.infer<typeof AnalyzePalmInputSchema>;

const AnalyzePalmOutputSchema = z.object({
  analysis: z.object({
    fateLine: z.string().describe('Analysis of the fate line.'),
    lifeLine: z.string().describe('Analysis of the life line.'),
    heartLine: z.string().describe('Analysis of the heart line.'),
    headline: z.string().describe('Analysis of the head line.'),
  }).describe('Detailed analysis of the palm lines.'),
});
export type AnalyzePalmOutput = z.infer<typeof AnalyzePalmOutputSchema>;

export async function analyzePalm(input: AnalyzePalmInput): Promise<AnalyzePalmOutput> {
  return analyzePalmFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePalmPrompt',
  input: {schema: AnalyzePalmInputSchema},
  output: {schema: AnalyzePalmOutputSchema},
  prompt: `You are an expert palm reader. Analyze the user's palm and provide insights based on the palm lines.

Use the following as the source of information about the palm.

Palm Image: {{media url=photoDataUri}}

Analyze each of the major palm lines: fate line, life line, heart line, and head line.

Return the analysis in the following JSON format:

${JSON.stringify(AnalyzePalmOutputSchema.shape, null, 2)}`,
});

const analyzePalmFlow = ai.defineFlow(
  {
    name: 'analyzePalmFlow',
    inputSchema: AnalyzePalmInputSchema,
    outputSchema: AnalyzePalmOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
