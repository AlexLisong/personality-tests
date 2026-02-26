/**
 * Mock data seed: run with `npx tsx scripts/seed-mock.ts`
 *
 * Creates:
 * - 8 mock users with personality types
 * - 15 feed posts (text, result_share, announcements)
 * - Comments and likes on posts
 * - 3 conversations with the founder
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";

const DB = join(__dirname, "..", "db");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(DB, file), "utf-8"));
}

function writeJson(file: string, data: unknown) {
  writeFileSync(join(DB, file), JSON.stringify(data, null, 2));
}

// ── Find founder ──
const existingUsers = readJson<{ id: string; role: string }[]>("users.json");
const founder = existingUsers.find((u) => u.role === "founder");
if (!founder) {
  console.error("Founder not found. Run `npx tsx scripts/seed.ts` first.");
  process.exit(1);
}
const founderId = founder.id;

// ── Mock users ──
const mockUsers = [
  {
    username: "huangrong",
    displayName: "黄蓉",
    bio: "聪明伶俐，喜欢解谜和策略游戏。外表柔弱内心强大，总能看透人心。",
    avatar: "🌸",
    personalityCode: "INFP-T",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 32, letter: "I" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 28, letter: "N" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 35, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 42, letter: "P" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 38, letter: "T" },
    ],
  },
  {
    username: "dawei",
    displayName: "大卫",
    bio: "牧羊人出身的领袖，善于激励团队。相信勇气和信心能战胜一切巨人。",
    avatar: "👑",
    personalityCode: "ENTJ-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 75, letter: "E" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 30, letter: "N" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 72, letter: "T" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 78, letter: "J" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 80, letter: "A" },
    ],
  },
  {
    username: "lude",
    displayName: "路得",
    bio: "你的国就是我的国。相信忠诚和陪伴是最深沉的爱。",
    avatar: "🌾",
    personalityCode: "ISFJ-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 38, letter: "I" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 65, letter: "S" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 30, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 62, letter: "J" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 70, letter: "A" },
    ],
  },
  {
    username: "linghuchong",
    displayName: "令狐冲",
    bio: "自由不羁的灵魂，爱酒爱笑爱交友。人生得意须尽欢，莫使金樽空对月。",
    avatar: "🍶",
    personalityCode: "ENFP-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 82, letter: "E" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 25, letter: "N" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 40, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 30, letter: "P" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 76, letter: "A" },
    ],
  },
  {
    username: "renyingying",
    displayName: "任盈盈",
    bio: "心理咨询师，用琴声疗愈人心。愿每个人都能找到知音。",
    avatar: "🎵",
    personalityCode: "INFJ-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 35, letter: "I" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 22, letter: "N" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 28, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 65, letter: "J" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 72, letter: "A" },
    ],
  },
  {
    username: "yangguo",
    displayName: "杨过",
    bio: "至情至性，敢爱敢恨。哪怕全世界反对，也要追随内心。",
    avatar: "🦅",
    personalityCode: "ESTP-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 78, letter: "E" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 70, letter: "S" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 68, letter: "T" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 35, letter: "P" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 85, letter: "A" },
    ],
  },
  {
    username: "danieli",
    displayName: "但以理",
    bio: "持守信念的智者，安静却坚定。在纷乱中保持清醒，在逆境中坚守原则。",
    avatar: "🦁",
    personalityCode: "ISTJ-T",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 25, letter: "I" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 72, letter: "S" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 65, letter: "T" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 80, letter: "J" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 35, letter: "T" },
    ],
  },
  {
    username: "yisite",
    displayName: "以斯帖",
    bio: "温柔而勇敢的灵魂。在关键时刻挺身而出，用智慧和勇气守护所爱之人。",
    avatar: "👸",
    personalityCode: "ESFP-A",
    dimensionScores: [
      { dimension: "EI", labels: ["Extraverted", "Introverted"], percentage: 80, letter: "E" },
      { dimension: "SN", labels: ["Observant", "Intuitive"], percentage: 68, letter: "S" },
      { dimension: "TF", labels: ["Thinking", "Feeling"], percentage: 32, letter: "F" },
      { dimension: "JP", labels: ["Judging", "Prospecting"], percentage: 28, letter: "P" },
      { dimension: "AT", labels: ["Assertive", "Turbulent"], percentage: 78, letter: "A" },
    ],
  },
];

const userIds: string[] = [];
const allUsers = [...existingUsers];

for (const mock of mockUsers) {
  // skip if username already exists
  if (allUsers.find((u: any) => u.username === mock.username)) {
    const existing = allUsers.find((u: any) => u.username === mock.username) as any;
    userIds.push(existing.id);
    continue;
  }
  const id = randomUUID();
  userIds.push(id);
  allUsers.push({
    id,
    username: mock.username,
    passwordHash: hashSync("test123", 10),
    displayName: mock.displayName,
    bio: mock.bio,
    avatar: mock.avatar,
    role: "user",
    personalityCode: mock.personalityCode,
    dimensionScores: mock.dimensionScores,
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  } as any);
}

writeJson("users.json", allUsers);

// ── Posts ──
const now = Date.now();
const hour = 3600000;

const posts: any[] = readJson<any[]>("posts.json");

const newPosts = [
  // Founder announcements
  {
    id: randomUUID(),
    authorId: founderId,
    type: "announcement",
    content: "欢迎来到亲密关系成长与连接生态平台！🎉\n\n我们的理念是「先学习，再连接；先成长，再相遇」。希望大家在这里发现自我，找到志同道合的伙伴。\n\n新用户请先完成人格测试，解锁更多功能！",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[1], userIds[2], userIds[3], userIds[4]],
    createdAt: new Date(now - 48 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: founderId,
    type: "announcement",
    content: "本周新课上线：「从冲突到连接」🔥\n\n学习如何将关系中的冲突转化为成长的机会。适合所有希望提升沟通能力的朋友。\n\n课程入口：课程 → 亲密关系成长课",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[2], userIds[5]],
    createdAt: new Date(now - 12 * hour).toISOString(),
  },
  // Result shares
  {
    id: randomUUID(),
    authorId: userIds[0],
    type: "result_share",
    content: "我刚刚发现我是 INFP-T - 调停者！敏感探索者 ✨\n\n原来我一直追求和谐与真实是有原因的～你们觉得准吗？",
    personalityCode: "INFP-T",
    dimensionScores: mockUsers[0].dimensionScores,
    likes: [founderId, userIds[1], userIds[3], userIds[4]],
    createdAt: new Date(now - 36 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[1],
    type: "result_share",
    content: "ENTJ-A 指挥官报到！果敢领袖这个描述我觉得挺符合的 💪\n\n测试说我总能找到出路，这也太准了吧！",
    personalityCode: "ENTJ-A",
    dimensionScores: mockUsers[1].dimensionScores,
    likes: [founderId, userIds[0], userIds[5], userIds[6]],
    createdAt: new Date(now - 30 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[3],
    type: "result_share",
    content: "ENFP-A 竞选者来了！🎪 热情灵魂说的就是我！\n\n总能找到微笑的理由，这一点完全同意 😄",
    personalityCode: "ENFP-A",
    dimensionScores: mockUsers[3].dimensionScores,
    likes: [userIds[0], userIds[1], userIds[2], userIds[4], userIds[7]],
    createdAt: new Date(now - 20 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[7],
    type: "result_share",
    content: "测试结果出来啦！ESFP-A 表演者 🎤\n\n活力表演者到哪里都带来欢乐和活力——我朋友都说太准了哈哈",
    personalityCode: "ESFP-A",
    dimensionScores: mockUsers[7].dimensionScores,
    likes: [userIds[3], userIds[5], founderId],
    createdAt: new Date(now - 8 * hour).toISOString(),
  },
  // Text posts
  {
    id: randomUUID(),
    authorId: userIds[4],
    type: "text",
    content: "今天在咨询中遇到一对INFJ+ENTP的组合，他们的互动模式特别有意思。\n\nINFJ的深度洞察力配上ENTP的创新思维，真的是「绝佳组合」。但也要注意INFJ可能需要更多独处时间，而ENTP需要社交刺激。\n\n大家身边有这种组合吗？",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[1], userIds[2], founderId],
    createdAt: new Date(now - 24 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[2],
    type: "text",
    content: "分享一个小技巧：作为ISFJ，我发现每天早上10分钟的冥想对改善亲密关系特别有帮助。\n\n当你内心平静了，面对伴侣的时候也会更加温和有耐心。推荐大家试试！🧘‍♀️",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[4], userIds[6], founderId],
    createdAt: new Date(now - 18 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[5],
    type: "text",
    content: "作为ESTP，我一直觉得「行动比计划重要」。但最近学了课程才发现，在亲密关系中，有时候慢下来、好好沟通比冲动行动更重要。\n\n感谢这个平台让我有了新的认识！",
    personalityCode: null,
    dimensionScores: null,
    likes: [founderId, userIds[1], userIds[2], userIds[3]],
    createdAt: new Date(now - 14 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[6],
    type: "text",
    content: "ISTJ的我今天做了一件「出格」的事——主动给伴侣写了一封手写信 💌\n\n虽然对我来说表达感情很困难，但看到对方感动的样子，觉得一切都值了。\n\n有没有其他ISTJ也有类似经历？",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[2], userIds[4], founderId, userIds[7]],
    createdAt: new Date(now - 10 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[0],
    type: "text",
    content: "今天看完了「理解依恋风格」这门课，终于明白了为什么我在关系中总是患得患失。\n\n原来这和我的焦虑型依恋模式有关。意识到问题就是改变的第一步！加油💪",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[4], founderId, userIds[2]],
    createdAt: new Date(now - 6 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[3],
    type: "text",
    content: "ENFP和INTJ的你们来聊聊——你们觉得这两个类型在一起合适吗？\n\n我和男朋友就是这个组合，有时候觉得互补得很好，有时候又觉得思维方式差异太大 😅\n\n求分享经验！",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[1], userIds[4], userIds[6], userIds[0]],
    createdAt: new Date(now - 4 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[1],
    type: "text",
    content: "刚完成了「沟通大师课」，里面讲的非暴力沟通四步法真的很实用：\n\n1. 观察（不带评判）\n2. 感受（表达情绪）\n3. 需要（说出需求）\n4. 请求（具体行动）\n\n作为ENTJ，以前总是直接给解决方案，现在学会先倾听了。",
    personalityCode: null,
    dimensionScores: null,
    likes: [founderId, userIds[0], userIds[2], userIds[4], userIds[5], userIds[6]],
    createdAt: new Date(now - 2 * hour).toISOString(),
  },
  {
    id: randomUUID(),
    authorId: userIds[7],
    type: "text",
    content: "周末去参加了一个线下的人格类型工作坊，认识了好多有趣的人！\n\n发现ESFP真的天生就是社交达人 😆 和一个INFP聊了很久关于艺术和创作的话题，感觉非常投缘。\n\n大家有参加过类似活动吗？",
    personalityCode: null,
    dimensionScores: null,
    likes: [userIds[0], userIds[3], founderId],
    createdAt: new Date(now - 1 * hour).toISOString(),
  },
];

posts.push(...newPosts);
writeJson("posts.json", posts);

// ── Comments ──
const comments: any[] = readJson<any[]>("comments.json");

const newComments = [
  // Comments on founder announcement
  { postId: newPosts[0].id, authorId: userIds[0], content: "太棒了！终于找到这样一个平台，期待认识更多人～" },
  { postId: newPosts[0].id, authorId: userIds[4], content: "作为心理咨询师，非常认同这个理念！先成长再相遇。" },
  { postId: newPosts[0].id, authorId: userIds[1], content: "已完成测试！ENTJ报到 💪" },
  // Comments on xiaomei's result share
  { postId: newPosts[2].id, authorId: userIds[4], content: "INFP是非常有创造力和同理心的类型呢！你的敏感是一种天赋 ✨" },
  { postId: newPosts[2].id, authorId: userIds[3], content: "哈哈我是ENFP，我们只差一个字母！一起玩呀～" },
  { postId: newPosts[2].id, authorId: founderId, content: "欢迎蓉儿！INFP在关系中非常忠诚和体贴，建议看看「理解依恋风格」课程 📖" },
  // Comments on dawei's result share
  { postId: newPosts[3].id, authorId: userIds[5], content: "ENTJ和ESTP握手！我们都是行动派 🤝" },
  { postId: newPosts[3].id, authorId: userIds[0], content: "好羡慕你的自信！INFP表示默默点赞" },
  // Comments on yingying's post about INFJ+ENTP
  { postId: newPosts[6].id, authorId: userIds[1], content: "作为ENTJ（和ENTP很像），我确认创新思维的人确实需要有人拉住缰绳 😂" },
  { postId: newPosts[6].id, authorId: userIds[0], content: "虽然我不是INFJ但作为INFP也非常需要独处时间！" },
  { postId: newPosts[6].id, authorId: userIds[3], content: "ENTP和INFJ确实是经典组合！我认识一对结婚十年了，非常幸福 ❤️" },
  // Comments on xiaowen's letter post
  { postId: newPosts[9].id, authorId: userIds[2], content: "好感动！手写信在这个时代太珍贵了 💌" },
  { postId: newPosts[9].id, authorId: userIds[4], content: "ISTJ虽然不善表达，但一旦行动起来比谁都真诚。你做得很棒！" },
  { postId: newPosts[9].id, authorId: userIds[0], content: "呜呜呜好浪漫！我也想收到手写信 😭" },
  // Comments on junjun's ENFP+INTJ question
  { postId: newPosts[11].id, authorId: userIds[1], content: "我虽然是ENTJ不是INTJ，但NT组合确实和NF的思维方式差异很大。关键是互相尊重对方的处理方式。" },
  { postId: newPosts[11].id, authorId: userIds[4], content: "这个组合在心理学上叫「互补型」，双方能从对方身上学到很多。建议多沟通各自的需求～" },
  { postId: newPosts[11].id, authorId: userIds[6], content: "我和老婆就是ISTJ+ENFP，差异更大但12年了还是很幸福。包容和理解最重要！" },
  // Comments on dawei's communication course post
  { postId: newPosts[12].id, authorId: founderId, content: "大卫说得太好了！非暴力沟通是每段关系的必修课。" },
  { postId: newPosts[12].id, authorId: userIds[0], content: "收藏了！这四步法我要打印出来贴在墙上 📋" },
  { postId: newPosts[12].id, authorId: userIds[2], content: "先倾听再建议，这也是我在瑜伽中学到的——先静心再行动 🙏" },
];

for (const c of newComments) {
  comments.push({
    id: randomUUID(),
    postId: c.postId,
    authorId: c.authorId,
    content: c.content,
    createdAt: new Date(now - Math.random() * 2 * hour).toISOString(),
  });
}

writeJson("comments.json", comments);

// ── Conversations with founder ──
const conversations: any[] = readJson<any[]>("conversations.json");
const messages: any[] = readJson<any[]>("messages.json");

// Conversation 1: 黄蓉 ↔ Founder
const conv1Id = randomUUID();
conversations.push({
  id: conv1Id,
  participants: [founderId, userIds[0]],
  lastMessageAt: new Date(now - 1 * hour).toISOString(),
  createdAt: new Date(now - 24 * hour).toISOString(),
});

const conv1Messages = [
  { senderId: userIds[0], content: "老师您好！我刚测完人格测试，结果是INFP-T，想请教一下这个类型在亲密关系中需要注意什么？", time: 24 },
  { senderId: founderId, content: "蓉儿你好！INFP是非常有深度和同理心的类型。在亲密关系中，你可能会有以下特点：\n\n1. 非常忠诚和投入\n2. 对伴侣有很高的理想期望\n3. 需要足够的独处空间\n4. 可能会回避冲突", time: 23 },
  { senderId: userIds[0], content: "太准了！尤其是回避冲突这一点…我每次有矛盾都不敢说出来 😢", time: 22 },
  { senderId: founderId, content: "这很正常。建议你看看我们的「从冲突到连接」课程，里面有专门针对回避型人格的沟通技巧。记住：表达需求不是制造冲突，而是建立连接 ❤️", time: 20 },
  { senderId: userIds[0], content: "谢谢老师！我去看看这门课程 📚", time: 18 },
  { senderId: founderId, content: "加油！有任何问题随时聊～", time: 17 },
  { senderId: userIds[0], content: "老师，我看完了第一课，感触好深！原来依恋风格真的会影响我们在关系中的行为模式。", time: 3 },
  { senderId: founderId, content: "是的，自我觉察是改变的第一步。你已经迈出了很棒的一步！继续保持 💪", time: 1 },
];

for (const m of conv1Messages) {
  messages.push({
    id: randomUUID(),
    conversationId: conv1Id,
    senderId: m.senderId,
    content: m.content,
    readAt: m.senderId === founderId ? null : new Date(now - (m.time - 0.5) * hour).toISOString(),
    createdAt: new Date(now - m.time * hour).toISOString(),
  });
}

// Conversation 2: 任盈盈 ↔ Founder
const conv2Id = randomUUID();
conversations.push({
  id: conv2Id,
  participants: [founderId, userIds[4]],
  lastMessageAt: new Date(now - 3 * hour).toISOString(),
  createdAt: new Date(now - 36 * hour).toISOString(),
});

const conv2Messages = [
  { senderId: userIds[4], content: "创始人您好！我是一名心理咨询师，非常认同您的平台理念。我想问一下，有没有合作的可能性？", time: 36 },
  { senderId: founderId, content: "盈盈你好！非常感谢你的认可。我们正在寻找专业的心理咨询师来丰富我们的课程内容。你有什么想法？", time: 34 },
  { senderId: userIds[4], content: "我有10年亲密关系咨询经验，可以提供一些实战案例分享和专业指导。比如依恋理论在实际关系中的应用、原生家庭对亲密关系的影响等。", time: 30 },
  { senderId: founderId, content: "这太棒了！这些内容正是我们用户需要的。我们可以先从一个系列课程开始合作，你觉得怎么样？", time: 28 },
  { senderId: userIds[4], content: "好的！我先整理一个课程大纲发给您，预计下周可以完成。", time: 24 },
  { senderId: founderId, content: "期待！有什么需要的资源和支持随时说 🤝", time: 22 },
  { senderId: userIds[4], content: "大纲初稿已经差不多了，这周末发给您过目～", time: 3 },
];

for (const m of conv2Messages) {
  messages.push({
    id: randomUUID(),
    conversationId: conv2Id,
    senderId: m.senderId,
    content: m.content,
    readAt: m.senderId === founderId ? null : new Date(now - (m.time - 0.5) * hour).toISOString(),
    createdAt: new Date(now - m.time * hour).toISOString(),
  });
}

// Conversation 3: 大卫 ↔ Founder
const conv3Id = randomUUID();
conversations.push({
  id: conv3Id,
  participants: [founderId, userIds[1]],
  lastMessageAt: new Date(now - 5 * hour).toISOString(),
  createdAt: new Date(now - 20 * hour).toISOString(),
});

const conv3Messages = [
  { senderId: userIds[1], content: "你好！我是大卫，ENTJ。刚看完「沟通大师课」，想说这门课真的改变了我的沟通方式！", time: 20 },
  { senderId: founderId, content: "大卫你好！很高兴听到课程对你有帮助。ENTJ通常在效率方面很强，但在情感沟通上可能需要多一些练习。", time: 18 },
  { senderId: userIds[1], content: "是的！以前我总是直接给答案，现在学会先问「你需要的是建议还是倾听？」，效果好太多了", time: 16 },
  { senderId: founderId, content: "这就是成长！从「解决问题」到「理解感受」，这个转变对ENTJ来说非常难得 👏", time: 14 },
  { senderId: userIds[1], content: "谢谢！我女朋友也注意到了变化，她说我变温柔了哈哈", time: 8 },
  { senderId: founderId, content: "太好了！这就是我们平台存在的意义——帮助每个人在关系中成为更好的自己 ❤️", time: 5 },
];

for (const m of conv3Messages) {
  messages.push({
    id: randomUUID(),
    conversationId: conv3Id,
    senderId: m.senderId,
    content: m.content,
    readAt: m.senderId === founderId ? null : new Date(now - (m.time - 0.5) * hour).toISOString(),
    createdAt: new Date(now - m.time * hour).toISOString(),
  });
}

writeJson("conversations.json", conversations);
writeJson("messages.json", messages);

console.log("Mock data seed complete!");
console.log(`  Users: ${mockUsers.length} mock users (password: test123)`);
console.log(`  Posts: ${newPosts.length} new posts`);
console.log(`  Comments: ${newComments.length} new comments`);
console.log(`  Conversations: 3 (with founder)`);
console.log(`  Messages: ${conv1Messages.length + conv2Messages.length + conv3Messages.length} total`);
console.log("\nMock accounts:");
for (const m of mockUsers) {
  console.log(`  ${m.username} / test123 — ${m.displayName} (${m.personalityCode})`);
}
