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
import { ListProjectApplicationsQueryFactory } from '@module/project/use-cases/list-project-applications/__spec__/list-project-applications-query.factory';
import { ListProjectApplicationsHandler } from '@module/project/use-cases/list-project-applications/list-project-applications.handler';
import { ListProjectApplicationsQuery } from '@module/project/use-cases/list-project-applications/list-project-applications.query';

describe(ListProjectApplicationsHandler.name, () => {
  let handler: ListProjectApplicationsHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectApplicationRepository: ProjectApplicationRepositoryPort;

  let query: ListProjectApplicationsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectApplicationRepositoryModule,
      ],
      providers: [ListProjectApplicationsHandler],
    }).compile();

    handler = module.get<ListProjectApplicationsHandler>(
      ListProjectApplicationsHandler,
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
    query = ListProjectApplicationsQueryFactory.build();
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하고', () => {
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('조회자가 프로젝트 매니저인 경우', () => {
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

      describe('프로젝트 구성원 지원서 목록을 조회하면', () => {
        let projectApplications: ProjectApplication[];

        beforeEach(async () => {
          projectApplications = await Promise.all(
            ProjectApplicationFactory.buildList(2, {
              projectId: project.id,
            }).map((projectApplication) =>
              projectApplicationRepository.insert(projectApplication),
            ),
          );
          await projectApplicationRepository.insert(
            ProjectApplicationFactory.build(),
          );
        });

        it('프로젝트 지원서 목록이 조회된다.', async () => {
          const result = await handler.execute(query);

          expect(result.data).toEqual(
            expect.arrayContaining(projectApplications),
          );
          expect(result.data).toSatisfyAll<ProjectApplication>(
            (projectMember) => projectMember.projectId === project.id,
          );
        });
      });
    });

    describe('조회자가 프로젝트 매니저가 아닌 경우', () => {
      describe('프로젝트 구성원 지원서 목록을 조회하면', () => {
        it('프로젝트 매니저만 지원서 목록을 조회할 수 있다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectApplicationViewRestrictedError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트 지원서 목록을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
