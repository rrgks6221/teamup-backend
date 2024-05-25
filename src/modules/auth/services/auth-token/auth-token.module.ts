import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthTokenRepositoryModule } from '@module/auth/repositories/auth-token/auth-token.repository.module';
import { AuthTokenService } from '@module/auth/services/auth-token/auth-token.service';
import { AUTH_TOKEN_SERVICE } from '@module/auth/services/auth-token/auth-token.service.interface';

import { AppConfigModule } from '@common/app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    AuthTokenRepositoryModule,
    /**
     * @todo jwt 설정
     */
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  providers: [
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: AuthTokenService,
    },
  ],
  exports: [AUTH_TOKEN_SERVICE],
})
export class AuthTokenModule {}
