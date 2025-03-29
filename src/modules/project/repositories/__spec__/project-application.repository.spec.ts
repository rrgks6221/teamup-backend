import { Test, TestingModule } from '@nestjs/testing';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationRepository } from '@module/project/repositories/project-application.repository';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectApplicationRepository.name, () => {
  let repository: ProjectApplicationRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_APPLICATION_REPOSITORY,
          useClass: ProjectApplicationRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectApplicationRepositoryPort>(
      PROJECT_APPLICATION_REPOSITORY,
    );
  });

  describe(ProjectApplicationRepository.prototype.findOneById.name, () => {
    let projectApplicationId: string;

    beforeEach(() => {
      projectApplicationId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let projectApplication: ProjectApplication;

      beforeEach(async () => {
        projectApplication = await repository.insert(
          ProjectApplicationFactory.build({ id: projectApplicationId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(projectApplicationId),
          ).resolves.toEqual(projectApplication);
        });
      });
    });
  });

  describe(
    ProjectApplicationRepository.prototype.findByProjectApplicant.name,
    () => {
      let projectId: string;
      let applicantId: string;

      beforeEach(() => {
        projectId = generateEntityId();
        applicantId = generateEntityId();
      });

      describe('지원자와 프로젝트가 일치하는 지원서가 존재하는 경우', () => {
        let applications: ProjectApplication[];

        beforeEach(async () => {
          applications = await Promise.all(
            [
              ProjectApplicationFactory.build({
                projectId,
                applicantId,
              }),
              ProjectApplicationFactory.build({
                projectId,
                applicantId,
              }),
              ProjectApplicationFactory.build({}),
            ].map((el) => repository.insert(el)),
          );
        });

        describe('지원서를 조회하면', () => {
          it('해당 프로젝트의 지원한 지원서 목록만 반환돼야한다.', async () => {
            await expect(
              repository.findByProjectApplicant(projectId, applicantId),
            ).resolves.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: applications[0].id,
                  projectId,
                  applicantId,
                }),
                expect.objectContaining({
                  id: applications[1].id,
                  projectId,
                  applicantId,
                }),
              ]),
            );
          });
        });
      });

      describe('지원자와 프로젝트가 일치하는 지원서가 존재하지 않는 경우', () => {
        describe('지원서를 조회하면', () => {
          it('undefined가 반환돼야한다.', async () => {
            await expect(
              repository.findByProjectApplicant(projectId, applicantId),
            ).resolves.toBeArrayOfSize(0);
          });
        });
      });
    },
  );
});
