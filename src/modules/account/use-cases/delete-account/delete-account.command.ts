import { ICommand } from '@nestjs/cqrs';

import { EntityId } from '@common/base/base.entity';

export interface IDeleteAccountCommandProps {
  id: EntityId;
}

export class DeleteAccountCommand implements ICommand {
  readonly id: EntityId;

  constructor(props: IDeleteAccountCommandProps) {
    this.id = props.id;
  }
}
