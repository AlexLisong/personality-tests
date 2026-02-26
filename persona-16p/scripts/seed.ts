/**
 * Seed script: run with `npx tsx scripts/seed.ts`
 *
 * Creates:
 * - Founder account (username: founder, password: founder123)
 * - 2 course series (亲密关系 + 智慧女人) with 25 courses
 * - 4 subscription tiers
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";

const DB = join(__dirname, "..", "db");
mkdirSync(DB, { recursive: true });

// ── Founder user ──
const founderId = randomUUID();
const users = [
  {
    id: founderId,
    username: "founder",
    passwordHash: hashSync("founder123", 10),
    displayName: "平台创始人",
    bio: "先学习，再连接；先成长，再相遇。",
    avatar: "👩‍🏫",
    role: "founder",
    personalityCode: "ENFJ-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 72, letter: "E" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 35, letter: "N" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 38, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 68, letter: "J" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 75, letter: "A" },
    ],
    createdAt: new Date().toISOString(),
  },
];

// ── Course series ──
const seriesRelationship = randomUUID();
const seriesWisdom = randomUUID();

const series = [
  {
    id: seriesRelationship,
    name: "Intimate Relationship",
    nameZh: "亲密关系成长课",
    description: "Build deeper, healthier relationships through self-awareness.",
    descriptionZh: "通过自我认知，建立更深层、更健康的亲密关系。",
  },
  {
    id: seriesWisdom,
    name: "Wise Woman",
    nameZh: "智慧女人修炼课",
    description: "Cultivate inner wisdom, confidence, and emotional intelligence.",
    descriptionZh: "培养内在智慧、自信和情商。",
  },
];

// ── Courses: 亲密关系 (13) ──
const relationshipCourses = [
  { title: "Understanding Attachment Styles", titleZh: "理解依恋风格", desc: "Explore how your attachment style shapes your relationships.", descZh: "探索依恋风格如何影响你的关系。", duration: "45 min" },
  { title: "Love Languages Decoded", titleZh: "爱的语言解码", desc: "Discover the five love languages and speak your partner's.", descZh: "发现五种爱的语言，学会伴侣的表达方式。", duration: "40 min" },
  { title: "Conflict to Connection", titleZh: "从冲突到连接", desc: "Transform relationship conflicts into opportunities for growth.", descZh: "将关系冲突转化为成长的机会。", duration: "50 min" },
  { title: "Boundaries with Love", titleZh: "带着爱设立边界", desc: "Learn to set healthy boundaries without losing intimacy.", descZh: "学会设立健康边界而不失亲密感。", duration: "35 min" },
  { title: "Emotional Availability", titleZh: "情感可用性", desc: "Be present and emotionally available for your partner.", descZh: "学会在关系中保持情感在场和可用。", duration: "40 min" },
  { title: "Healing Relationship Wounds", titleZh: "疗愈关系创伤", desc: "Process past hurts and build trust again.", descZh: "处理过去的伤痛，重建信任。", duration: "55 min" },
  { title: "Personality & Partnership", titleZh: "人格与伴侣关系", desc: "How personality types interact in intimate relationships.", descZh: "不同人格类型在亲密关系中的互动方式。", duration: "45 min" },
  { title: "Communication Masterclass", titleZh: "沟通大师课", desc: "Master the art of non-violent communication with your partner.", descZh: "掌握与伴侣的非暴力沟通艺术。", duration: "50 min" },
  { title: "Rekindling Passion", titleZh: "重燃激情", desc: "Practical strategies to maintain passion in long-term relationships.", descZh: "在长期关系中保持激情的实用策略。", duration: "40 min" },
  { title: "Growing Together", titleZh: "共同成长", desc: "Align personal growth goals with your relationship vision.", descZh: "将个人成长目标与关系愿景对齐。", duration: "45 min" },
  { title: "Trust Building 101", titleZh: "信任建设基础", desc: "Build and maintain trust as the foundation of love.", descZh: "建立并维护信任作为爱的基石。", duration: "35 min" },
  { title: "Navigating Life Transitions", titleZh: "应对人生转折", desc: "Support each other through major life changes.", descZh: "在重大人生变化中互相支持。", duration: "45 min" },
  { title: "Creating Shared Rituals", titleZh: "创造共同仪式", desc: "Build meaningful daily and weekly rituals together.", descZh: "一起建立有意义的日常和每周仪式。", duration: "30 min" },
];

// ── Courses: 智慧女人 (12) ──
const wisdomCourses = [
  { title: "Know Your Worth", titleZh: "认识自我价值", desc: "Build unshakable self-worth from the inside out.", descZh: "由内而外建立坚定的自我价值感。", duration: "40 min" },
  { title: "Emotional Intelligence", titleZh: "情商修炼", desc: "Develop emotional awareness and regulation skills.", descZh: "培养情绪觉察和调节能力。", duration: "45 min" },
  { title: "Setting Life Priorities", titleZh: "设定人生优先级", desc: "Clarify what matters most and align your actions.", descZh: "明确最重要的事物并对齐行动。", duration: "35 min" },
  { title: "Inner Confidence", titleZh: "内在自信", desc: "Cultivate genuine confidence that doesn't depend on external validation.", descZh: "培养不依赖外部认可的真正自信。", duration: "40 min" },
  { title: "Stress & Self-Care", titleZh: "压力管理与自我关爱", desc: "Practical self-care strategies for busy modern women.", descZh: "忙碌现代女性的实用自我关爱策略。", duration: "35 min" },
  { title: "Financial Wisdom", titleZh: "财务智慧", desc: "Build financial independence and smart money habits.", descZh: "建立财务独立和智慧理财习惯。", duration: "50 min" },
  { title: "Career & Calling", titleZh: "事业与使命", desc: "Find the intersection of passion, skill, and purpose.", descZh: "找到热情、技能与使命的交汇点。", duration: "45 min" },
  { title: "Social Grace", titleZh: "社交礼仪", desc: "Navigate social situations with elegance and authenticity.", descZh: "优雅而真实地应对社交场合。", duration: "30 min" },
  { title: "Mindfulness Practice", titleZh: "正念练习", desc: "Integrate mindfulness into everyday life for clarity and calm.", descZh: "将正念融入日常生活，获得清晰与平静。", duration: "40 min" },
  { title: "Feminine Leadership", titleZh: "女性领导力", desc: "Lead with empathy, vision, and authentic feminine strength.", descZh: "以共情、远见和真实的女性力量来领导。", duration: "45 min" },
  { title: "Letting Go & Moving On", titleZh: "放下与前行", desc: "Release what no longer serves you and embrace the new.", descZh: "释放不再适合的，拥抱新的开始。", duration: "35 min" },
  { title: "Legacy & Impact", titleZh: "传承与影响力", desc: "Define the legacy you want to leave and start building it.", descZh: "定义你想留下的传承并开始建设。", duration: "40 min" },
];

const courses = [
  ...relationshipCourses.map((c, i) => ({
    id: randomUUID(),
    seriesId: seriesRelationship,
    title: c.title,
    titleZh: c.titleZh,
    description: c.desc,
    descriptionZh: c.descZh,
    instructor: "Relationship Coach",
    instructorZh: "亲密关系导师",
    duration: c.duration,
    order: i + 1,
  })),
  ...wisdomCourses.map((c, i) => ({
    id: randomUUID(),
    seriesId: seriesWisdom,
    title: c.title,
    titleZh: c.titleZh,
    description: c.desc,
    descriptionZh: c.descZh,
    instructor: "Life Coach",
    instructorZh: "人生导师",
    duration: c.duration,
    order: i + 1,
  })),
];

// ── Subscription tiers ──
const tiers = [
  {
    id: randomUUID(),
    name: "Experience",
    nameZh: "体验",
    price: 99,
    period: "month",
    periodZh: "月",
    features: ["Access 3 courses per month", "Community feed access", "Basic personality matching"],
    featuresZh: ["每月解锁3门课程", "社区动态访问", "基础人格匹配"],
  },
  {
    id: randomUUID(),
    name: "Growth",
    nameZh: "成长",
    price: 299,
    period: "month",
    periodZh: "月",
    features: ["Unlimited course access", "Priority matching", "Chat with matched users", "Monthly group session"],
    featuresZh: ["无限课程访问", "优先匹配", "与匹配用户聊天", "每月团体课程"],
  },
  {
    id: randomUUID(),
    name: "Transform",
    nameZh: "蜕变",
    price: 699,
    period: "month",
    periodZh: "月",
    features: ["Everything in Growth", "1-on-1 coaching session", "Advanced relationship reports", "Early access to new courses"],
    featuresZh: ["包含成长版所有权益", "一对一辅导课程", "高级关系报告", "新课程抢先体验"],
  },
  {
    id: randomUUID(),
    name: "Ultimate",
    nameZh: "至尊",
    price: 1999,
    period: "month",
    periodZh: "月",
    features: ["Everything in Transform", "Weekly 1-on-1 coaching", "VIP community access", "Custom personality deep-dive", "Lifetime course updates"],
    featuresZh: ["包含蜕变版所有权益", "每周一对一辅导", "VIP社区访问", "定制人格深度分析", "终身课程更新"],
  },
];

// ── Write files ──
writeFileSync(join(DB, "users.json"), JSON.stringify(users, null, 2));
writeFileSync(join(DB, "sessions.json"), "[]");
writeFileSync(join(DB, "posts.json"), "[]");
writeFileSync(join(DB, "comments.json"), "[]");
writeFileSync(join(DB, "conversations.json"), "[]");
writeFileSync(join(DB, "messages.json"), "[]");
writeFileSync(join(DB, "courses.json"), JSON.stringify({ series, courses, tiers }, null, 2));

console.log("Seed complete!");
console.log(`  Founder: username=founder password=founder123 id=${founderId}`);
console.log(`  Series: ${series.length}`);
console.log(`  Courses: ${courses.length}`);
console.log(`  Tiers: ${tiers.length}`);
