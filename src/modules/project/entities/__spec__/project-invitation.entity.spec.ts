import { faker } from '@faker-js/faker';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationValidationError } from '@module/project/errors/project-invitation-validation.error';

describe(ProjectInvitation.name, () => {
  let projectInvitation: ProjectInvitation;

  beforeEach(() => {
    projectInvitation = ProjectInvitationFactory.build();
  });

  describe(ProjectInvitation.prototype.markAsChecked.name, () => {
    describe('초대장 상태가 pending 상태인 경우', () => {
      beforeEach(() => {
        projectInvitation = ProjectInvitationFactory.build({
          status: ProjectInvitationStatus.pending,
        });
      });

      describe('체크 상태로 마킹하면', () => {
        it('checked 상태로 변경돼야한다.', () => {
          expect(projectInvitation.markAsChecked()).toBeUndefined();
          expect(projectInvitation.status).toBe(
            ProjectInvitationStatus.checked,
          );
          expect(projectInvitation.checkedAt).toBeInstanceOf(Date);
        });
      });
    });

    describe('초대장 상태가 pending 상태가 아닌 경우', () => {
      beforeEach(() => {
        projectInvitation = ProjectInvitationFactory.build({
          status: faker.helpers.arrayElement([
            ProjectInvitationStatus.checked,
            ProjectInvitationStatus.canceled,
            ProjectInvitationStatus.approved,
            ProjectInvitationStatus.rejected,
          ]),
        });
      });

      describe('체크 상태로 마킹하면', () => {
        it('pending 상태일때만 체크할 수 있다는 에러가 발생해야한다.', () => {
          expect(() => projectInvitation.markAsChecked()).toThrow(
            ProjectInvitationValidationError,
          );
        });
      });
    });
  });
});
