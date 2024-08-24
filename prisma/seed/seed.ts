import { positionSeeding } from './position.seed';
import { techStackSeeding } from './tech-stack.seed';
import { PrismaClient } from '@prisma/client';

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
