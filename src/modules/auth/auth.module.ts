import { Module } from '@nestjs/common';

import { SignUpWithUsernameModule } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.module';

@Module({
  imports: [SignUpWithUsernameModule],
})
export class AuthModule {}
