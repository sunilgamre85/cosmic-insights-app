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
});
export type MobileNumerologyAnalysisOutput = z.infer<typeof MobileNumerologyAnalysisOutputSchema>;

function calculateSingleDigit(numberStr: string): number {
    let sum = numberStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum;
}

export async function mobileNumerologyAnalysis(input: MobileNumerologyAnalysisInput): Promise<MobileNumerologyAnalysisOutput> {
  return mobileNumerologyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mobileNumerologyAnalysisPrompt',
  input: {schema: MobileNumerologyAnalysisInputSchema},
  output: {schema: MobileNumerologyAnalysisOutputSchema},
  prompt: `You are an expert numerologist specializing in mobile number numerology.

Analyze the provided mobile number. The final vibration number has been pre-calculated for you.

Mobile Number: {{{mobileNumber}}}
Vibration Number: {{{vibrationNumber}}}
{{#if name}}
Name: {{{name}}}
{{/if}}
{{#if dateOfBirth}}
Date of Birth: {{{dateOfBirth}}}
{{/if}}

1.  **Analyze the Vibration Number:** Provide a detailed analysis of the vibration number ({{{vibrationNumber}}}). Explain its meaning, the planet it's associated with, and its general characteristics (e.g., leadership, creativity, wealth, challenges).

2.  **Compatibility Analysis (if DOB is provided):** 
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
