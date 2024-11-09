import { Module } from '@nestjs/common';

import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignUpWithUsernameController } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.controller';
import { SignUpWithUsernameHandler } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.handler';

@Module({
  imports: [AuthTokenModule],
  controllers: [SignUpWithUsernameController],
  providers: [SignUpWithUsernameHandler],
})
export class SignUpWithUsernameModule {}
