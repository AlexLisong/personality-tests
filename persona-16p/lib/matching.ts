import type { DimensionScore } from "./scoring";
import type { Dimension } from "@/data/questions";

interface DimensionWeight {
  dimension: Dimension;
  weight: number;
  mode: "similar" | "complementary" | "averaged";
}

const WEIGHTS: DimensionWeight[] = [
  { dimension: "SN", weight: 0.25, mode: "similar" },
  { dimension: "TF", weight: 0.25, mode: "complementary" },
  { dimension: "JP", weight: 0.20, mode: "similar" },
  { dimension: "EI", weight: 0.15, mode: "averaged" },
  { dimension: "AT", weight: 0.15, mode: "similar" },
];

export interface MatchCategory {
  key: string;
  label: string;
  labelZh: string;
  emoji: string;
}

const CATEGORIES: MatchCategory[] = [
  { key: "soulmate", label: "Soulmate", labelZh: "灵魂伴侣", emoji: "💕" },
  { key: "great", label: "Great Match", labelZh: "非常契合", emoji: "✨" },
  { key: "good", label: "Good Match", labelZh: "比较契合", emoji: "👍" },
  { key: "average", label: "Average", labelZh: "一般", emoji: "🤝" },
  { key: "growth", label: "Needs Effort", labelZh: "需要磨合", emoji: "🌱" },
];

export interface DimensionMatch {
  dimension: Dimension;
  scoreA: number;
  scoreB: number;
  similarity: number;
  weight: number;
  contribution: number;
}

export interface MatchResult {
  score: number;
  category: MatchCategory;
  dimensions: DimensionMatch[];
}

function getDimensionPct(scores: DimensionScore[], dim: Dimension): number {
  return scores.find((s) => s.dimension === dim)?.percentage ?? 50;
}

function similarityScore(a: number, b: number): number {
  return 100 - Math.abs(a - b);
}

function complementaryScore(a: number, b: number): number {
  return Math.abs(a - b);
}

export function calculateMatch(scoresA: DimensionScore[], scoresB: DimensionScore[]): MatchResult {
  const dimensions: DimensionMatch[] = WEIGHTS.map(({ dimension, weight, mode }) => {
    const a = getDimensionPct(scoresA, dimension);
    const b = getDimensionPct(scoresB, dimension);

    let similarity: number;
    if (mode === "similar") {
      similarity = similarityScore(a, b);
    } else if (mode === "complementary") {
      similarity = complementaryScore(a, b);
    } else {
      similarity = (similarityScore(a, b) + complementaryScore(a, b)) / 2;
    }

    return {
      dimension,
      scoreA: a,
      scoreB: b,
      similarity,
      weight,
      contribution: similarity * weight,
    };
  });

  const score = Math.round(dimensions.reduce((sum, d) => sum + d.contribution, 0));
  const clampedScore = Math.max(0, Math.min(100, score));

  let category: MatchCategory;
  if (clampedScore >= 85) category = CATEGORIES[0];
  else if (clampedScore >= 70) category = CATEGORIES[1];
  else if (clampedScore >= 55) category = CATEGORIES[2];
  else if (clampedScore >= 40) category = CATEGORIES[3];
  else category = CATEGORIES[4];

  return { score: clampedScore, category, dimensions };
}
