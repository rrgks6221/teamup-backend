import { PrismaClient } from '@prisma/client';
import { positionSeeding } from 'prisma/seeding-functions/position.seed';

const prisma = new PrismaClient();

async function seed() {
  await positionSeeding(prisma);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
