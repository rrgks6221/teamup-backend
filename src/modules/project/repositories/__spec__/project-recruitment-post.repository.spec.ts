import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostRepository } from '@module/project/repositories/project-recruitment-post.repository';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectRecruitmentPostRepository.name, () => {
  let repository: ProjectRecruitmentPostRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_RECRUITMENT_POST_REPOSITORY,
          useClass: ProjectRecruitmentPostRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectRecruitmentPostRepositoryPort>(
      PROJECT_RECRUITMENT_POST_REPOSITORY,
    );
  });

  describe(ProjectRecruitmentPostRepository.prototype.findOneById.name, () => {
    let projectRecruitmentPostId: string;

    beforeEach(() => {
      projectRecruitmentPostId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let projectRecruitmentPost: ProjectRecruitmentPost;

      beforeEach(async () => {
        projectRecruitmentPost = await repository.insert(
          ProjectRecruitmentPostFactory.build({ id: projectRecruitmentPostId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(projectRecruitmentPostId),
          ).resolves.toEqual(projectRecruitmentPost);
        });
      });
    });
  });
});
