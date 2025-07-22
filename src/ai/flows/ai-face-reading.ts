
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

const TraitAnalysisSchema = z.object({
    observation: z.string().describe("Describe what you actually see (don’t assume or generalize)."),
    interpretation: z.string().describe("Based on Samudrik Shastra and modern psychology, interpret what it may say about the person’s personality, tendencies, or future."),
});

const AnalyzeFaceOutputSchema = z.object({
  facialStructure: TraitAnalysisSchema,
  forehead: TraitAnalysisSchema,
  eyebrows: TraitAnalysisSchema,
  eyes: TraitAnalysisSchema,
  nose: TraitAnalysisSchema,
  lips: TraitAnalysisSchema,
  chin: TraitAnalysisSchema,
  cheeks: TraitAnalysisSchema,
  jawline: TraitAnalysisSchema,
  ears: TraitAnalysisSchema,
  facialExpression: TraitAnalysisSchema,
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
  prompt: `You are a master physiognomist with deep knowledge of Indian face reading traditions (Samudrik Shastra) and modern facial analysis. You will receive a human face image. Based on this image, extract the following:

1.  **Facial Structure** (face shape - round, oval, square, long, heart-shaped, etc.)
2.  **Forehead** (height, width, curve, lines, any moles/marks)
3.  **Eyebrows** (shape, length, thickness, distance between)
4.  **Eyes** (size, shape, tilt, spacing, eyelids)
5.  **Nose** (bridge, length, nostrils, sharpness, tip)
6.  **Lips** (size, curvature, upper/lower proportion)
7.  **Chin** (round, pointed, dimpled, broad, projecting)
8.  **Cheeks** (full, sunken, high cheekbones)
9.  **Jawline** (sharp, soft, wide, angular)
10. **Ears** (size, lobe type, angle)
11. **Facial Expression** (neutral, smile, tight lips, eye focus)

👉 For each trait, do the following:

-   **Observation**: Describe what you actually see (don’t assume or generalize).
-   **Interpretation**: Based on Samudrik Shastra and modern facial psychology, interpret what it may say about the person’s personality, tendencies, or future.
-   **Avoid vague words** like "medium", "normal", "balanced" unless it's comparative.
-   **Respond in the requested language**: {{{language}}}
-   **Respond in the required JSON format.**

The tone should be insightful, warm, and intelligent — not robotic or horoscope-like.

PHOTO FOR ANALYSIS:
{{media url=photoDataUri}}
`,
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
