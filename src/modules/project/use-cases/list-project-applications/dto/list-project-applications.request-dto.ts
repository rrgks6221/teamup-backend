import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export class ListProjectApplicationsRequestDto {
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
    description: ',로 구분된 status',
    example: `${ProjectApplicationStatus.approved},${ProjectApplicationStatus.canceled}`,
  })
  @IsEnum(ProjectApplicationStatus, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  statuses?: ProjectApplicationStatus[];
}
