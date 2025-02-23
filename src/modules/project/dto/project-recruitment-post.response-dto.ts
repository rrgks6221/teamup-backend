import { ApiProperty } from '@nestjs/swagger';

import { ProjectRecruitmentPostStatus } from '@module/project/entities/project-recruitment-post.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ProjectRecruitmentPostResponseDto extends BaseResponseDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  techStackNames: string[];

  @ApiProperty({
    enum: ProjectRecruitmentPostStatus,
  })
  recruitmentStatus: ProjectRecruitmentPostStatus;

  @ApiProperty({
    nullable: true,
  })
  maxRecruitsCount: number | null;

  @ApiProperty()
  currentRecruitsCount: number;

  @ApiProperty({
    nullable: true,
  })
  applicantsEndsAt: Date | null;

  @ApiProperty()
  applicantsCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  viewCount: number;
}
