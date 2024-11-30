import { Module } from '@nestjs/common';

import { AppConfigModule } from '@src/common/app-config/app-config.module';
import { PrismaModule } from '@src/shared/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule],
})
export class AppModule {}
