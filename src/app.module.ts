import { Module } from '@nestjs/common';

import { AccountModule } from '@module/account/account.module';
import { AuthModule } from '@module/auth/auth.module';
import { PositionModule } from '@module/position/position.module';
import { TechStackModule } from '@module/tech-stack/tech-stack.module';

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
    PositionModule,
    TechStackModule,
  ],
})
export class AppModule {}
