import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';

describe(Account.name, () => {
  describe(Account.prototype.isSameNicknameAccount.name, () => {
    describe('두 계정의 식별자가 다르고 닉네임이 같은 경우', () => {
      let account: Account;
      let compareAccount: Account;

      beforeEach(() => {
        account = AccountFactory.build();
        compareAccount = AccountFactory.build({ nickname: account.nickname });
      });

      it('동일한 닉네임이다.', () => {
        expect(account.isSameNicknameAccount(compareAccount)).toBe(true);
      });
    });
  });
});
