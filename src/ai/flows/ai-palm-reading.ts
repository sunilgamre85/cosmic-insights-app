'use server';

/**
 * @fileOverview Analyzes user-uploaded images of both left and right palms to provide a comprehensive reading.
 *
 * - analyzePalms - A function that handles the dual palm image analysis process.
 * - AnalyzePalmsInput - The input type for the analyzePalms function.
 * - AnalyzePalmsOutput - The return type for the analyzePalms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePalmsInputSchema = z.object({
  leftHandPhoto: z
    .string()
    .describe(
      "A photo of the user's left palm, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  rightHandPhoto: z
    .string()
    .describe(
      "A photo of the user's right palm, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type AnalyzePalmsInput = z.infer<typeof AnalyzePalmsInputSchema>;

const PointSchema = z.object({
    x: z.number().describe('The x-coordinate of a point on the line, normalized between 0 and 1.'),
    y: z.number().describe('The y-coordinate of a point on the line, normalized between 0 and 1.'),
});

const LineSchema = z.object({
    analysis: z.string().describe('The detailed analysis of this specific palm line.'),
    path: z.array(PointSchema).describe('An array of points representing the path of the line on the image.'),
});

const GeneralAnalysisSchema = z.object({
    handShape: z.string().optional().describe('Analysis of the overall hand shape (e.g., Earth, Air, Fire, Water hand) and what it indicates about the personality.'),
    mounts: z.string().optional().describe('Analysis of the prominent mounts like the Mount of Venus, Jupiter, and Saturn and their implications.'),
});

const SinglePalmAnalysisSchema = z.object({
  lifeLine: LineSchema.describe('Analysis and path of the life line.'),
  heartLine: LineSchema.describe('Analysis and path of the heart line.'),
  headline: LineSchema.describe('Analysis and path of the head line.'),
  fateLine: LineSchema.optional().describe('Analysis and path of the fate line (if visible).'),
  sunLine: LineSchema.optional().describe('Analysis and path of the sun line, also known as the Apollo line (if visible).'),
  generalAnalysis: GeneralAnalysisSchema.optional().describe('General analysis of other important palm features.'),
});

const AnalyzePalmsOutputSchema = z.object({
  leftHandAnalysis: SinglePalmAnalysisSchema.describe("The detailed analysis for the left hand, representing potential and innate traits."),
  rightHandAnalysis: SinglePalmAnalysisSchema.describe("The detailed analysis for the right hand, representing actions and current life path."),
  combinedInsight: z.string().describe("A synthesized analysis comparing and contrasting the two hands to provide a complete, holistic reading."),
  error: z.string().optional().describe('An error message if the palms could not be analyzed.'),
});
export type AnalyzePalmsOutput = z.infer<typeof AnalyzePalmsOutputSchema>;

export async function analyzePalms(input: AnalyzePalmsInput): Promise<AnalyzePalmsOutput> {
  return analyzePalmsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePalmsPrompt',
  input: {schema: AnalyzePalmsInputSchema},
  output: {schema: AnalyzePalmsOutputSchema},
  config: {
    temperature: 0.2,
  },
  prompt: `You are an expert palm reader. Your task is to analyze the user's left and right palms from the provided images and deliver a comprehensive, synthesized reading.

Left Palm (Potential & Karma): {{media url=leftHandPhoto}}
Right Palm (Action & Current Life): {{media url=rightHandPhoto}}

Your analysis must be comprehensive. Please perform the following steps for EACH HAND:

1.  **Identify and Analyze Major Lines:**
    *   Identify and analyze the major palm lines visible in the image: Life Line, Heart Line, Head Line. These three lines are almost always present.
    *   Also, identify and analyze the Fate Line and the Sun Line (also called the Apollo Line) IF they are clearly visible. If they are not visible or are very faint, do not include them in the analysis for that hand.

2.  **Provide Line Coordinates:**
    *   For each line you positively identify, you MUST provide the coordinates for its path.
    *   The path should be an array of {x, y} points.
    *   The coordinates must be normalized, ranging from 0.0 to 1.0, where (0,0) is the top-left corner and (1,1) is the bottom-right corner of the image.
    *   Trace each line from its start to its end with a reasonable number of points (e.g., 5-10 points) to capture its curve accurately.

3.  **Analyze General Features:**
    *   Provide an analysis of the overall hand shape (e.g., classify as Earth, Air, Fire, or Water hand and explain the meaning).
    *   Analyze the prominent mounts, especially the Mounts of Venus, Jupiter, and Saturn, and describe their implications for the person's character and life.

After analyzing both hands individually, create a **Combined Insight**:
*   Compare and contrast the left hand (potential) with the right hand (action).
*   Highlight key differences and what they mean for the person's life journey. For example, "Your left hand shows a strong creative potential (Sun Line), while your right hand's practical Fate Line indicates you've channeled this into a stable career. This suggests you have successfully manifested your innate talents."
*   Provide a holistic summary and advice based on the complete picture from both palms.

4.  **Error Handling:**
    *   If you cannot clearly identify the palm or its lines from an image, set the 'error' field with a helpful message like "The image for the [left/right] hand is unclear. Please provide a clear, well-lit photo of a palm." In this case, do not attempt to provide an analysis for the unclear hand.

Return the full analysis for both hands, all coordinate paths, and the combined insight in the requested JSON format.`,
});

const analyzePalmsFlow = ai.defineFlow(
  {
    name: 'analyzePalmsFlow',
    inputSchema: AnalyzePalmsInputSchema,
    outputSchema: AnalyzePalmsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model failed to return a valid analysis. The image might be unclear.");
    }
    if (output.error) {
        throw new Error(`AI analysis failed: ${output.error}`);
    }
    return output;
  }
);
