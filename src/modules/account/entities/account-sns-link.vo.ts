export enum AccountSnsLinkVisibilityScope {
  public = 'public',
  private = 'private',
}

export interface AccountSnsLinkProps {
  url: string;
  platform: string;
  visibilityScope: AccountSnsLinkVisibilityScope;
}

export class AccountSnsLink {
  constructor(readonly props: AccountSnsLinkProps) {}

  get url() {
    return this.props.url;
  }

  get platform() {
    return this.props.platform;
  }

  get visibilityScope() {
    return this.props.visibilityScope;
  }
}
