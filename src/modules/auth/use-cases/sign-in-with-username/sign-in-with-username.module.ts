import { Module } from '@nestjs/common';

import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignInWithUsernameController } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.controller';
import { SignInWithUsernameHandler } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.handler';

@Module({
  imports: [AuthTokenModule],
  controllers: [SignInWithUsernameController],
  providers: [SignInWithUsernameHandler],
})
export class SignInWithUsernameModule {}
