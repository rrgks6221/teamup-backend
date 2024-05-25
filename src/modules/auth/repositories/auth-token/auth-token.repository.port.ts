import { AuthToken } from '@module/auth/entities/auth-token.vo';

import { EntityId } from '@common/base/base.entity';

export const AUTH_TOKEN_REPOSITORY_PORT = Symbol('AuthTokenRepositoryPort');

export interface AuthTokenRaw {
  accountId: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenRepositoryPort {
  getAuthToken(accountId: EntityId): Promise<AuthToken | undefined>;

  setAuthToken(authToken: AuthToken): Promise<AuthToken>;

  delAuthToken(authToken: AuthToken): Promise<void>;
}
