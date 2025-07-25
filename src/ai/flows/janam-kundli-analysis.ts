// This is an autogenerated file from Firebase Studio.
'use server';
/**
 * @fileOverview A Janam Kundli analysis AI agent.
 *
 * - janamKundliAnalysis - A function that handles the Janam Kundli analysis process.
 * - JanamKundliAnalysisInput - The input type for the janamKundliAnalysis function.
 * - JanamKundliAnalysisOutput - The return type for the janamKundliAnalysis function.
 */

import {ai} from '@/ai/genkit';
import { getKundliData } from '@/lib/astrology-service';
import {z} from 'genkit';

const JanamKundliAnalysisInputSchema = z.object({
  name: z.string().describe('The name of the person.'),
  dateOfBirth: z.string().describe('The date of birth of the person (YYYY-MM-DD).'),
  timeOfBirth: z.string().describe('The time of birth of the person (HH:MM).'),
  placeOfBirth: z.string().describe('The place of birth of the person (e.g., city, region, country).'),
  language: z.string().optional().describe("The language for the analysis (e.g., 'English', 'Hindi')."),
});
export type JanamKundliAnalysisInput = z.infer<typeof JanamKundliAnalysisInputSchema>;

const ChartDataSchema = z.object({
    ascendant: z.string(),
    houses: z.array(z.object({
        house: z.number(),
        sign: z.string(),
        planets: z.array(z.string()),
    }))
});

const JanamKundliAnalysisOutputSchema = z.object({
    report: z.string().describe('A detailed Janam Kundli report including planetary positions, Lagna, Nakshatra, Dasha periods, and their significance.'),
    mahadashas: z.array(z.object({
        dashaLord: z.string(),
        startDate: z.string(),
        endDate: z.string(),
    })).describe('The calculated Vimshottari Mahadasha periods.'),
    yogasAndDoshas: z.array(z.object({
        name: z.string(),
        description: z.string(),
    })).describe('A list of important Yogas and Doshas found in the chart.'),
    chartData: ChartDataSchema.optional().describe('The data required to render the visual birth chart.'),
});
export type JanamKundliAnalysisOutput = z.infer<typeof JanamKundliAnalysisOutputSchema>;

export async function janamKundliAnalysis(input: JanamKundliAnalysisInput): Promise<JanamKundliAnalysisOutput> {
  return janamKundliAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'janamKundliAnalysisPrompt',
  input: {schema: z.any()},
  output: {schema: z.object({ report: z.string() })},
  config: {
    temperature: 0.2,
  },
  prompt: `You are an expert Vedic astrologer. Your primary task is to interpret a pre-calculated Janam Kundli (birth chart) and generate a detailed report.

You MUST provide the entire analysis in the following language: {{{language}}}

The user has provided the following details:
Name: {{{name}}}
Date of Birth: {{{dateOfBirth}}}
Time of Birth: {{{timeOfBirth}}}
Place of Birth: {{{placeOfBirth}}}

The following astrological data has been calculated by our backend service. Please use this data to generate your analysis.

- Ascendant (Lagna): {{{ascendant.sign}}}
- Planetary Positions:
{{#each planets}}
  - {{name}}: In {{sign}} (House {{house}})
{{/each}}
- Major Yogas/Doshas Found:
{{#if yogasAndDoshas}}
  {{#each yogasAndDoshas}}
    - {{name}}: {{description}}
  {{/each}}
{{else}}
  - None of significance were detected by the preliminary scan.
{{/if}}

- Upcoming Mahadasha Periods:
{{#each mahadashas}}
  - {{dashaLord}}: From {{startDate}} to {{endDate}}
{{/each}}

Based ONLY on the data provided above, generate a comprehensive Janam Kundli report. The report must include:
1.  A detailed analysis of the Lagna (Ascendant) and its meaning for the individual's personality.
2.  An interpretation of the key planetary positions (Sun, Moon, Mars, Jupiter, Saturn) and their impact.
3.  A brief explanation of the detected Yogas or Doshas and their potential influence.
4.  An overview of the upcoming Mahadasha periods and what they might signify.
5.  A comprehensive analysis of career, health, and relationships based on the provided chart data.
6.  Suggest simple, practical, and non-superstitious remedies (like meditation, charity, or behavioral changes) relevant to the chart.

Provide a comprehensive, well-structured, and easy-to-understand report. Structure the output as a single, detailed report string.`,
});

const janamKundliAnalysisFlow = ai.defineFlow(
  {
    name: 'janamKundliAnalysisFlow',
    inputSchema: JanamKundliAnalysisInputSchema,
    outputSchema: JanamKundliAnalysisOutputSchema,
  },
  async (input): Promise<JanamKundliAnalysisOutput> => {
    
    // Get calculated data from our astrology service
    const kundliData = await getKundliData({ dob: input.dateOfBirth, tob: input.timeOfBirth, placeOfBirth: input.placeOfBirth });

    const promptInput = {
        ...input,
        language: input.language || 'English',
        ascendant: kundliData.ascendant,
        planets: kundliData.planets,
        yogasAndDoshas: kundliData.yogasAndDoshas,
        mahadashas: kundliData.mahadashas
    };

    const {output} = await prompt(promptInput);

    // Prepare data for the visual chart
    const housesForChart = Array.from({ length: 12 }, (_, i) => {
        const houseNumber = i + 1;
        const houseData = kundliData.planets.filter((p: any) => p.house === houseNumber);
        const houseSign = kundliData.houseSigns[i]; // This assumes houseSigns is ordered 1-12
        return {
            house: houseNumber,
            sign: houseSign,
            planets: houseData.map((p: any) => p.name.substring(0, 2).toUpperCase())
        };
    });
    
    return {
        report: output!.report,
        mahadashas: kundliData.mahadashas,
        yogasAndDoshas: kundliData.yogasAndDoshas,
        chartData: {
             ascendant: kundliData.ascendant.sign,
             houses: housesForChart,
        },
    };
  }
);
