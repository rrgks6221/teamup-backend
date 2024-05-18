import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        if (process.env.NODE_ENV === 'test') {
          return '.env.test';
        }
        return '.env';
      })(),
      validationSchema: Joi.object({
        [ENV_KEY.PORT]: Joi.number(),
        [ENV_KEY.NODE_ENV]: Joi.string().required(),
        [ENV_KEY.APP_STAGE]: Joi.string().required(),

        [ENV_KEY.DATABASE_URL]: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
