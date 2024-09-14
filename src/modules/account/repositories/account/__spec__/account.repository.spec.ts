import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountRepository } from '@module/account/repositories/account/account.repository';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(AccountRepository.name, () => {
  let repository: AccountRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: ACCOUNT_REPOSITORY,
          useClass: AccountRepository,
        },
      ],
    }).compile();

    repository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  describe(AccountRepository.prototype.insert.name, () => {
    describe('계정을 생성하면', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(AccountFactory.build());
      });

      it('계정이 생성돼야한다.', async () => {
        await expect(repository.findOneById(account.id)).resolves.toEqual(
          account,
        );
      });
    });
  });

  describe(AccountRepository.prototype.findOneById.name, () => {
    let accountId: string;

    beforeEach(() => {
      accountId = generateEntityId();
    });

    describe('식별자와 일치하는 계정이 존재하는 경우', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(
          AccountFactory.build({ id: accountId }),
        );
      });
      describe('계정을 조회하면', () => {
        it('계정이 반환돼야한다.', async () => {
          await expect(repository.findOneById(accountId)).resolves.toEqual(
            account,
          );
        });
      });
    });

    describe('식별자와 일치하는 계정이 존재하지 않는 경우', () => {
      describe('계정을 조회하면', () => {
        it('undefined가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(accountId),
          ).resolves.toBeUndefined();
        });
      });
    });

    describe('식별자가 numeric 형태가 아닌 경우', () => {
      describe('계정을 조회하면', () => {
        it('undefined가 반환된다.', async () => {
          await expect(
            repository.findOneById('accountId'),
          ).resolves.toBeUndefined();
        });
      });
    });
  });

  describe(AccountRepository.prototype.findOneByUsername.name, () => {
    let username: string;

    beforeEach(() => {
      username = faker.string.nanoid(Account.USERNAME_MAX_LENGTH);
    });

    describe('닉네임과 일치하는 계정이 존재하는 경우', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(AccountFactory.build({ username }));
      });
      describe('계정을 조회하면', () => {
        it('계정이 반환돼야한다.', async () => {
          await expect(repository.findOneByUsername(username)).resolves.toEqual(
            account,
          );
        });
      });
    });

    describe('닉네임과 일치하는 계정이 존재하는 경우', () => {
      describe('계정을 조회하면', () => {
        it('undefined가 반환돼야한다.', async () => {
          await expect(
            repository.findOneByUsername(username),
          ).resolves.toBeUndefined();
        });
      });
    });
  });

  describe(AccountRepository.prototype.update.name, () => {
    describe('계정이 존재하고', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(AccountFactory.build());
      });

      describe('계정을 업데이트하면', () => {
        beforeEach(async () => {
          account = await repository.update(
            AccountFactory.build({
              id: account.id,
              createdAt: account.createdAt,
            }),
          );
        });

        it('계정이 업데이트된다.', async () => {
          await expect(repository.findOneById(account.id)).resolves.toEqual(
            account,
          );
        });
      });
    });
  });

  describe(AccountRepository.prototype.update.name, () => {
    describe('계정이 존재하고', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(AccountFactory.build());
      });

      describe('계정을 삭제하면', () => {
        beforeEach(async () => {
          await repository.delete(account);
        });

        it('계정이 삭제된다.', async () => {
          await expect(
            repository.findOneById(account.id),
          ).resolves.toBeUndefined();
        });
      });
    });
  });
});
