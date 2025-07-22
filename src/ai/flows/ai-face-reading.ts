
'use server';
/**
 * @fileOverview Analyzes a user-uploaded photo of their face to provide a personality and trait analysis based on physiognomy.
 *
 * - analyzeFace - The main function for face analysis.
 * - AnalyzeFaceInput - The input type for the function.
 * - AnalyzeFaceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A clear, front-facing photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  language: z.string().optional().describe("The language for the analysis (e.g., 'English', 'Hindi')."),
});
export type AnalyzeFaceInput = z.infer<typeof AnalyzeFaceInputSchema>;

const AnalyzeFaceOutputSchema = z.object({
  forehead: z.string().describe("Analysis of the forehead shape and what it suggests about intelligence and thinking style."),
  eyebrows: z.string().describe("Analysis of the eyebrows (shape, thickness, arch) and their relation to temperament and logic."),
  eyes: z.string().describe("Analysis of the eyes (size, shape, spacing) and what they reveal about personality and perception."),
  nose: z.string().describe("Analysis of the nose shape and its connection to career, wealth, and ambition."),
  cheeks: z.string().describe("Analysis of the cheekbones and their indication of influence and authority."),
  lips: z.string().describe("Analysis of the lip shape and its link to communication style and generosity."),
  chin: z.string().describe("Analysis of the chin and jaw, and what it says about willpower and determination."),
  overallAnalysis: z.string().describe("A summary that synthesizes all facial features into a holistic personality reading."),
});
export type AnalyzeFaceOutput = z.infer<typeof AnalyzeFaceOutputSchema>;

export async function analyzeFace(input: AnalyzeFaceInput): Promise<AnalyzeFaceOutput> {
  return analyzeFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacePrompt',
  input: {schema: AnalyzeFaceInputSchema},
  output: {schema: AnalyzeFaceOutputSchema},
  config: {
    temperature: 0.7,
  },
  prompt: `You are an expert in physiognomy (face reading). Your task is to analyze the provided photo of a person's face and generate a unique, specific analysis based ONLY on the features in that image. Do not use generic statements. Your response MUST be unique and directly tied to the visual information in the photo.

You MUST provide the entire analysis in the following language: {{{language}}}

Photo: {{media url=photoDataUri}}

Provide a detailed analysis for each of the following facial features based on what you see in the specific photo provided. Be insightful, positive, and encouraging. Avoid generic, templated answers.
- Forehead
- Eyebrows
- Eyes
- Nose
- Cheeks
- Lips
- Chin

Finally, provide an overall summary that combines these individual analyses into a cohesive and insightful personality profile. Return the full analysis in the requested JSON format.`,
});

const analyzeFaceFlow = ai.defineFlow(
  {
    name: 'analyzeFaceFlow',
    inputSchema: AnalyzeFaceInputSchema,
    outputSchema: AnalyzeFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        ...input,
        language: input.language || 'English',
    });
    if (!output) {
      throw new Error("The AI model failed to return a valid analysis. The image might be unclear or not contain a face.");
    }
    return output;
  }
);
