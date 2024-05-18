import { Module } from '@nestjs/common';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule],
})
export class AppModule {}
