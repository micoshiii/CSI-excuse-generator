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
  1: "Write one short, mundane, believable excuse for being late to work or missing a deadline. Keep it realistic and boring, one sentence.",
  2: "Write one slightly inconvenient excuse for being late or missing a deadline. A bit more unusual than normal, one to two sentences.",
  3: "Write one quirky, mildly absurd excuse for being late or missing a deadline. Should sound almost believable but a little ridiculous, two sentences.",
  4: "Write one very unusual, dramatic excuse for being late or missing a deadline. Over the top but still loosely plausible, two to three sentences.",
  5: "Write one completely absurd, wildly over-the-top excuse for being late or missing a deadline. No limits on ridiculousness, two to three sentences.",
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