import { Module } from '@nestjs/common';

import { AuthTokenRepository } from '@module/auth/repositories/auth-token/auth-token.repository';
import { AUTH_TOKEN_REPOSITORY_PORT } from '@module/auth/repositories/auth-token/auth-token.repository.port';

@Module({
  providers: [
    {
      provide: AUTH_TOKEN_REPOSITORY_PORT,
      useClass: AuthTokenRepository,
    },
  ],
  exports: [AUTH_TOKEN_REPOSITORY_PORT],
})
export class AuthTokenRepositoryModule {}
