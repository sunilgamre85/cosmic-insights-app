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

const PointSchema = z.object({
    x: z.number().describe('The x-coordinate of a point on the line, normalized between 0 and 1.'),
    y: z.number().describe('The y-coordinate of a point on the line, normalized between 0 and 1.'),
});

const LineSchema = z.object({
    analysis: z.string().describe('The detailed analysis of this specific palm line.'),
    path: z.array(PointSchema).describe('An array of points representing the path of the line on the image.'),
});

const AnalyzePalmOutputSchema = z.object({
  lifeLine: LineSchema.describe('Analysis and path of the life line.'),
  heartLine: LineSchema.describe('Analysis and path of the heart line.'),
  headline: LineSchema.describe('Analysis and path of the head line.'),
  fateLine: LineSchema.optional().describe('Analysis and path of the fate line (if visible).'),
});
export type AnalyzePalmOutput = z.infer<typeof AnalyzePalmOutputSchema>;

export async function analyzePalm(input: AnalyzePalmInput): Promise<AnalyzePalmOutput> {
  return analyzePalmFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePalmPrompt',
  input: {schema: AnalyzePalmInputSchema},
  output: {schema: AnalyzePalmOutputSchema},
  config: {
    temperature: 0.2,
  },
  prompt: `You are an expert palm reader. Analyze the user's palm from the provided image.

Palm Image: {{media url=photoDataUri}}

For each of the major palm lines (Life Line, Heart Line, Head Line, and Fate Line if visible), provide a detailed analysis.
In addition to the analysis, you MUST provide the coordinates for the path of each line.
The path should be an array of {x, y} points. The coordinates must be normalized, ranging from 0.0 to 1.0, where (0,0) is the top-left corner and (1,1) is the bottom-right corner of the image.
Trace the line from its start to its end with a reasonable number of points (e.g., 5-10 points) to capture its curve.

Return the full analysis and all coordinate paths in the requested JSON format.`,
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
