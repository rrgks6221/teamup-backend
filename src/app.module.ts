import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RequestContextModule } from 'nestjs-request-context';

import { AccountModule } from '@module/account/account.module';
import { AuthModule } from '@module/auth/auth.module';
import { CommentModule } from '@module/comment/comment.module';
import { ImageModule } from '@module/image/image.module';
import { PositionModule } from '@module/position/position.module';
import { ProjectModule } from '@module/project/project.module';
import { TechStackModule } from '@module/tech-stack/tech-stack.module';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { LoggerModule } from '@shared/logger/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    EventStoreModule,
    RequestContextModule,
    AppConfigModule,
    PrismaModule,
    LoggerModule,
    AwsS3Module,

    AccountModule,
    AuthModule,
    PositionModule,
    TechStackModule,
    ImageModule,
    ProjectModule,
    CommentModule,
  ],
})
export class AppModule {}
