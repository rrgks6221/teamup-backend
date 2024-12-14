import { Test, TestingModule } from '@nestjs/testing';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { Project } from '@module/project/entities/project.entity';
import { ProjectRepository } from '@module/project/repositories/project.repository';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import { generateEntityId } from '@common/base/base.entity';

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
});
