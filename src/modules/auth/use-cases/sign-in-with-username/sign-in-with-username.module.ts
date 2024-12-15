import { Module } from '@nestjs/common';

import { AccountModule } from '@module/account/account.module';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignInWithUsernameController } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.controller';
import { SignInWithUsernameService } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service';
import { SIGN_IN_WITH_USERNAME_SERVICE } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service.interface';

@Module({
  imports: [AuthTokenModule, AccountModule],
  controllers: [SignInWithUsernameController],
  providers: [
    {
      provide: SIGN_IN_WITH_USERNAME_SERVICE,
      useClass: SignInWithUsernameService,
    },
  ],
})
export class SignInWithUsernameModule {}
