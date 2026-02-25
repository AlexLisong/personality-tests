export interface PersonalityType {
  code: string;
  name: string;
  nameZh: string;
  emoji: string;
  group: "analyst" | "diplomat" | "sentinel" | "explorer";
  tagline: string;
  taglineZh: string;
  description: string;
  descriptionZh: string;
}

const groupColors = {
  analyst: { bg: "from-purple to-purple-mid", color: "#88619A" },
  diplomat: { bg: "from-green to-green-mid", color: "#33A474" },
  sentinel: { bg: "from-blue to-blue-mid", color: "#4298B4" },
  explorer: { bg: "from-yellow to-yellow-mid", color: "#E4AE3A" },
};

export { groupColors };

const personalities: Record<string, PersonalityType> = {
  "INTJ-A": { code: "INTJ-A", name: "Architect", nameZh: "建筑师", emoji: "🏛️", group: "analyst", tagline: "The Strategic Mind", taglineZh: "战略思维者", description: "Strategic and independent thinker with a plan for everything.", descriptionZh: "战略性的独立思考者，凡事都有计划。" },
  "INTJ-T": { code: "INTJ-T", name: "Architect", nameZh: "建筑师", emoji: "🏛️", group: "analyst", tagline: "The Perfectionist Planner", taglineZh: "完美主义规划者", description: "Strategic thinker who strives for perfection in every plan.", descriptionZh: "追求完美计划的战略思考者。" },
  "INTP-A": { code: "INTP-A", name: "Logician", nameZh: "逻辑学家", emoji: "🔬", group: "analyst", tagline: "The Curious Inventor", taglineZh: "好奇发明家", description: "Innovative inventor with an unquenchable thirst for knowledge.", descriptionZh: "对知识有着无尽渴望的创新发明家。" },
  "INTP-T": { code: "INTP-T", name: "Logician", nameZh: "逻辑学家", emoji: "🔬", group: "analyst", tagline: "The Deep Thinker", taglineZh: "深度思考者", description: "Curious thinker always questioning and refining ideas.", descriptionZh: "不断质疑和完善想法的好奇思考者。" },
  "ENTJ-A": { code: "ENTJ-A", name: "Commander", nameZh: "指挥官", emoji: "👑", group: "analyst", tagline: "The Bold Leader", taglineZh: "果敢领袖", description: "Bold leader who always finds a way — or makes one.", descriptionZh: "总能找到出路的果敢领导者。" },
  "ENTJ-T": { code: "ENTJ-T", name: "Commander", nameZh: "指挥官", emoji: "👑", group: "analyst", tagline: "The Driven Commander", taglineZh: "进取指挥官", description: "Driven leader who pushes themselves and others to excel.", descriptionZh: "推动自己和他人追求卓越的领导者。" },
  "ENTP-A": { code: "ENTP-A", name: "Debater", nameZh: "辩论家", emoji: "⚡", group: "analyst", tagline: "The Visionary Debater", taglineZh: "远见辩手", description: "Smart and curious thinker who loves an intellectual challenge.", descriptionZh: "热爱智力挑战的聪明好奇思考者。" },
  "ENTP-T": { code: "ENTP-T", name: "Debater", nameZh: "辩论家", emoji: "⚡", group: "analyst", tagline: "The Restless Innovator", taglineZh: "不安创新者", description: "Quick-witted challenger always seeking the next big idea.", descriptionZh: "不断寻找下一个大创意的机智挑战者。" },
  "INFJ-A": { code: "INFJ-A", name: "Advocate", nameZh: "提倡者", emoji: "🌟", group: "diplomat", tagline: "The Quiet Visionary", taglineZh: "安静的远见者", description: "Quiet visionary with a strong sense of idealism and purpose.", descriptionZh: "拥有强烈理想主义和使命感的安静远见者。" },
  "INFJ-T": { code: "INFJ-T", name: "Advocate", nameZh: "提倡者", emoji: "🌟", group: "diplomat", tagline: "The Thoughtful Idealist", taglineZh: "深思的理想主义者", description: "Thoughtful idealist driven to make a meaningful difference.", descriptionZh: "致力于做出有意义改变的深思熟虑的理想主义者。" },
  "INFP-A": { code: "INFP-A", name: "Mediator", nameZh: "调停者", emoji: "🦋", group: "diplomat", tagline: "The Gentle Dreamer", taglineZh: "温柔梦想家", description: "Poetic and kind soul, always looking for the good in people.", descriptionZh: "诗意而善良的灵魂，总能发现人们的美好。" },
  "INFP-T": { code: "INFP-T", name: "Mediator", nameZh: "调停者", emoji: "🦋", group: "diplomat", tagline: "The Sensitive Seeker", taglineZh: "敏感探索者", description: "Deeply feeling dreamer seeking harmony and authenticity.", descriptionZh: "追求和谐与真实的深情梦想家。" },
  "ENFJ-A": { code: "ENFJ-A", name: "Protagonist", nameZh: "主人公", emoji: "🎭", group: "diplomat", tagline: "The Charismatic Leader", taglineZh: "魅力领袖", description: "Charismatic leader who inspires and uplifts those around them.", descriptionZh: "激励和鼓舞身边人的魅力领袖。" },
  "ENFJ-T": { code: "ENFJ-T", name: "Protagonist", nameZh: "主人公", emoji: "🎭", group: "diplomat", tagline: "The Passionate Mentor", taglineZh: "热情导师", description: "Passionate mentor always striving to help others grow.", descriptionZh: "始终帮助他人成长的热情导师。" },
  "ENFP-A": { code: "ENFP-A", name: "Campaigner", nameZh: "竞选者", emoji: "🎪", group: "diplomat", tagline: "The Enthusiastic Spirit", taglineZh: "热情灵魂", description: "Enthusiastic free spirit who always finds a reason to smile.", descriptionZh: "总能找到微笑理由的热情自由灵魂。" },
  "ENFP-T": { code: "ENFP-T", name: "Campaigner", nameZh: "竞选者", emoji: "🎪", group: "diplomat", tagline: "The Creative Explorer", taglineZh: "创意探索者", description: "Creative optimist eager to explore every possibility.", descriptionZh: "渴望探索每种可能性的创意乐观主义者。" },
  "ISTJ-A": { code: "ISTJ-A", name: "Logistician", nameZh: "物流师", emoji: "📋", group: "sentinel", tagline: "The Reliable Planner", taglineZh: "可靠规划者", description: "Practical and fact-minded, reliability is their middle name.", descriptionZh: "务实且注重事实，可靠是他们的代名词。" },
  "ISTJ-T": { code: "ISTJ-T", name: "Logistician", nameZh: "物流师", emoji: "📋", group: "sentinel", tagline: "The Diligent Organizer", taglineZh: "勤勉组织者", description: "Dependable organizer who takes responsibilities seriously.", descriptionZh: "认真负责的可靠组织者。" },
  "ISFJ-A": { code: "ISFJ-A", name: "Defender", nameZh: "守卫者", emoji: "🛡️", group: "sentinel", tagline: "The Warm Protector", taglineZh: "温暖守护者", description: "Warm protector, always ready to defend their loved ones.", descriptionZh: "温暖的守护者，时刻准备保护所爱之人。" },
  "ISFJ-T": { code: "ISFJ-T", name: "Defender", nameZh: "守卫者", emoji: "🛡️", group: "sentinel", tagline: "The Caring Guardian", taglineZh: "贴心守护者", description: "Caring guardian who worries about the well-being of others.", descriptionZh: "关心他人福祉的贴心守护者。" },
  "ESTJ-A": { code: "ESTJ-A", name: "Executive", nameZh: "总经理", emoji: "💼", group: "sentinel", tagline: "The Efficient Manager", taglineZh: "高效管理者", description: "Excellent organizer, great at managing things and people.", descriptionZh: "出色的组织者，善于管理事务和人员。" },
  "ESTJ-T": { code: "ESTJ-T", name: "Executive", nameZh: "总经理", emoji: "💼", group: "sentinel", tagline: "The High-Standard Leader", taglineZh: "高标准领导者", description: "Determined administrator who holds themselves to high standards.", descriptionZh: "对自己高标准严要求的坚定管理者。" },
  "ESFJ-A": { code: "ESFJ-A", name: "Consul", nameZh: "执政官", emoji: "🤝", group: "sentinel", tagline: "The Social Connector", taglineZh: "社交达人", description: "Caring and social, always eager to lend a helping hand.", descriptionZh: "热心社交，总是乐于助人。" },
  "ESFJ-T": { code: "ESFJ-T", name: "Consul", nameZh: "执政官", emoji: "🤝", group: "sentinel", tagline: "The Devoted Helper", taglineZh: "热心助手", description: "Devoted helper sensitive to the needs and feelings of others.", descriptionZh: "对他人的需求和感受敏感的热心助手。" },
  "ISTP-A": { code: "ISTP-A", name: "Virtuoso", nameZh: "鉴赏家", emoji: "🔧", group: "explorer", tagline: "The Bold Experimenter", taglineZh: "大胆实验者", description: "Bold experimenter, master of all kinds of tools and techniques.", descriptionZh: "大胆的实验者，精通各种工具和技术。" },
  "ISTP-T": { code: "ISTP-T", name: "Virtuoso", nameZh: "鉴赏家", emoji: "🔧", group: "explorer", tagline: "The Hands-on Solver", taglineZh: "动手解决者", description: "Hands-on problem solver who thrives under pressure.", descriptionZh: "在压力下游刃有余的动手型问题解决者。" },
  "ISFP-A": { code: "ISFP-A", name: "Adventurer", nameZh: "探险家", emoji: "🎨", group: "explorer", tagline: "The Charming Artist", taglineZh: "迷人艺术家", description: "Flexible and charming artist, always ready to explore something new.", descriptionZh: "灵活迷人的艺术家，随时准备探索新事物。" },
  "ISFP-T": { code: "ISFP-T", name: "Adventurer", nameZh: "探险家", emoji: "🎨", group: "explorer", tagline: "The Sensitive Creator", taglineZh: "敏感创作者", description: "Sensitive creator who expresses themselves through experiences.", descriptionZh: "通过体验来表达自我的敏感创作者。" },
  "ESTP-A": { code: "ESTP-A", name: "Entrepreneur", nameZh: "企业家", emoji: "🚀", group: "explorer", tagline: "The Energetic Doer", taglineZh: "精力充沛的行动者", description: "Smart, energetic, perceptive — lives on the edge.", descriptionZh: "聪明、精力充沛、敏锐，活在刀锋之上。" },
  "ESTP-T": { code: "ESTP-T", name: "Entrepreneur", nameZh: "企业家", emoji: "🚀", group: "explorer", tagline: "The Action Risk-taker", taglineZh: "行动冒险者", description: "Action-oriented risk-taker who learns by doing.", descriptionZh: "在实践中学习的行动派冒险者。" },
  "ESFP-A": { code: "ESFP-A", name: "Entertainer", nameZh: "表演者", emoji: "🎤", group: "explorer", tagline: "The Life of the Party", taglineZh: "派对灵魂", description: "Spontaneous and energetic, life is never boring around them.", descriptionZh: "自发而充满活力，有他们在生活永不无聊。" },
  "ESFP-T": { code: "ESFP-T", name: "Entertainer", nameZh: "表演者", emoji: "🎤", group: "explorer", tagline: "The Vibrant Performer", taglineZh: "活力表演者", description: "Vibrant performer who brings joy and energy everywhere.", descriptionZh: "到哪里都带来欢乐和活力的活跃表演者。" },
};

export default personalities;
