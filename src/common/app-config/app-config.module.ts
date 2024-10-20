import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

@Global()
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

        [ENV_KEY.JWT_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.JWT_ISSUER]: Joi.string().required(),
        [ENV_KEY.JWT_AUDIENCES]: Joi.string().required(),
        [ENV_KEY.JWT_ACCESS_TOKEN_EXPIRES_IN]: Joi.string().required(),
        [ENV_KEY.JWT_REFRESH_TOKEN_EXPIRES_IN]: Joi.string().required(),

        [ENV_KEY.AWS_S3_BUCKET_NAME]: Joi.string().required(),
        [ENV_KEY.AWS_S3_REGION]: Joi.string().required(),
        [ENV_KEY.AWS_S3_URL]: Joi.string().required(),
        [ENV_KEY.AWS_S3_ACCESS_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_S3_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_S3_PRE_SIGNED_URL_EXPIRES_IN_SECOND]:
          Joi.number().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
