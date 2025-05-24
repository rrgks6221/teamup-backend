import { Factory } from 'rosie';

import { GetProjectApplicationQuery } from '@module/project/use-cases/get-project-application/get-project-application.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetProjectApplicationQueryFactory =
  Factory.define<GetProjectApplicationQuery>(
    GetProjectApplicationQuery.name,
    GetProjectApplicationQuery,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
  });
