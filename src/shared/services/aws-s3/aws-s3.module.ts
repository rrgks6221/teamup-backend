import { Module } from '@nestjs/common';

import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

import { AwsS3Adapter } from '@shared/services/aws-s3/aws-s3.adapter';
import {
  AWS_S3_CLIENT,
  AWS_S3_PORT,
} from '@shared/services/aws-s3/aws-s3.port';

@Module({
  providers: [
    {
      provide: AWS_S3_CLIENT,
      useFactory: (appConfigService: AppConfigService) => {
        const s3ClientConfig: S3ClientConfig = {
          region: appConfigService.get<string>(ENV_KEY.AWS_S3_REGION),
          credentials: {
            accessKeyId: appConfigService.get<string>(
              ENV_KEY.AWS_S3_ACCESS_KEY,
            ),
            secretAccessKey: appConfigService.get<string>(
              ENV_KEY.AWS_S3_SECRET_KEY,
            ),
          },
        };

        return new S3Client(s3ClientConfig);
      },
      inject: [AppConfigService],
    },
    {
      provide: AWS_S3_PORT,
      useClass: AwsS3Adapter,
    },
  ],
  exports: [AWS_S3_PORT],
})
export class AwsS3Module {}
