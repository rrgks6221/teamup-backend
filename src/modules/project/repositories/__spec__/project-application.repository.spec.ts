import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { ProjectApplicationStatus } from '@prisma/client';

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

  describe(
    ProjectApplicationRepository.prototype.findAllCursorPaginated.name,
    () => {
      let projectId: string;
      let projectApplications: ProjectApplication[];

      beforeAll(async () => {
        projectId = generateEntityId();

        projectApplications = await Promise.all(
          [
            ProjectApplicationFactory.build(),
            ProjectApplicationFactory.build({ projectId }),
            ProjectApplicationFactory.build({ projectId }),
          ].map((project) => repository.insert(project)),
        );
      });

      describe('프로젝트 식별자로 필터링 하는 경우', () => {
        it('프로젝트 식별자와 일치하는 프로젝트 지원서만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            filter: {
              projectId,
            },
          });

          expect(result.data.length).toBeGreaterThanOrEqual(2);
          expect(result.data).toSatisfyAll<ProjectApplication>(
            (projectApplication) => projectApplication.projectId === projectId,
          );
        });
      });

      describe('프로젝트 상태로 필터링 하는 경우', () => {
        let status: any;

        beforeEach(async () => {
          status = faker.helpers.enumValue(ProjectApplicationStatus);

          projectApplications = await Promise.all(
            [
              ProjectApplicationFactory.build({ status }),
              ProjectApplicationFactory.build({ status }),
              ProjectApplicationFactory.build({ status }),
            ].map((project) => repository.insert(project)),
          );
        });

        it('프로젝트 지원서 상태와 일치하는 프로젝트 지원서만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            filter: {
              status,
            },
          });

          expect(result.data.length).not.toBeEmpty();
          expect(result.data).toSatisfyAll<ProjectApplication>(
            (projectApplication) => projectApplication.status === status,
          );
        });
      });

      describe('정렬 옵션이 존재하지 않는 경우', () => {
        it('기본 정렬인 id로 정렬된 프로젝트 지원서 목록이 반환돼야한다.', async () => {
          const result = await repository.findAllCursorPaginated({});

          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toEqual(
            [...result.data].sort((a, b) => {
              if (a.id > b.id) {
                return 1;
              }
              if (a.id < b.id) {
                return -1;
              }
              return 0;
            }),
          );
        });
      });

      describe('커서가 존재하는 경우', () => {
        it('커서 이후의 프로젝트 구성원 지원서만 반환해야한다.', async () => {
          const cursor = projectApplications[0].id;
          const result = await repository.findAllCursorPaginated({
            cursor,
          });

          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toSatisfyAll<ProjectApplication>(
            (el) => el.id > cursor,
          );
        });
      });

      describe('다음 커서가 존재하지 않는 경우', () => {
        it('프로젝트 구성원 목록만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            limit: 10000,
          });

          expect(result.cursor).toBeUndefined();
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toBeArray();
        });
      });

      describe('다음 커서가 존재하는 경우', () => {
        it('커서를 포함한 프로젝트 구성원 목록을 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            limit: 1,
          });

          expect(result.cursor).toBeDefined();
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toBeArrayOfSize(1);
        });
      });
    },
  );
});
