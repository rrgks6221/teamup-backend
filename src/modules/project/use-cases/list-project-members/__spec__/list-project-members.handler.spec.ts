import { Test, TestingModule } from '@nestjs/testing';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectMember } from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
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
import { ListProjectMembersQueryFactory } from '@module/project/use-cases/list-project-members/__spec__/list-project-members-query.factory';
import { ListProjectMembersHandler } from '@module/project/use-cases/list-project-members/list-project-members.handler';
import { ListProjectMembersQuery } from '@module/project/use-cases/list-project-members/list-project-members.query';

describe(ListProjectMembersHandler.name, () => {
  let handler: ListProjectMembersHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;

  let query: ListProjectMembersQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule, ProjectMemberRepositoryModule],
      providers: [ListProjectMembersHandler],
    }).compile();

    handler = module.get<ListProjectMembersHandler>(ListProjectMembersHandler);

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = ListProjectMembersQueryFactory.build();
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하고', () => {
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('프로젝트 구성원 목록을 조회하면', () => {
      let projectMembers: ProjectMember[];

      beforeEach(async () => {
        projectMembers = await Promise.all(
          ProjectMemberFactory.buildList(2, { projectId: project.id }).map(
            (projectMember) => projectMemberRepository.insert(projectMember),
          ),
        );
        await projectMemberRepository.insert(ProjectMemberFactory.build());
      });

      it('프로젝트 구성원 목록이 조회된다.', async () => {
        const result = await handler.execute(query);

        expect(result.data).toEqual(expect.arrayContaining(projectMembers));
        expect(result.data).toSatisfyAll<ProjectMember>(
          (projectMember) => projectMember.projectId === project.id,
        );
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트 구성원 목록을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
