import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';

export const TECH_STACK_SERVICE = Symbol('ITechStackService');

export interface ITechStackService {
  findByIdsOrFail(ids: string[]): Promise<TechStack[]>;
}
