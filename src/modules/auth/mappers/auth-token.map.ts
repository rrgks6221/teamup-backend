import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { AuthTokenRaw } from '@module/auth/repositories/auth-token/auth-token.repository.port';

export class AuthTokenMap {
  static toDomain(raw: AuthTokenRaw): AuthToken {
    return new AuthToken({
      accountId: raw.accountId,
      accessToken: raw.accessToken,
      refreshToken: raw.refreshToken,
    });
  }

  static toPersistence(domain: AuthToken): AuthTokenRaw {
    return {
      accountId: domain.accountId,
      accessToken: domain.accessToken,
      refreshToken: domain.refreshToken,
    };
  }
}
