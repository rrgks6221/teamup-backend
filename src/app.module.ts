import { Module } from '@nestjs/common';

import { AccountModule } from '@module/account/account.module';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AccountModule],
})
export class AppModule {}
