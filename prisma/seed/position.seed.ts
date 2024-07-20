import { generateEntityId } from './functions';
import { PrismaClient } from '@prisma/client';

const POSITIONS = [
  // 개발자 직군
  'FrontendDeveloper',
  'BackendDeveloper',
  'FullStackDeveloper',
  'IOSDeveloper',
  'AOSDeveloper',
  'GameDeveloper',
  'AIEngineer',

  // 디자인 직군
  'UXUIDesigner',
  'GraphicDesigner',
  'MotionDesigner',
  'ThreeDDesigner',

  // 기획자 직군
  'ProductManager',
  'ServicePlanner',
  'GamePlanner',
  'BusinessPlanner',
];

export const positionSeeding = async (prisma: PrismaClient) => {
  const now = new Date();

  await Promise.all(
    POSITIONS.map((position) =>
      prisma.position.upsert({
        create: {
          id: BigInt(generateEntityId()),
          name: position,
          createdAt: now,
          updatedAt: now,
        },
        update: {
          name: position,
        },
        where: {
          name: position,
        },
      }),
    ),
  );

  console.log('position seeding complete');
};
