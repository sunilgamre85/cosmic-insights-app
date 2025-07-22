// This file is no longer used for the main analysis, 
// as the logic has been upgraded to a more detailed AI flow 
// in src/ai/flows/ai-mobile-numerology-analysis.ts.
// It is kept for reference or potential future use in simple, non-AI contexts.

export type NumerologyResult = {
  number: string;
  sum: number;
  reduced: number;
  meaning: string;
};

export function analyzeMobileNumber(number: string): NumerologyResult {
  const digits = number.replace(/\D/g, "").split("").map(Number);

  const sum = digits.reduce((acc, n) => acc + n, 0);

  let reduced = sum;
  while (reduced > 9) {
    reduced = reduced.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }

  const meaning = getNumerologyMeaning(reduced);

  return {
    number,
    sum,
    reduced,
    meaning,
  };
}

function getNumerologyMeaning(num: number): string {
  switch (num) {
    case 1: return "Leadership, originality, independence.";
    case 2: return "Sensitivity, harmony, cooperation.";
    case 3: return "Creativity, joy, communication.";
    case 4: return "Stability, discipline, hard work.";
    case 5: return "Freedom, adventure, change.";
    case 6: return "Responsibility, care, protection.";
    case 7: return "Spirituality, mystery, analysis.";
    case 8: return "Power, ambition, success.";
    case 9: return "Compassion, wisdom, completion.";
    default: return "Unknown";
  }
}
