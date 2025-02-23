import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { IncrementRecruitmentPostViewCountCommandFactory } from '@module/project/use-cases/increment-recruitment-post-view-count/__spec__/increment-recruitment-post-view-count-command.factory';
import { IncrementRecruitmentPostViewCountCommand } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.command';
import { IncrementRecruitmentPostViewCountHandler } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.handler';

describe(IncrementRecruitmentPostViewCountHandler.name, () => {
  let handler: IncrementRecruitmentPostViewCountHandler;

  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;

  let command: IncrementRecruitmentPostViewCountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRecruitmentPostRepositoryModule],
      providers: [IncrementRecruitmentPostViewCountHandler],
    }).compile();

    handler = module.get<IncrementRecruitmentPostViewCountHandler>(
      IncrementRecruitmentPostViewCountHandler,
    );

    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
  });

  beforeEach(() => {
    command = IncrementRecruitmentPostViewCountCommandFactory.build();

    jest.spyOn(projectRecruitmentPostRepository, 'incrementViewCount');
  });

  describe('식별자와 일치하는 모집 게시글이 존재하는 경우', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let post: ProjectRecruitmentPost;

    beforeEach(async () => {
      post = await projectRecruitmentPostRepository.insert(
        ProjectRecruitmentPostFactory.build({ id: command.postId }),
      );
    });

    describe('조회수를 증가시키면', () => {
      it('조회수가 증가돼야한다.', async () => {
        await expect(handler.execute(command)).resolves.toBeUndefined();
        expect(
          projectRecruitmentPostRepository.incrementViewCount,
        ).toHaveBeenCalled();
      });
    });
  });

  describe('식별자와 일치하는 모집 게시글이 존재하지 않는 경우', () => {
    describe('조회수를 증가시키면', () => {
      it('모집 게시글이 존재하지 않는다는 에러가 발생해야한다', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectRecruitmentPostNotFoundError,
        );
      });
    });
  });
});
