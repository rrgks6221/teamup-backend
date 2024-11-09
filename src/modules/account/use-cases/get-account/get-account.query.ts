import { IQuery } from '@nestjs/cqrs';

import { EntityId } from '@common/base/base.entity';

export interface IGetAccountQueryProps {
  id: EntityId;
}

export class GetAccountQuery implements IQuery {
  readonly id: EntityId;

  constructor(props: IGetAccountQueryProps) {
    this.id = props.id;
  }
}
