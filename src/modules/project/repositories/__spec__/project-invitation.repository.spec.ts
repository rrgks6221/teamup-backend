import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
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
});
