import { EntityId } from '@common/base/base.entity';

export interface AuthTokenProps {
  accountId: EntityId;
  accessToken: string;
  refreshToken: string;
}

export class AuthToken {
  constructor(readonly props: AuthTokenProps) {}

  get accountId() {
    return this.props.accountId;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }
}
