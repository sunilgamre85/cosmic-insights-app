
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
  prompt: `You are an expert physiognomist (face reader). Your task is to analyze the provided photo of a person's face and generate a unique, specific, and insightful analysis based ONLY on the visual features in that image.

**CRITICAL INSTRUCTIONS:**
1.  **NO GENERIC PHRASES:** You are strictly forbidden from using vague, generic, or templated phrases like "medium size," "balanced shape," "well-defined," "normal," or similar non-descriptive terms. Your response MUST be unique and directly tied to the visual information in the photo.
2.  **DESCRIBE AND INTERPRET:** For each feature, first describe the specific visual characteristic you observe (e.g., "a wide forehead," "thin, highly-arched eyebrows," "a rounded chin") and THEN provide the corresponding physiognomic interpretation.
3.  **LANGUAGE:** You MUST provide the entire analysis in the following language: {{{language}}}.

**PHOTO FOR ANALYSIS:**
{{media url=photoDataUri}}

**ANALYSIS TASK:**
Provide a detailed analysis for each of the following facial features based on what you specifically see in the photo. Be insightful, positive, and encouraging. Your analysis for each feature must be tailored to THIS image.

-   **Forehead:** (e.g., Is it wide, narrow, high, or short? What does this specific shape imply?)
-   **Eyebrows:** (e.g., Are they thick, thin, straight, arched, or close-set? What do these specific traits reveal?)
-   **Eyes:** (e.g., Are they large, small, almond-shaped, round, deep-set? What does their appearance suggest?)
-   **Nose:** (e.g., Describe its bridge, tip, and width. What does this structure indicate?)
-   **Cheeks:** (e.g., Are the cheekbones high and prominent, or are the cheeks fuller? What does this signify?)
-   **Lips:** (e.g., Describe the fullness of the upper and lower lips. What does this reveal about communication style?)
-   **Chin:** (e.g., Is it pointed, square, round, or prominent? What does this say about willpower?)

Finally, provide an **Overall Analysis** that combines these individual, specific analyses into a cohesive and insightful personality profile. Return the full analysis in the requested JSON format.`,
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
