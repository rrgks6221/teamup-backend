import { Factory } from 'rosie';

import { GetProjectMemberQuery } from '@module/project/use-cases/get-project-member/get-project-member.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetProjectMemberQueryFactory =
  Factory.define<GetProjectMemberQuery>(
    GetProjectMemberQuery.name,
    GetProjectMemberQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    memberId: () => generateEntityId(),
  });
