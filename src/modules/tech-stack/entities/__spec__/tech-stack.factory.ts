import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  TechStack,
  TechStackProps,
} from '@module/tech-stack/entities/tech-stack.entity';

import { generateEntityId } from '@common/base/base.entity';

export const TechStackFactory = Factory.define<TechStack & TechStackProps>(
  'TechStack',
)
  .attrs({
    id: () => generateEntityId(),
    name: () => faker.string.nanoid(10),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new TechStack({ id, createdAt, updatedAt, props }),
  );
