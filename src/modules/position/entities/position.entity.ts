import { PositionCreatedEvent } from '@module/position/events/position-created.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface PositionProps {
  name: string;
}

interface CreatePositionProps {
  name: string;
}

export class Position extends AggregateRoot<PositionProps> {
  constructor(props: CreateEntityProps<PositionProps>) {
    super(props);
  }

  static create(createPositionProps: CreatePositionProps): Position {
    const id = generateEntityId();
    const date = new Date();

    const position = new Position({
      id,
      props: {
        name: createPositionProps.name,
      },
      createdAt: date,
      updatedAt: date,
    });

    position.apply(
      new PositionCreatedEvent(position.id, {
        name: position.props.name,
      }),
    );

    return position;
  }

  get name() {
    return this, this.props.name;
  }

  public validate(): void {}
}
