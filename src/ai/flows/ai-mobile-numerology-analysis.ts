'use server';
/**
 * @fileOverview A mobile numerology analysis AI agent that checks compatibility with user's core numbers.
 *
 * - aiMobileNumerologyAnalysis - A function that handles the analysis process.
 * - AiMobileNumerologyAnalysisInput - The input type for the function.
 * - AiMobileNumerologyAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMobileNumerologyAnalysisInputSchema = z.object({
  name: z.string().describe("The user's full name."),
  dateOfBirth: z.string().describe("The user's date of birth (YYYY-MM-DD)."),
  mobileNumber: z.string().describe("The user's mobile number."),
});
export type AiMobileNumerologyAnalysisInput = z.infer<typeof AiMobileNumerologyAnalysisInputSchema>;

const AiMobileNumerologyAnalysisOutputSchema = z.object({
  originalMobileNumber: z.string().describe("The mobile number that was analyzed."),
  mobileNumberTotal: z.number().describe("The final single-digit sum of the mobile number."),
  compatibilityAnalysis: z.string().describe("A detailed analysis of how the mobile number's vibration interacts with the user's Life Path and Destiny numbers."),
});
export type AiMobileNumerologyAnalysisOutput = z.infer<typeof AiMobileNumerologyAnalysisOutputSchema>;

export async function aiMobileNumerologyAnalysis(input: AiMobileNumerologyAnalysisInput): Promise<AiMobileNumerologyAnalysisOutput> {
  return aiMobileNumerologyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMobileNumerologyAnalysisPrompt',
  input: {schema: AiMobileNumerologyAnalysisInputSchema},
  output: {schema: AiMobileNumerologyAnalysisOutputSchema},
  config: {
    temperature: 0.2,
  },
  prompt: `You are an expert numerologist. Your task is to analyze a person's mobile number and determine its compatibility with their core numerology numbers (Life Path and Destiny Number).

User Details:
- Name: {{{name}}}
- Date of Birth: {{{dateOfBirth}}}
- Mobile Number: {{{mobileNumber}}}

Instructions:
1.  First, calculate the Life Path Number from the user's Date of Birth.
2.  Second, calculate the Destiny (or Expression) Number from the user's full Name.
3.  Third, calculate the single-digit total of the mobile number.
4.  Finally, provide a detailed compatibility analysis. Explain whether the mobile number's vibration is harmonious, challenging, or neutral in relation to their Life Path and Destiny numbers. Give practical advice based on this compatibility. For example, if the number is good for business, or if it might cause communication issues.

Provide the analysis in the requested JSON format. The 'originalMobileNumber' should be the number provided by the user. The 'mobileNumberTotal' is the final single digit sum. 'compatibilityAnalysis' should contain your full, detailed explanation.
`,
});

const aiMobileNumerologyAnalysisFlow = ai.defineFlow(
  {
    name: 'aiMobileNumerologyAnalysisFlow',
    inputSchema: AiMobileNumerologyAnalysisInputSchema,
    outputSchema: AiMobileNumerologyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
