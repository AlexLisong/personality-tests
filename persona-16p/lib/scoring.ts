import type { Question, Dimension } from "@/data/questions";

export type Answers = Record<number, number>;

export interface DimensionScore {
  dimension: Dimension;
  labels: [string, string];
  percentage: number;
  letter: string;
}

const dimensionLabels: Record<Dimension, [string, string]> = {
  EI: ["Extraverted", "Introverted"],
  SN: ["Observant", "Intuitive"],
  TF: ["Thinking", "Feeling"],
  JP: ["Judging", "Prospecting"],
  AT: ["Assertive", "Turbulent"],
};

export function calculateScores(questions: Question[], answers: Answers): DimensionScore[] {
  const dims: Dimension[] = ["EI", "SN", "TF", "JP", "AT"];

  return dims.map((dim) => {
    const qs = questions.filter((q) => q.dimension === dim);
    let raw = 0;
    let count = 0;
    for (const q of qs) {
      if (answers[q.id] !== undefined) {
        raw += answers[q.id] * q.direction;
        count++;
      }
    }
    const maxRange = count * 3;
    const pct = maxRange > 0 ? Math.round(((raw + maxRange) / (2 * maxRange)) * 100) : 50;
    const labels = dimensionLabels[dim];
    const letter = pct >= 50 ? dim[0] : dim[1];
    return { dimension: dim, labels, percentage: pct, letter };
  });
}

export function getPersonalityCode(scores: DimensionScore[]): string {
  const base = scores.slice(0, 4).map((s) => s.letter).join("");
  const identity = scores[4]?.letter ?? "A";
  return `${base}-${identity}`;
}
