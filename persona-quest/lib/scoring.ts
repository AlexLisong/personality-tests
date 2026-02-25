import type { Dimension, Question } from "@/data/questions";

export type Answers = Record<number, number>; // questionId -> value (-3 to +3)

export interface DimensionScore {
  dimension: Dimension;
  labels: [string, string];
  /** 0–100, where 0 = fully second letter, 100 = fully first letter */
  percentage: number;
  winner: string;
}

const dimensionLabels: Record<Dimension, [string, string]> = {
  EI: ["Extraverted", "Introverted"],
  SN: ["Observant", "Intuitive"],
  TF: ["Thinking", "Feeling"],
  JP: ["Judging", "Prospecting"],
  AT: ["Assertive", "Turbulent"],
};

const dimensionLetters: Record<Dimension, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
  AT: ["A", "T"],
};

export function calculateScores(
  questions: Question[],
  answers: Answers
): DimensionScore[] {
  const dimensions: Dimension[] = ["EI", "SN", "TF", "JP", "AT"];

  return dimensions.map((dim) => {
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    if (dimQuestions.length === 0) {
      return {
        dimension: dim,
        labels: dimensionLabels[dim],
        percentage: 50,
        winner: dimensionLetters[dim][0],
      };
    }

    let total = 0;
    let count = 0;

    for (const q of dimQuestions) {
      const answer = answers[q.id];
      if (answer !== undefined) {
        // answer is -3 to +3, direction adjusts sign
        total += answer * q.direction;
        count++;
      }
    }

    // Normalize: total range is [-3*count, +3*count] -> [0, 100]
    const maxPossible = 3 * (count || 1);
    const percentage = Math.round(((total + maxPossible) / (2 * maxPossible)) * 100);
    const letters = dimensionLetters[dim];
    const winner = percentage >= 50 ? letters[0] : letters[1];

    return {
      dimension: dim,
      labels: dimensionLabels[dim],
      percentage,
      winner,
    };
  });
}

export function getPersonalityCode(scores: DimensionScore[]): string {
  const mainType = scores
    .slice(0, 4)
    .map((s) => s.winner)
    .join("");
  const identity = scores[4]?.winner ?? "A";
  return `${mainType}-${identity}`;
}
