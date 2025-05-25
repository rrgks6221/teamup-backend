import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectInvitationViewRestrictedError } from '@module/project/errors/project-invitation-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
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
import { ListProjectInvitationsQueryFactory } from '@module/project/use-cases/list-project-invitations/__spec__/list-project-invitations-query.factory';
import { ListProjectInvitationsHandler } from '@module/project/use-cases/list-project-invitations/list-project-invitations.handler';
import { ListProjectInvitationsQuery } from '@module/project/use-cases/list-project-invitations/list-project-invitations.query';

describe(ListProjectInvitationsHandler.name, () => {
  let handler: ListProjectInvitationsHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectInvitationRepository: ProjectInvitationRepositoryPort;

  let query: ListProjectInvitationsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectInvitationRepositoryModule,
      ],
      providers: [ListProjectInvitationsHandler],
    }).compile();

    handler = module.get<ListProjectInvitationsHandler>(
      ListProjectInvitationsHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectInvitationRepository = module.get<ProjectInvitationRepositoryPort>(
      PROJECT_INVITATION_REPOSITORY,
    );
    2;
  });

  beforeEach(() => {
    query = ListProjectInvitationsQueryFactory.build();
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

      describe('프로젝트 구성원 초대장 목록을 조회하면', () => {
        let projectInvitations: ProjectInvitation[];

        beforeEach(async () => {
          projectInvitations = await Promise.all(
            ProjectInvitationFactory.buildList(2, {
              projectId: project.id,
            }).map((projectInvitation) =>
              projectInvitationRepository.insert(projectInvitation),
            ),
          );
          await projectInvitationRepository.insert(
            ProjectInvitationFactory.build(),
          );
        });

        it('프로젝트 초대장 목록이 조회된다.', async () => {
          const result = await handler.execute(query);

          expect(result.data).toEqual(
            expect.arrayContaining(projectInvitations),
          );
          expect(result.data).toSatisfyAll<ProjectInvitation>(
            (projectMember) => projectMember.projectId === project.id,
          );
        });
      });
    });

    describe('조회자가 프로젝트 매니저가 아닌 경우', () => {
      describe('프로젝트 구성원 초대장 목록을 조회하면', () => {
        it('프로젝트 매니저만 초대장 목록을 조회할 수 있다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectInvitationViewRestrictedError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트 초대장 목록을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
