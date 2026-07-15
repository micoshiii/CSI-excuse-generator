import { prisma } from "../lib/prisma";

export async function getOrCreateUser(name: string) {
  return prisma.user.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

export function calculateTier(pastRequestCount: number): number {
  return Math.min(pastRequestCount + 1, 5);
}

export async function pickStaticExcuse(userId: string, tier: number) {
  const usedExcuseIds = (
    await prisma.excuseHistory.findMany({
      where: { userId },
      select: { excuseId: true },
    })
  ).map((h) => h.excuseId);

  const candidates = await prisma.excuse.findMany({
    where: {
      tier,
      id: { notIn: usedExcuseIds },
    },
  });

  if (candidates.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

//adding ai functionality now
import { groq } from "../lib/groq";

const tierPrompts: Record<number, string> = {
  1: "Write one short, mundane, completely believable excuse for being late or missing a deadline — something that could genuinely happen in everyday life, like traffic, an alarm, or a minor mix-up. Use simple, everyday words a normal person would say out loud. One grammatically complete sentence, 10-18 words.",

  2: "Write one excuse for being late or missing a deadline that is a bit more unusual than everyday, but still believable. Use simple, everyday words a normal person would say out loud, no technical or fancy vocabulary. One or two grammatically complete sentences, 18-25 words total.",

  3: "Write one quirky, mildly absurd excuse for being late or missing a deadline. It should sound almost believable at first but be a little ridiculous on closer thought. Use simple, everyday words a normal person would say out loud — avoid technical, medical, or scientific-sounding terms. The scenario must stay internally logical even though it's silly. One or two grammatically complete sentences, 22-30 words total.",

  4: "Write one dramatic, very unusual excuse for being late or missing a deadline. It should be over-the-top but the scenario must still make internal sense. Use simple, everyday words a normal person would say out loud — avoid technical, medical, or scientific-sounding terms. Two grammatically complete sentences, 28-38 words total.",

  5: "Write one wildly absurd, completely over-the-top excuse for being late or missing a deadline. Go all out with creativity and ridiculousness, but the scenario must remain internally logical and coherent, not nonsensical. Use simple, everyday words a normal person would say out loud — avoid technical, medical, or scientific-sounding terms, even for silly things. Two or three grammatically complete sentences, 28-40 words total.",
};

export async function generateAIExcuse(tier: number, avoidList: string[]): Promise<string> {
  const avoidText = avoidList.length > 0
    ? ` Do not repeat or closely resemble any of these previous excuses: ${avoidList.join(" | ")}.`
    : "";

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: tierPrompts[tier] + avoidText + " Respond with only the excuse text, no quotes, no preamble.",
      },
    ],
    max_tokens: 100,
    temperature: 1.0,
  });

  const text = completion.choices[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("AI returned empty response");
  }

  return text;
}

//timeout wrapper-
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("AI request timed out")), ms)
    ),
  ]);
}

export async function getExcuseForUser(userId: string, tier: number) {
  const usedExcuses = await prisma.excuseHistory.findMany({
    where: { userId },
    include: { excuse: true },
  });
  const usedTexts = usedExcuses.map((h) => h.excuse.text);

  try {
    const aiText = await withTimeout(generateAIExcuse(tier, usedTexts), 5000);

    if (usedTexts.includes(aiText)) {
      throw new Error("AI returned a duplicate excuse");
    }

    const savedExcuse = await prisma.excuse.create({
      data: { text: aiText, tier, source: "AI" },
    });

    return savedExcuse;
  } catch (err) {
    console.error("AI generation failed, falling back to static pool:", (err as Error).message);
    return pickStaticExcuse(userId, tier);
  }
}