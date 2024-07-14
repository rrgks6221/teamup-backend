import { ConsoleLogger, Module } from '@nestjs/common';

import { AppConfigService } from '@common/app-config/app-config.service';

export const LOGGER = Symbol('LOGGER');

@Module({
  providers: [
    {
      useFactory: (appConfigService: AppConfigService) => {
        const IS_PRODUCTION = appConfigService.isProd();

        return new ConsoleLogger({
          json: IS_PRODUCTION,
          colors: !IS_PRODUCTION,
        });
      },
      inject: [AppConfigService],
      provide: LOGGER,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
