import { Factory } from 'rosie';

import { IncrementRecruitmentPostViewCountCommand } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.command';

import { generateEntityId } from '@common/base/base.entity';

export const IncrementRecruitmentPostViewCountCommandFactory =
  Factory.define<IncrementRecruitmentPostViewCountCommand>(
    IncrementRecruitmentPostViewCountCommand.name,
    IncrementRecruitmentPostViewCountCommand,
  ).attrs({
    postId: () => generateEntityId(),
  });
