import {
  ProjectRecruitmentPost,
  ProjectRecruitmentPostStatus,
} from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostRaw } from '@module/project/repositories/project-recruitment-post.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ProjectRecruitmentPostMapper extends BaseMapper {
  static toEntity(raw: ProjectRecruitmentPostRaw): ProjectRecruitmentPost {
    return new ProjectRecruitmentPost({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        projectId: this.toEntityId(raw.projectId),
        authorId: this.toEntityId(raw.authorId),
        title: raw.title,
        description: raw.description,
        position: raw.position,
        techStackNames: raw.techStackNames,
        recruitmentStatus: ProjectRecruitmentPostStatus[raw.recruitmentStatus],
        commentsCount: raw.commentsCount,
        viewCount: raw.viewCount,
      },
    });
  }

  static toPersistence(
    entity: ProjectRecruitmentPost,
  ): ProjectRecruitmentPostRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      projectId: this.toPrimaryKey(entity.props.projectId),
      authorId: this.toPrimaryKey(entity.props.authorId),
      title: entity.props.title,
      description: entity.props.description,
      position: entity.props.position,
      techStackNames: entity.props.techStackNames,
      recruitmentStatus: entity.props.recruitmentStatus,
      commentsCount: entity.props.commentsCount,
      viewCount: entity.props.viewCount,
    };
  }
}
