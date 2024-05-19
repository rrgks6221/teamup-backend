import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const DELETE_ACCOUNT_SERVICE = Symbol('IDeleteAccountService');

export interface IDeleteAccountCommandProps {
  id: EntityId;
}

export class DeleteAccountCommand {
  readonly id: EntityId;

  constructor(props: IDeleteAccountCommandProps) {
    this.id = props.id;
  }
}

export interface IDeleteAccountService
  extends IBaseService<DeleteAccountCommand, void> {}
