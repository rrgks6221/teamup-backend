import { Factory } from 'rosie';

import { GetProjectQuery } from '@module/project/use-cases/get-project/get-project.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetProjectQueryFactory = Factory.define<GetProjectQuery>(
  GetProjectQuery.name,
  GetProjectQuery,
).attrs({
  projectId: () => generateEntityId(),
});
