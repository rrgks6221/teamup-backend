import { Test, TestingModule } from '@nestjs/testing';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import {
  CREATE_ACCOUNT_SERVICE,
  ICreateAccountService,
} from '@module/account/use-cases/create-account/create-account.service.interface';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignUpWithUsernameCommandFactory } from '@module/auth/use-cases/sign-up-with-username/__spec__/sign-up-with-username.command.factory';
import { SignUpWithUsernameService } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service';
import {
  ISignUpWithUsernameService,
  SIGN_UP_WITH_USERNAME_SERVICE,
  SignUpWithUsernameCommand,
} from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service.interface';

describe(SignUpWithUsernameService.name, () => {
  let service: ISignUpWithUsernameService;

  let createAccountService: ICreateAccountService;

  let command: SignUpWithUsernameCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthTokenModule, CreateAccountModule],
      providers: [
        {
          provide: SIGN_UP_WITH_USERNAME_SERVICE,
          useClass: SignUpWithUsernameService,
        },
      ],
    }).compile();

    service = module.get<ISignUpWithUsernameService>(
      SIGN_UP_WITH_USERNAME_SERVICE,
    );
    createAccountService = module.get<ICreateAccountService>(
      CREATE_ACCOUNT_SERVICE,
    );
  });

  beforeEach(() => {
    jest.spyOn(createAccountService, 'execute');
  });

  beforeEach(() => {
    command = SignUpWithUsernameCommandFactory.build();
  });

  describe('회원가입을 하면', () => {
    it('계정을 생성하고 토큰을 반환한다.', async () => {
      await expect(service.execute(command)).resolves.toBeInstanceOf(AuthToken);
      expect(createAccountService.execute).toHaveBeenCalled();
    });
  });
});
