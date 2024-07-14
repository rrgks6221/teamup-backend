import { Module } from '@nestjs/common';

import { AccountModule } from '@module/account/account.module';
import { AuthModule } from '@module/auth/auth.module';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { LoggerModule } from '@shared/logger/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    LoggerModule,

    AccountModule,
    AuthModule,
  ],
})
export class AppModule {}
