import type { DimensionScore } from "./scoring";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  bio: string;
  avatar: string;
  role: "user" | "founder";
  personalityCode: string | null;
  dimensionScores: DimensionScore[] | null;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}

export type PostType = "text" | "result_share" | "announcement";

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  content: string;
  personalityCode: string | null;
  dimensionScores: DimensionScore[] | null;
  likes: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface Course {
  id: string;
  seriesId: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  instructor: string;
  instructorZh: string;
  duration: string;
  order: number;
}

export interface CourseSeries {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  nameZh: string;
  price: number;
  period: string;
  periodZh: string;
  features: string[];
  featuresZh: string[];
}

export interface CourseData {
  series: CourseSeries[];
  courses: Course[];
  tiers: SubscriptionTier[];
}

/** Safe user object without passwordHash */
export type PublicUser = Omit<User, "passwordHash">;
