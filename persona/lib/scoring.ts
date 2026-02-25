import type { Dimension, Question } from "@/data/questions";

export type Answers = Record<number, number>;

export interface DimensionScore {
  dimension: Dimension;
  labels: [string, string];
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

export function calculateScores(questions: Question[], answers: Answers): DimensionScore[] {
  const dims: Dimension[] = ["EI", "SN", "TF", "JP", "AT"];

  return dims.map((dim) => {
    const qs = questions.filter((q) => q.dimension === dim);
    if (!qs.length) return { dimension: dim, labels: dimensionLabels[dim], percentage: 50, winner: dimensionLetters[dim][0] };

    let total = 0, count = 0;
    for (const q of qs) {
      const a = answers[q.id];
      if (a !== undefined) { total += a * q.direction; count++; }
    }

    const max = 2 * (count || 1);
    const pct = Math.round(((total + max) / (2 * max)) * 100);
    const letters = dimensionLetters[dim];
    return { dimension: dim, labels: dimensionLabels[dim], percentage: pct, winner: pct >= 50 ? letters[0] : letters[1] };
  });
}

export function getPersonalityCode(scores: DimensionScore[]): string {
  return scores.slice(0, 4).map((s) => s.winner).join("") + "-" + (scores[4]?.winner ?? "A");
}
