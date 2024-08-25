import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';

import { IBaseService } from '@common/base/base-service';

export const LIST_TECH_STACKS_SERVICE = Symbol('IListTechStacksService');

export interface IListTechStacksService
  extends IBaseService<void, TechStack[]> {}
