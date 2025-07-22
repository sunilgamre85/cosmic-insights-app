'use server';
/**
 * @fileOverview A mobile number numerology analysis AI agent.
 *
 * - mobileNumerologyAnalysis - A function that handles the mobile number numerology analysis process.
 * - MobileNumerologyAnalysisInput - The input type for the mobileNumerologyAnalysis function.
 * - MobileNumerologyAnalysisOutput - The return type for the mobileNumerologyAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MobileNumerologyAnalysisInputSchema = z.object({
  mobileNumber: z.string().describe('The 10-digit mobile number.'),
  name: z.string().optional().describe('The name of the person (optional).'),
  dateOfBirth: z.string().optional().describe('The date of birth of the person (YYYY-MM-DD, optional).'),
});
export type MobileNumerologyAnalysisInput = z.infer<typeof MobileNumerologyAnalysisInputSchema>;

const MobileNumerologyAnalysisOutputSchema = z.object({
  vibrationNumber: z.number().describe('The single-digit vibration number of the mobile phone.'),
  analysis: z.string().describe('A detailed analysis of the mobile number\'s vibration and its meaning.'),
  compatibility: z.string().optional().describe('An analysis of the mobile number\'s compatibility with the person\'s Life Path Number, if DOB was provided.'),
  rulingPlanet: z.string().describe("The planet that rules the vibration number."),
  gemstone: z.string().describe("A gemstone recommendation based on the vibration number."),
  remedies: z.array(z.string()).describe("A list of simple remedies to enhance the number's positive effects or mitigate negative ones."),
  affirmation: z.string().describe("A personalized affirmation based on the number's energy."),
});
export type MobileNumerologyAnalysisOutput = z.infer<typeof MobileNumerologyAnalysisOutputSchema>;

function calculateSingleDigit(numberStr: string): number {
    let sum = numberStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    while (sum > 9) {
        if (sum === 11 || sum === 22) break; // Master numbers are not reduced further in some contexts, but for mobile we simplify.
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum;
}

export async function mobileNumerologyAnalysis(input: MobileNumerologyAnalysisInput): Promise<MobileNumerologyAnalysisOutput> {
  return mobileNumerologyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mobileNumerologyAnalysisPrompt',
  input: {schema: z.object({ ...MobileNumerologyAnalysisInputSchema.shape, vibrationNumber: z.number() })},
  output: {schema: MobileNumerologyAnalysisOutputSchema},
  prompt: `You are an expert numerologist specializing in mobile number numerology. Analyze the provided mobile number.

Mobile Number: {{{mobileNumber}}}
Vibration Number: {{{vibrationNumber}}}
{{#if name}}
Name: {{{name}}}
{{/if}}
{{#if dateOfBirth}}
Date of Birth: {{{dateOfBirth}}}
{{/if}}

Please provide a full analysis in the requested JSON format, covering these points:
1.  **Vibration Number Analysis:** Provide a detailed analysis of the vibration number ({{{vibrationNumber}}}). Explain its meaning, its general characteristics (e.g., leadership, creativity, wealth, challenges).
2.  **Ruling Planet:** Identify the ruling planet for the vibration number.
3.  **Gemstone Recommendation:** Suggest a suitable gemstone for the vibration number.
4.  **Remedies:** Provide 2-3 simple, practical remedies to enhance the positive effects or mitigate the negative ones associated with the number.
5.  **Personalized Affirmation:** Create a short, powerful, personalized affirmation that aligns with the energy of the vibration number.
6.  **Compatibility Analysis (if DOB is provided):** 
    {{#if dateOfBirth}}
    The user's date of birth is {{{dateOfBirth}}}. First, calculate their Life Path Number. Then, analyze the compatibility between the mobile number's vibration ({{{vibrationNumber}}}) and their Life Path Number. Explain whether this is a positive, neutral, or challenging combination and why. Provide advice based on this compatibility.
    {{else}}
    Date of birth was not provided, so skip the compatibility analysis.
    {{/if}}
    
Provide the output in the requested JSON format. The 'compatibility' field should only be filled if a date of birth is provided.`,
});

const mobileNumerologyAnalysisFlow = ai.defineFlow(
  {
    name: 'mobileNumerologyAnalysisFlow',
    inputSchema: MobileNumerologyAnalysisInputSchema,
    outputSchema: MobileNumerologyAnalysisOutputSchema,
  },
  async input => {
    const vibrationNumber = calculateSingleDigit(input.mobileNumber.replace(/\D/g, ''));
    
    const {output} = await prompt({...input, vibrationNumber});
    return output!;
  }
);
