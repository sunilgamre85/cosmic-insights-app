'use server';

/**
 * @fileOverview Analyzes user-uploaded images of one or both palms to provide a comprehensive reading.
 *
 * - analyzePalms - A function that handles the palm image analysis process.
 * - AnalyzePalmsInput - The input type for the analyzePalms function.
 * - AnalyzePalmsOutput - The return type for the analyzePalms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePalmsInputSchema = z.object({
  leftHandPhoto: z
    .string()
    .optional()
    .describe(
      "A photo of the user's left palm, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  rightHandPhoto: z
    .string()
    .optional()
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
  lifeLine: LineSchema.optional().describe('Analysis and path of the life line.'),
  heartLine: LineSchema.optional().describe('Analysis and path of the heart line.'),
  headline: LineSchema.optional().describe('Analysis and path of the head line.'),
  fateLine: LineSchema.optional().describe('Analysis and path of the fate line (if visible).'),
  sunLine: LineSchema.optional().describe('Analysis and path of the sun line, also known as the Apollo line (if visible).'),
  healthLine: LineSchema.optional().describe('Analysis and path of the health line (if visible).'),
  marriageLine: LineSchema.optional().describe('Analysis and path of the marriage line(s) (if visible).'),
  generalAnalysis: GeneralAnalysisSchema.optional().describe('General analysis of other important palm features.'),
});

const CombinedReportSchema = z.object({
    personalityTraits: z.string().describe("Synthesized analysis of personality traits based on the provided palms."),
    loveAndRelationships: z.string().describe("Synthesized analysis regarding love, emotions, and relationships."),
    careerAndSuccess: z.string().describe("Synthesized analysis on career, ambition, and potential for success."),
    healthAndVitality: z.string().describe("Synthesized analysis concerning health, energy, and vitality."),
    warningsAndOpportunities: z.string().describe("Highlights of any special signs, warnings, or unique opportunities visible in the palms."),
});

const AnalyzePalmsOutputSchema = z.object({
  leftHandAnalysis: SinglePalmAnalysisSchema.optional().describe("The detailed analysis for the left hand, representing potential and innate traits."),
  rightHandAnalysis: SinglePalmAnalysisSchema.optional().describe("The detailed analysis for the right hand, representing actions and current life path."),
  combinedReport: CombinedReportSchema.optional().describe("A synthesized, structured report comparing and contrasting the two hands to provide a complete, holistic reading. This is only generated if both hands are provided."),
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
  prompt: `You are an expert palm reader. Your task is to analyze the user's provided palm images and deliver a comprehensive reading.

The user has provided the following images:
{{#if leftHandPhoto}}Left Palm (Represents potential & innate traits): {{media url=leftHandPhoto}}{{/if}}
{{#if rightHandPhoto}}Right Palm (Represents action & current life): {{media url=rightHandPhoto}}{{/if}}

Your analysis must be comprehensive. Please perform the following steps:

PART 1: INDIVIDUAL HAND ANALYSIS
- For EACH HAND provided, perform a full analysis.
- If ONLY the left hand is provided, return your analysis in the 'leftHandAnalysis' field and leave 'rightHandAnalysis' empty.
- If ONLY the right hand is provided, return your analysis in the 'rightHandAnalysis' field and leave 'leftHandAnalysis' empty.
- If BOTH hands are provided, perform analysis for both and populate both fields.

For each hand, your analysis should include:
1.  **Analyze General Features:**
    *   Analyze the overall hand shape (classify as Earth, Air, Fire, or Water hand and explain the meaning).
    *   Analyze the prominent mounts, especially Venus, Jupiter, Saturn, and Mercury, and describe their implications.
2.  **Identify and Analyze Major Lines:**
    *   Identify and analyze the major palm lines visible in the image: Life Line, Heart Line, Head Line.
    *   Also, identify and analyze other important lines IF they are clearly visible: Fate Line, Sun Line (Apollo), Health Line, Marriage Line(s). If they are not visible or very faint, do not include them in the analysis for that hand.
3.  **Provide Line Coordinates:**
    *   For each line you positively identify, you MUST provide the coordinates for its path.
    *   The path should be an array of {x, y} points, normalized from 0.0 to 1.0.
    *   Trace each line with enough points (e.g., 5-10) to capture its curve accurately.

PART 2: FINAL REPORT
{{#if leftHandPhoto}}{{#if rightHandPhoto}}
**Create a Combined Report.** Compare and contrast the left hand (potential) with the right hand (action). Synthesize all the information into a holistic, structured report with these sections:
- personalityTraits, loveAndRelationships, careerAndSuccess, healthAndVitality, warningsAndOpportunities.
{{else}}
**Create a Single Hand Report.** Provide a summary report based on the single hand provided. Structure the report into these sections:
- personalityTraits, loveAndRelationships, careerAndSuccess, healthAndVitality, warningsAndOpportunities.
{{/if}}{{else}}
**Create a Single Hand Report.** Provide a summary report based on the single hand provided. Structure the report into these sections:
- personalityTraits, loveAndRelationships, careerAndSuccess, healthAndVitality, warningsAndOpportunities.
{{/if}}

PART 3: ERROR HANDLING
*   If an image is unclear, set the 'error' field with a helpful message. Do not attempt to analyze an unclear hand.
*   If no images are provided, set the 'error' field to "No palm images were provided for analysis."

Return the full analysis in the requested JSON format.`,
});

const analyzePalmsFlow = ai.defineFlow(
  {
    name: 'analyzePalmsFlow',
    inputSchema: AnalyzePalmsInputSchema,
    outputSchema: AnalyzePalmsOutputSchema,
  },
  async input => {
    if (!input.leftHandPhoto && !input.rightHandPhoto) {
        return { error: "Please upload at least one palm image for analysis." };
    }
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
