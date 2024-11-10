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

  static create(createPositionProps: CreatePositionProps) {
    const id = generateEntityId();
    const date = new Date();

    return new Position({
      id,
      props: {
        name: createPositionProps.name,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get name() {
    return this, this.props.name;
  }

  public validate(): void {}
}
