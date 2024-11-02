import { TechStack as TechStackModel } from '@prisma/client';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const TECH_STACK_REPOSITORY = Symbol('TECH_STACK_REPOSITORY');

export interface TechStackRaw extends TechStackModel {}

export interface TechStackFilter {}

export interface TechStackRepositoryPort
  extends RepositoryPort<TechStack, TechStackFilter> {
  findOneByName(name: string): Promise<TechStack | undefined>;
  findByIds(ids: Set<string>): Promise<TechStack[]>;
  findAll(): Promise<TechStack[]>;
}
