import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ProjectStatus } from '@module/project/entities/project.entity';

export class ListProjectsRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({
    format: 'integer',
    minimum: 10,
    maximum: 100,
  })
  @Max(100)
  @Min(10)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: '","로 구분된 프로젝트 상태',
    example: 'recruiting,inProgress',
    enum: ProjectStatus,
  })
  @IsEnum(ProjectStatus, { each: true })
  @ArrayUnique()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  statuses?: ProjectStatus[];
}
