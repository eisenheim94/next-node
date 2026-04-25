import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { IssuePriority, IssueStatus } from '../../core/types';

export enum IssueSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  STATUS = 'status',
  PRIORITY = 'priority',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListIssuesQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ enum: IssueStatus })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiPropertyOptional({ enum: IssuePriority })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiPropertyOptional({
    example: '8c6a0d12-5e70-4d8e-a2a1-8e8c4d2f1b10',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  reporterId?: string;

  @ApiPropertyOptional({
    example: '2cb3e4f4-2f59-4f5a-b5a5-3b4b3c4e8f21',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    example: 'dashboard',
    description: 'Searches title and description',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: IssueSortBy,
    default: IssueSortBy.CREATED_AT,
  })
  @IsEnum(IssueSortBy)
  @IsOptional()
  sortBy: IssueSortBy = IssueSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder = SortOrder.DESC;
}