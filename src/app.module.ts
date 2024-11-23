import { Module } from '@nestjs/common';

import { AppConfigModule } from '@src/common/app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
})
export class AppModule {}
