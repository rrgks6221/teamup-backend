import { Test, TestingModule } from '@nestjs/testing';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberRepository } from '@module/project/repositories/project-member.repository';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectMemberRepository.name, () => {
  let repository: ProjectMemberRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_MEMBER_REPOSITORY,
          useClass: ProjectMemberRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
  });

  describe(ProjectMemberRepository.prototype.findOneById.name, () => {
    let projectMemberId: string;

    beforeEach(() => {
      projectMemberId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let projectMember: ProjectMember;

      beforeEach(async () => {
        projectMember = await repository.insert(
          ProjectMemberFactory.build({ id: projectMemberId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(projectMemberId),
          ).resolves.toEqual(projectMember);
        });
      });
    });
  });

  describe(
    ProjectMemberRepository.prototype.findOneByAccountInProject.name,
    () => {
      let projectId: string;
      let accountId: string;

      beforeEach(() => {
        projectId = generateEntityId();
        accountId = generateEntityId();
      });

      describe('계정 식별자에 해당하는 프로젝트 구성원이 존재하는 경우', () => {
        beforeEach(async () => {
          await repository.insert(
            ProjectMemberFactory.build({
              projectId,
              accountId,
            }),
          );
        });

        describe('프로젝트 구성원을 조회하면', () => {
          it('프로젝트 구성원이 반환돼야한다.', async () => {
            await expect(
              repository.findOneByAccountInProject(projectId, accountId),
            ).resolves.toEqual(
              expect.objectContaining({
                projectId,
                accountId,
              }),
            );
          });
        });
      });

      describe('계정 식별자에 해당하는 프로젝트 구성원이 존재하지 않는 경우', () => {
        describe('프로젝트 구성원을 조회하면', () => {
          it('undefined가 반환돼야한다.', async () => {
            await expect(
              repository.findOneByAccountInProject(projectId, accountId),
            ).resolves.toBeUndefined();
          });
        });
      });
    },
  );
});
