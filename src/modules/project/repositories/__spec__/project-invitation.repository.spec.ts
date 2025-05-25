import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationRepository } from '@module/project/repositories/project-invitation.repository';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectInvitationRepository.name, () => {
  let repository: ProjectInvitationRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_INVITATION_REPOSITORY,
          useClass: ProjectInvitationRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectInvitationRepositoryPort>(
      PROJECT_INVITATION_REPOSITORY,
    );
  });

  describe(ProjectInvitationRepository.prototype.findOneById.name, () => {
    let projectInvitationId: string;

    beforeEach(() => {
      projectInvitationId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let projectInvitation: ProjectInvitation;

      beforeEach(async () => {
        projectInvitation = await repository.insert(
          ProjectInvitationFactory.build({ id: projectInvitationId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(projectInvitationId),
          ).resolves.toEqual(projectInvitation);
        });
      });
    });
  });

  describe(
    ProjectInvitationRepository.prototype.findByProjectInvitee.name,
    () => {
      let projectId: string;
      let inviteeId: string;

      beforeEach(() => {
        projectId = generateEntityId();
        inviteeId = generateEntityId();
      });

      describe('지원대상과 프로젝트가 일치하는 초대장 존재하는 경우', () => {
        let invitations: ProjectInvitation[];

        beforeEach(async () => {
          invitations = await Promise.all(
            [
              ProjectInvitationFactory.build({
                projectId,
                inviteeId,
              }),
              ProjectInvitationFactory.build({
                projectId,
                inviteeId,
              }),
              ProjectInvitationFactory.build({}),
            ].map((invitation) => repository.insert(invitation)),
          );
        });

        describe('초대장을 조회하면', () => {
          it('해당 프로젝트에 초대한 초대서 목록만 반환돼야한다.', async () => {
            await expect(
              repository.findByProjectInvitee(projectId, inviteeId),
            ).resolves.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: invitations[0].id,
                  projectId,
                  inviteeId,
                }),
                expect.objectContaining({
                  id: invitations[1].id,
                  projectId,
                  inviteeId,
                }),
              ]),
            );
          });
        });
      });

      describe('초대받은 사람과 프로젝트가 일치하는 초대장이 존재하지 않는 경우', () => {
        describe('초대장을 조회하면', () => {
          it('빈 초대장 목록이 조회돼야한다.', async () => {
            await expect(
              repository.findByProjectInvitee(projectId, inviteeId),
            ).resolves.toBeArrayOfSize(0);
          });
        });
      });
    },
  );

  describe(
    ProjectInvitationRepository.prototype.findAllCursorPaginated.name,
    () => {
      let projectId: string;
      let projectInvitations: ProjectInvitation[];

      beforeAll(async () => {
        projectId = generateEntityId();

        projectInvitations = await Promise.all(
          [
            ProjectInvitationFactory.build(),
            ProjectInvitationFactory.build({ projectId }),
            ProjectInvitationFactory.build({ projectId }),
          ].map((project) => repository.insert(project)),
        );
      });

      describe('프로젝트 식별자로 필터링 하는 경우', () => {
        it('프로젝트 식별자와 일치하는 프로젝트 초대장만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            filter: {
              projectId,
            },
          });

          expect(result.data.length).toBeGreaterThanOrEqual(2);
          expect(result.data).toSatisfyAll<ProjectInvitation>(
            (projectInvitation) => projectInvitation.projectId === projectId,
          );
        });
      });

      describe('프로젝트 상태로 필터링 하는 경우', () => {
        let statuses: Set<ProjectInvitationStatus>;

        beforeEach(async () => {
          statuses = new Set([
            ProjectInvitationStatus.approved,
            ProjectInvitationStatus.canceled,
          ]);

          projectInvitations = await Promise.all(
            [
              ProjectInvitationFactory.build({
                status: ProjectInvitationStatus.approved,
              }),
              ProjectInvitationFactory.build({
                status: ProjectInvitationStatus.canceled,
              }),
              ProjectInvitationFactory.build({
                status: ProjectInvitationStatus.checked,
              }),
            ].map((project) => repository.insert(project)),
          );
        });

        it('프로젝트 지원서 상태와 일치하는 프로젝트 초대장만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            filter: {
              statuses: statuses,
            },
          });

          expect(result.data.length).not.toBeEmpty();
          expect(result.data).toSatisfyAll<ProjectInvitation>(
            (projectApplication) => statuses.has(projectApplication.status),
          );
        });
      });

      describe('정렬 옵션이 존재하지 않는 경우', () => {
        it('기본 정렬인 id로 정렬된 프로젝트 초대장 목록이 반환돼야한다.', async () => {
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
        it('커서 이후의 프로젝트 구성원 초대장만 반환해야한다.', async () => {
          const cursor = projectInvitations[0].id;
          const result = await repository.findAllCursorPaginated({
            cursor,
          });

          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toSatisfyAll<ProjectInvitation>(
            (el) => el.id > cursor,
          );
        });
      });

      describe('다음 커서가 존재하지 않는 경우', () => {
        it('프로젝트 지원서 목록만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            limit: 10000,
          });

          expect(result.cursor).toBeUndefined();
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toBeArray();
        });
      });

      describe('다음 커서가 존재하는 경우', () => {
        it('커서를 포함한 프로젝트 지원서 목록을 반환해야한다.', async () => {
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
