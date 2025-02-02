import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Position,
  PositionProps,
} from '@module/position/entities/position.entity';

import { generateEntityId } from '@common/base/base.entity';

export const PositionFactory = Factory.define<Position & PositionProps>(
  'Position',
)
  .attrs({
    id: () => generateEntityId(),
    name: () => faker.string.nanoid(10),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Position({ id, createdAt, updatedAt, props }),
  );
