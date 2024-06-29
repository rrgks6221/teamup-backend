import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { AuthTokenService } from '@module/auth/services/auth-token/auth-token.service';
import { AUTH_TOKEN_SERVICE } from '@module/auth/services/auth-token/auth-token.service.interface';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (appConfigService: AppConfigService) => {
        return {
          secret: appConfigService.get<string>(ENV_KEY.JWT_SECRET_KEY),
          signOptions: {
            issuer: appConfigService.get<string>(ENV_KEY.JWT_ISSUER),
            audience: appConfigService
              .get<string>(ENV_KEY.JWT_AUDIENCES)
              .split(','),
          },
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [
    JwtAuthGuard,
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: AuthTokenService,
    },
  ],
  exports: [AUTH_TOKEN_SERVICE],
})
export class AuthTokenModule {}
