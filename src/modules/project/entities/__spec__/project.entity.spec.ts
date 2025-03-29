import { faker } from '@faker-js/faker';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectApplicationCreationRestrictedError } from '@module/project/errors/project-application-creation-restricted.error';
import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';

import { generateEntityId } from '@common/base/base.entity';

describe(Project.name, () => {
  let project: Project;

  beforeEach(() => {
    project = ProjectFactory.build();
  });

  describe(Project.prototype.removeMember.name, () => {
    describe('구성원의 역할이 소유자인 경우', () => {
      let projectMember: ProjectMember;

      beforeEach(() => {
        projectMember = ProjectMemberFactory.build({
          role: ProjectMemberRole.owner,
        });
      });

      describe('구성원을 삭제하면', () => {
        it('프로젝트 소유자는 제거할 수 없다는 에러가 발생한다.', () => {
          expect(() => project.removeMember(projectMember)).toThrow(
            ProjectMemberDeletionRestrictedError,
          );
        });
      });
    });

    describe('구성원의 역할이 소유자가 아닌 경우', () => {
      let projectMember: ProjectMember;

      beforeEach(() => {
        projectMember = ProjectMemberFactory.build({
          role: ProjectMemberRole.member,
        });
      });

      describe('구성원을 삭제하면', () => {
        it('구성원이 삭제된다.', () => {
          expect(project.removeMember(projectMember)).toBeUndefined();
        });
      });
    });
  });

  describe(Project.prototype.createApplication.name, () => {
    let props: Parameters<typeof Project.prototype.createApplication>[0];

    beforeEach(() => {
      props = {
        applicantId: generateEntityId(),
        positionName: faker.string.alpha(),
      };
    });

    describe('진행중인 지원서가 존재하지 않는 경우', () => {
      beforeEach(() => {
        project.applications = [
          ProjectApplicationFactory.build({
            status: ProjectApplicationStatus.rejected,
            applicantId: props.applicantId,
          }),
        ];
      });

      describe('지원서를 생성하면', () => {
        it('지원서가 생성돼야한다.', () => {
          expect(project.createApplication(props)).toEqual(
            expect.objectContaining({
              projectId: project.id,
              applicantId: props.applicantId,
              positionName: props.positionName,
            }),
          );
        });
      });
    });

    describe('진행중인 지원서가 존재하는 경우', () => {
      beforeEach(() => {
        project.applications = [
          ProjectApplicationFactory.build({
            status: ProjectApplicationStatus.checked,
            applicantId: props.applicantId,
          }),
        ];
      });

      describe('지원서를 생성하면', () => {
        it('아직 처리되니 않은 지원서가 존재한다는 에러가 발생해야한다.', () => {
          expect(() => project.createApplication(props)).toThrow(
            ProjectApplicationCreationRestrictedError,
          );
        });
      });
    });
  });
});
