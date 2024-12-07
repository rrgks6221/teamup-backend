import { TechStackCreatedEvent } from '@module/tech-stack/events/tech-stack-created.event';

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

  static create(createTechStackProps: CreateTechStackProps): TechStack {
    const id = generateEntityId();
    const date = new Date();

    const techStack = new TechStack({
      id,
      props: {
        name: createTechStackProps.name,
      },
      createdAt: date,
      updatedAt: date,
    });

    techStack.apply(
      new TechStackCreatedEvent(techStack.id, {
        name: techStack.props.name,
      }),
    );

    return techStack;
  }

  get name() {
    return this.props.name;
  }

  public validate(): void {}
}
