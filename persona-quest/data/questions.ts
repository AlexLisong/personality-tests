export type Dimension = "EI" | "SN" | "TF" | "JP" | "AT";

export interface Question {
  id: number;
  text: string;
  textZh: string;
  dimension: Dimension;
  /** positive score = first letter (E, S, T, J, A), negative = second (I, N, F, P, T) */
  direction: 1 | -1;
}

const questions: Question[] = [
  // Energy: Extraversion (E) vs Introversion (I)
  { id: 1, text: "You feel energized after spending time with a large group of people.", textZh: "和一大群人待在一起之后，你会感到精力充沛。", dimension: "EI", direction: 1 },
  { id: 2, text: "You prefer a quiet evening at home over a big party.", textZh: "比起出去聚会，你更喜欢安静地待在家里。", dimension: "EI", direction: -1 },

  // Mind: Sensing (S) vs Intuition (N)
  { id: 3, text: "You focus more on what's happening right now than what might happen in the future.", textZh: "比起未来的可能性，你更关注当下正在发生的事情。", dimension: "SN", direction: 1 },
  { id: 4, text: "You often get lost in daydreams and imaginary scenarios.", textZh: "你经常发现自己沉浸在白日梦和想象的场景中。", dimension: "SN", direction: -1 },

  // Nature: Thinking (T) vs Feeling (F)
  { id: 5, text: "When making decisions, logic matters more to you than people's feelings.", textZh: "做决定时，逻辑对你来说比别人的感受更重要。", dimension: "TF", direction: 1 },
  { id: 6, text: "You find it hard to say no if someone really needs your help, even at your own expense.", textZh: "当别人真的需要你的帮助时，你很难拒绝。", dimension: "TF", direction: -1 },

  // Tactics: Judging (J) vs Perceiving (P)
  { id: 7, text: "You like to have a detailed plan before starting any project.", textZh: "在开始任何项目之前，你喜欢先制定详细的计划。", dimension: "JP", direction: 1 },
  { id: 8, text: "You prefer to keep your options open rather than commit to a fixed schedule.", textZh: "你更喜欢保留选择的余地，随机应变。", dimension: "JP", direction: -1 },

  // Identity: Assertive (A) vs Turbulent (T)
  { id: 9, text: "You rarely second-guess the decisions you've made.", textZh: "你很少对自己已经做出的决定产生怀疑。", dimension: "AT", direction: 1 },
  { id: 10, text: "You often worry about things that might go wrong, even when things are going well.", textZh: "即使一切顺利，你也经常担心可能会出问题。", dimension: "AT", direction: -1 },
];

export default questions;
