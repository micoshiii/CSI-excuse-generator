import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getOrCreateUser, calculateTier, getExcuseForUser } from "../services/excuse.service";

const router = Router();

router.post("/excuse", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required." });
  }

  const user = await getOrCreateUser(name.trim());

  const pastRequestCount = await prisma.excuseHistory.count({
    where: { userId: user.id },
  });

  const tier = calculateTier(pastRequestCount);

  const excuse = await getExcuseForUser(user.id, tier);

  if (!excuse) {
    return res.status(404).json({ error: "No more excuses available at this tier." });
  }

  await prisma.excuseHistory.create({
    data: { userId: user.id, excuseId: excuse.id },
  });

  res.json({ excuse: excuse.text, tier, source: excuse.source });
});

router.get("/history/:name", async (req, res) => {
  const { name } = req.params;

  const user = await prisma.user.findUnique({ where: { name } });

  if (!user) {
    return res.json({ history: [] });
  }

  const history = await prisma.excuseHistory.findMany({
    where: { userId: user.id },
    include: { excuse: true },
    orderBy: { createdAt: "asc" },
  });

  res.json({
    history: history.map((h) => ({
      text: h.excuse.text,
      tier: h.excuse.tier,
      createdAt: h.createdAt,
    })),
  });
});

export default router;