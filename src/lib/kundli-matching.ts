// lib/kundli-matching.ts
export type KundliProfile = {
  name: string;
  dob: string;
  gender: "male" | "female";
  nakshatra: string; // e.g., "Rohini"
  rashi: string; // e.g., "Vrishabha"
  nadi: "Adi" | "Madhya" | "Antya";
  gana: "Deva" | "Manushya" | "Rakshasa";
};

export type GunaScore = {
  guna: string;
  score: number;
  max: number;
};

export function matchKundli(boy: KundliProfile, girl: KundliProfile): { total: number; details: GunaScore[] } {
  const scores: GunaScore[] = [];

  // Sample rules
  scores.push({
    guna: "Varna",
    score: boy.rashi === girl.rashi ? 1 : 0,
    max: 1,
  });

  scores.push({
    guna: "Vashya",
    score: boy.nakshatra === girl.nakshatra ? 2 : 1,
    max: 2,
  });

  scores.push({
    guna: "Tara",
    score: 2,
    max: 3,
  });

  scores.push({
    guna: "Yoni",
    score: 3,
    max: 4,
  });

  scores.push({
    guna: "Graha Maitri",
    score: 3,
    max: 5,
  });

  scores.push({
    guna: "Gana",
    score: boy.gana === girl.gana ? 6 : 3,
    max: 6,
  });

  scores.push({
    guna: "Bhakoot",
    score: 6,
    max: 7,
  });

  scores.push({
    guna: "Nadi",
    score: boy.nadi !== girl.nadi ? 8 : 0,
    max: 8,
  });

  const total = scores.reduce((sum, g) => sum + g.score, 0);

  return { total, details: scores };
}