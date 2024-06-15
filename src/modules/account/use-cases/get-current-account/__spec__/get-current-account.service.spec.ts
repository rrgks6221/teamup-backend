import { Test, TestingModule } from '@nestjs/testing';

import { GetCurrentAccountQueryFactory } from '@module/account/use-cases/get-current-account/__spec__/get-current-account-query.factory';
import { GetCurrentAccountModule } from '@module/account/use-cases/get-current-account/get-current-account.module';
import { GetCurrentAccountService } from '@module/account/use-cases/get-current-account/get-current-account.service';
import { GetCurrentAccountQuery } from '@module/account/use-cases/get-current-account/get-current-account.service.interface';

describe('GetCurrentAccountService', () => {
  let service: GetCurrentAccountService;

  let query: GetCurrentAccountQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetCurrentAccountModule],
    }).compile();

    service = module.get<GetCurrentAccountService>(GetCurrentAccountService);
  });

  beforeEach(() => {
    query = GetCurrentAccountQueryFactory.build();
  });
});
