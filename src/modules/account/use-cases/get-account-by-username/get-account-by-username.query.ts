import { IQuery } from '@nestjs/cqrs';

export interface IGetAccountByUsernameQueryProps {
  username: string;
}

export class GetAccountByUsernameQuery implements IQuery {
  readonly username: string;

  constructor(props: IGetAccountByUsernameQueryProps) {
    this.username = props.username;
  }
}
