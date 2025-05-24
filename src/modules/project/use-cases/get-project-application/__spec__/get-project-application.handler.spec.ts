import { Test, TestingModule } from '@nestjs/testing';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
import { ProjectApplicationViewRestrictedError } from '@module/project/errors/project-application-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectApplicationQueryFactory } from '@module/project/use-cases/get-project-application/__spec__/get-project-application-query.factory';
import { GetProjectApplicationHandler } from '@module/project/use-cases/get-project-application/get-project-application.handler';
import { GetProjectApplicationQuery } from '@module/project/use-cases/get-project-application/get-project-application.query';

describe(GetProjectApplicationHandler.name, () => {
  let handler: GetProjectApplicationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectApplicationRepository: ProjectApplicationRepositoryPort;

  let query: GetProjectApplicationQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectApplicationRepositoryModule,
      ],
      providers: [GetProjectApplicationHandler],
    }).compile();

    handler = module.get<GetProjectApplicationHandler>(
      GetProjectApplicationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectApplicationRepository = module.get<ProjectApplicationRepositoryPort>(
      PROJECT_APPLICATION_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = GetProjectApplicationQueryFactory.build();
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('지원서 식별자에 해당하는 지원서가 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let application: ProjectApplication;

      beforeEach(async () => {
        application = await projectApplicationRepository.insert(
          ProjectApplicationFactory.build({
            id: query.applicationId,
            projectId: query.projectId,
          }),
        );
      });

      describe('조회자가 프로젝트 관리자인 경우', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let member: ProjectMember;

        beforeEach(async () => {
          member = await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              accountId: query.currentUserId,
              projectId: query.projectId,
              role: ProjectMemberRole.admin,
            }),
          );
        });

        describe('지원서를 조회하면', () => {
          it('지원서가 조회돼야한다.', async () => {
            await expect(handler.execute(query)).resolves.toEqual(
              expect.objectContaining({
                id: query.applicationId,
                projectId: query.projectId,
              }),
            );
          });
        });
      });

      describe('조회자가 프로젝트 관리자가 아닌 경우', () => {
        describe('지원서를 조회하면', () => {
          it('지원서 조회 권한이 없다는 에러가 발생해야한다.', async () => {
            await expect(handler.execute(query)).rejects.toThrow(
              ProjectApplicationViewRestrictedError,
            );
          });
        });
      });
    });

    describe('지원서 식별자에 해당하는 지원서가 존재하지 않는 경우', () => {
      describe('지원서를 조회하면', () => {
        it('지원서가 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectApplicationNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('지원서를 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
