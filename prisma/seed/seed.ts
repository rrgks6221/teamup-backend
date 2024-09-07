import { PrismaClient } from '@prisma/client';
import { positionSeeding } from 'prisma/seed/position.seed';
import { techStackSeeding } from 'prisma/seed/tech-stack.seed';

const prisma = new PrismaClient();

async function main() {
  await positionSeeding(prisma);
  await techStackSeeding(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
