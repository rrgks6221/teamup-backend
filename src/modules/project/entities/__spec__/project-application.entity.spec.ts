import { faker } from '@faker-js/faker';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import {
  ProjectApplication,
  ProjectApplicationStatus,
} from '@module/project/entities/project-application.entity';
import { ProjectApplicationValidationError } from '@module/project/errors/project-application-validation.error';

describe(ProjectApplication.name, () => {
  let projectApplication: ProjectApplication;

  beforeEach(() => {
    projectApplication = ProjectApplicationFactory.build();
  });

  describe(ProjectApplication.prototype.markAsChecked.name, () => {
    describe('프로젝트 상태가 pending 상태인 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: ProjectApplicationStatus.pending,
        });
      });

      describe('체크 상태로 마킹하면', () => {
        it('checked 상태로 변경돼야한다.', () => {
          expect(projectApplication.markAsChecked()).toBeUndefined();
          expect(projectApplication.status).toBe(
            ProjectApplicationStatus.checked,
          );
          expect(projectApplication.checkedAt).toBeInstanceOf(Date);
        });
      });
    });

    describe('프로젝트 상태가 pending 상태가 아닌 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: faker.helpers.arrayElement([
            ProjectApplicationStatus.checked,
            ProjectApplicationStatus.approved,
            ProjectApplicationStatus.rejected,
          ]),
        });
      });

      describe('체크 상태로 마킹하면', () => {
        it('pending 상태일때만 체크할 수 있다는 에러가 발생해야한다.', () => {
          expect(() => projectApplication.markAsChecked()).toThrow(
            ProjectApplicationValidationError,
          );
        });
      });
    });
  });

  describe(ProjectApplication.prototype.approve.name, () => {
    describe('프로젝트 지원서 상태가 checked 상태인 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: ProjectApplicationStatus.checked,
        });
      });

      describe('승인하면', () => {
        it('approved 상태로 변경돼야한다.', () => {
          expect(projectApplication.approve()).toBeUndefined();
          expect(projectApplication.status).toBe(
            ProjectApplicationStatus.approved,
          );
          expect(projectApplication.approvedAt).toBeInstanceOf(Date);
        });
      });
    });

    describe('프로젝트 지원서 상태가 checked 상태가 아닌 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: faker.helpers.arrayElement([
            ProjectApplicationStatus.pending,
            ProjectApplicationStatus.approved,
            ProjectApplicationStatus.rejected,
          ]),
        });
      });

      describe('승인하면', () => {
        it('checked 상태일때만 승인할 수 있다는 에러가 발생해야한다.', () => {
          expect(() => projectApplication.approve()).toThrow(
            ProjectApplicationValidationError,
          );
        });
      });
    });
  });

  describe(ProjectApplication.prototype.reject.name, () => {
    describe('프로젝트 지원서 상태가 checked 상태인 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: ProjectApplicationStatus.checked,
        });
      });

      describe('거절하면', () => {
        it('rejected 상태로 변경돼야한다.', () => {
          expect(projectApplication.reject()).toBeUndefined();
          expect(projectApplication.status).toBe(
            ProjectApplicationStatus.rejected,
          );
          expect(projectApplication.rejectedAt).toBeInstanceOf(Date);
        });
      });
    });

    describe('프로젝트 지원서 상태가 checked 상태가 아닌 경우', () => {
      beforeEach(() => {
        projectApplication = ProjectApplicationFactory.build({
          status: faker.helpers.arrayElement([
            ProjectApplicationStatus.pending,
            ProjectApplicationStatus.approved,
            ProjectApplicationStatus.rejected,
          ]),
        });
      });

      describe('거절하면', () => {
        it('checked 상태일때만 거절 수 있다는 에러가 발생해야한다.', () => {
          expect(() => projectApplication.reject()).toThrow(
            ProjectApplicationValidationError,
          );
        });
      });
    });
  });
});
