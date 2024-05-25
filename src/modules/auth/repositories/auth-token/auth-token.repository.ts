import { Injectable } from '@nestjs/common';

import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { AuthTokenMap } from '@module/auth/mappers/auth-token.map';
import {
  AuthTokenRaw,
  AuthTokenRepositoryPort,
} from '@module/auth/repositories/auth-token/auth-token.repository.port';

import { EntityId } from '@common/base/base.entity';

/**
 * @todo 저장소를 redis 같은 저장소로 변경
 */
@Injectable()
export class AuthTokenRepository implements AuthTokenRepositoryPort {
  private data: Record<EntityId, AuthTokenRaw> = {};

  async getAuthToken(accountId: EntityId): Promise<AuthToken | undefined> {
    const authToken = this.data[accountId];

    if (authToken === undefined) {
      return;
    }

    return AuthTokenMap.toDomain(authToken);
  }

  async setAuthToken(authToken: AuthToken): Promise<AuthToken> {
    this.data[authToken.accountId] = {
      accountId: authToken.accountId,
      accessToken: authToken.accessToken,
      refreshToken: authToken.refreshToken,
    };

    return AuthTokenMap.toDomain(authToken);
  }
  async delAuthToken(authToken: AuthToken): Promise<void> {
    delete this.data[authToken.accountId];
  }
}
