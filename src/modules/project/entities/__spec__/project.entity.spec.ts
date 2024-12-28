import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';

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
});
