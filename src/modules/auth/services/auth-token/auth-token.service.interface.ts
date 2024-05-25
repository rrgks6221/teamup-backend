import { Account } from '@module/account/entities/account.entity';
import { AuthToken } from '@module/auth/entities/auth-token.vo';

export const AUTH_TOKEN_SERVICE = Symbol('IAuthTokenService');

export interface IAuthTokenService {
  generateAuthToken(account: Account): Promise<AuthToken>;
}
