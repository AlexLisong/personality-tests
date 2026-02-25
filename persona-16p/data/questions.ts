export type Dimension = "EI" | "SN" | "TF" | "JP" | "AT";

export interface Question {
  id: number;
  text: string;
  textZh: string;
  dimension: Dimension;
  direction: 1 | -1;
}

// Color group for each dimension (matches 16personalities)
export const dimensionColors: Record<Dimension, { color: string; colorLight: string; label: string; labelZh: string }> = {
  EI: { color: "var(--dimension-ei-color)", colorLight: "var(--dimension-ei-color-light)", label: "Mind", labelZh: "精力" },
  SN: { color: "var(--dimension-sn-color)", colorLight: "var(--dimension-sn-color-light)", label: "Energy", labelZh: "认知" },
  TF: { color: "var(--dimension-tf-color)", colorLight: "var(--dimension-tf-color-light)", label: "Nature", labelZh: "本性" },
  JP: { color: "var(--dimension-jp-color)", colorLight: "var(--dimension-jp-color-light)", label: "Tactics", labelZh: "策略" },
  AT: { color: "var(--dimension-at-color)", colorLight: "var(--dimension-at-color-light)", label: "Identity", labelZh: "身份" },
};

const questions: Question[] = [
  { id: 1, text: "You regularly make new friends.", textZh: "你经常结交新朋友。", dimension: "EI", direction: 1 },
  { id: 2, text: "You prefer a quiet evening at home over a big party.", textZh: "比起热闹的聚会，你更喜欢安静地待在家里。", dimension: "EI", direction: -1 },
  { id: 3, text: "You focus more on what's happening right now than what might happen in the future.", textZh: "比起未来的可能性，你更关注当下正在发生的事情。", dimension: "SN", direction: 1 },
  { id: 4, text: "Complex and novel ideas excite you more than simple and straightforward ones.", textZh: "复杂而新颖的想法比简单直接的更让你兴奋。", dimension: "SN", direction: -1 },
  { id: 5, text: "When making decisions, logic matters more to you than people's feelings.", textZh: "做决定时，逻辑对你来说比别人的感受更重要。", dimension: "TF", direction: 1 },
  { id: 6, text: "You find it hard to say no if someone really needs your help.", textZh: "当别人真的需要你的帮助时，你很难拒绝。", dimension: "TF", direction: -1 },
  { id: 7, text: "Your living and working spaces are clean and organized.", textZh: "你的生活和工作空间整洁有序。", dimension: "JP", direction: 1 },
  { id: 8, text: "You prefer to keep your options open rather than commit to a fixed schedule.", textZh: "你更喜欢保留选择的余地，而不是制定固定计划。", dimension: "JP", direction: -1 },
  { id: 9, text: "You usually stay calm, even under a lot of pressure.", textZh: "即使在很大压力下，你通常也能保持冷静。", dimension: "AT", direction: 1 },
  { id: 10, text: "You often worry about things that might go wrong, even when things are going well.", textZh: "即使一切顺利，你也经常担心可能会出问题。", dimension: "AT", direction: -1 },
];

export default questions;
