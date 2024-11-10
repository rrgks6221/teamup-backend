import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface TechStackProps {
  name: string;
}

interface CreateTechStackProps {
  name: string;
}

export class TechStack extends AggregateRoot<TechStackProps> {
  constructor(props: CreateEntityProps<TechStackProps>) {
    super(props);
  }

  static create(createTechStackProps: CreateTechStackProps) {
    const id = generateEntityId();
    const date = new Date();

    return new TechStack({
      id,
      props: {
        name: createTechStackProps.name,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get name() {
    return this.props.name;
  }

  public validate(): void {}
}
