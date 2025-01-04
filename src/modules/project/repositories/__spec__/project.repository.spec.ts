import { Test, TestingModule } from '@nestjs/testing';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  Project,
  ProjectStatus,
} from '@module/project/entities/project.entity';
import { ProjectRepository } from '@module/project/repositories/project.repository';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { RecordNotFoundError } from '@common/base/base.error';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectRepository.name, () => {
  let repository: ProjectRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_REPOSITORY,
          useClass: ProjectRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
  });

  describe(ProjectRepository.prototype.findOneById.name, () => {
    let projectId: string;

    beforeEach(() => {
      projectId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let project: Project;

      beforeEach(async () => {
        project = await repository.insert(
          ProjectFactory.build({ id: projectId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(projectId)).resolves.toEqual(
            project,
          );
        });
      });
    });
  });

  describe(ProjectRepository.prototype.incrementMemberCount.name, () => {
    let projectId: string;

    beforeEach(() => {
      projectId = generateEntityId();
    });

    describe('식별자와 일치하는 프로젝트가 존재하는 경우', () => {
      let project: Project;

      beforeEach(async () => {
        project = await repository.insert(
          ProjectFactory.build({ id: projectId }),
        );
      });

      describe('프로젝트의 현재 사용자 수를 증가시키면', () => {
        it('현재 사용자 수를 1 증가시켜야한다.', async () => {
          await expect(
            repository.incrementMemberCount(projectId),
          ).resolves.toEqual(project.currentMemberCount + 1);
        });
      });
    });

    describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
      describe('프로젝트의 현재 사용자 수를 증가시키면', () => {
        it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(
            repository.incrementMemberCount(projectId),
          ).rejects.toThrow(RecordNotFoundError);
        });
      });
    });
  });

  describe(ProjectRepository.prototype.decrementMemberCount.name, () => {
    let projectId: string;

    beforeEach(() => {
      projectId = generateEntityId();
    });

    describe('식별자와 일치하는 프로젝트가 존재하는 경우', () => {
      let project: Project;

      beforeEach(async () => {
        project = await repository.insert(
          ProjectFactory.build({ id: projectId, currentMemberCount: 1 }),
        );
      });

      describe('프로젝트의 현재 사용자 수를 증가시키면', () => {
        it('현재 사용자 수를 1 감소시켜야한다.', async () => {
          await expect(
            repository.decrementMemberCount(projectId),
          ).resolves.toEqual(project.currentMemberCount - 1);
        });
      });
    });

    describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
      describe('프로젝트의 현재 사용자 수를 감소시키면', () => {
        it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(
            repository.decrementMemberCount(projectId),
          ).rejects.toThrow(RecordNotFoundError);
        });
      });
    });
  });

  describe(ProjectRepository.prototype.findAllCursorPaginated.name, () => {
    let projects: Project[];

    beforeAll(async () => {
      projects = await Promise.all(
        [
          ProjectFactory.build({ status: ProjectStatus.recruiting }),
          ProjectFactory.build({ status: ProjectStatus.inProgress }),
          ProjectFactory.build({ status: ProjectStatus.completed }),
        ].map((project) => repository.insert(project)),
      );
    });

    describe('프로젝트 상태로 필터링 하는 경우', () => {
      it('프로젝트 상태와 일치하는 프로젝트만 반환해야한다.', async () => {
        const statuses = ['completed', 'inProgress'];

        const result = await repository.findAllCursorPaginated({
          filter: {
            statuses: new Set(['completed', 'inProgress']),
          },
        });

        expect(result.data.length).toBeGreaterThanOrEqual(2);
        expect(result.data).toSatisfyAll<Project>((el) =>
          statuses.includes(el.status),
        );
      });
    });

    describe('정렬 옵션이 존재하지 않는 경우', () => {
      it('기본 정렬인 id로 정렬된 프로젝트 목록이 반환돼야한다.', async () => {
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
      it('커서 이후의 프로젝트 목록만 반환해야한다.', async () => {
        const cursor = projects[0].id;
        const result = await repository.findAllCursorPaginated({
          cursor,
        });

        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toSatisfyAll<Project>((el) => el.id > cursor);
      });
    });

    describe('다음 커서가 존재하지 않는 경우', () => {
      it('프로젝트 목록만 반환해야한다.', async () => {
        const result = await repository.findAllCursorPaginated({
          limit: 10000,
        });

        expect(result.cursor).toBeUndefined();
        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toBeArray();
      });
    });

    describe('다음 커서가 존재하는 경우', () => {
      it('커서를 포함한 프로젝트를 반환해야한다.', async () => {
        const result = await repository.findAllCursorPaginated({
          limit: 1,
        });

        expect(result.cursor).toBeDefined();
        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toBeArrayOfSize(1);
      });
    });
  });
});
