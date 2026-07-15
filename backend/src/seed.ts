import { prisma } from "./lib/prisma";

const excuses = [
  { text: "Traffic was really bad this morning.", tier: 1 },
  { text: "My alarm didn't go off.", tier: 1 },
  { text: "I had a doctor's appointment that ran late.", tier: 1 },
  { text: "My internet went down right before the deadline.", tier: 2 },
  { text: "I accidentally submitted the wrong file and had to redo it.", tier: 2 },
  { text: "My laptop crashed and I lost unsaved work.", tier: 2 },
  { text: "There was a power outage in my building for two hours.", tier: 3 },
  { text: "My cat walked across my keyboard and deleted half my code.", tier: 3 },
  { text: "I got locked out of my own apartment.", tier: 3 },
  { text: "A water pipe burst in my kitchen and flooded my workspace.", tier: 4 },
  { text: "My neighbor's fire alarm went off for three straight hours.", tier: 4 },
  { text: "I was stuck in an elevator for forty minutes.", tier: 4 },
  { text: "A flock of pigeons hijacked my auto-rickshaw.", tier: 5 },
  { text: "My smart fridge gained sentience and locked me out of the kitchen.", tier: 5 },
  { text: "A squirrel stole my laptop charger and I had to negotiate its return.", tier: 5 },
];

async function main() {
  for (const excuse of excuses) {
    await prisma.excuse.create({
      data: {
        text: excuse.text,
        tier: excuse.tier,
        source: "STATIC",
      },
    });
  }
  console.log(`Seeded ${excuses.length} excuses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });