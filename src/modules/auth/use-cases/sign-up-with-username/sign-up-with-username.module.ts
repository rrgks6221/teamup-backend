import { Module } from '@nestjs/common';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignUpWithUsernameController } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.controller';
import { SignUpWithUsernameService } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service';
import { SIGN_UP_WITH_USERNAME_SERVICE } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service.interface';

@Module({
  imports: [CreateAccountModule, AuthTokenModule],
  controllers: [SignUpWithUsernameController],
  providers: [
    {
      provide: SIGN_UP_WITH_USERNAME_SERVICE,
      useClass: SignUpWithUsernameService,
    },
  ],
})
export class SignUpWithUsernameModule {}
