import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY } from '@common/app-config/app-config.constant';

type EnvKey = keyof typeof ENV_KEY;

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends string | number = string>(key: EnvKey): T {
    return this.configService.get<T>(key) as T;
  }

  isProd(): boolean {
    return this.configService.get<string>(ENV_KEY.NODE_ENV) === 'production';
  }
}
