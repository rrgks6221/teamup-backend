import { Module } from '@nestjs/common';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Module({
  providers: [
    {
      provide: PRISMA_SERVICE,
      useClass: PrismaService,
    },
  ],
  exports: [PRISMA_SERVICE],
})
export class PrismaModule {}
