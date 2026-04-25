import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { IssuePriority, IssueStatus } from '../../core/types';

export class CreateIssueDto {
  @ApiProperty({
    example: 'Fix broken dashboard filter',
    maxLength: 160,
  })
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional({
    example: 'The status filter resets after page refresh.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: IssueStatus,
    default: IssueStatus.BACKLOG,
    example: IssueStatus.BACKLOG,
  })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional({
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
    example: IssuePriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @ApiProperty({
    example: '8c6a0d12-5e70-4d8e-a2a1-8e8c4d2f1b10',
    format: 'uuid',
  })
  @IsUUID()
  projectId!: string;

  @ApiProperty({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
    format: 'uuid',
  })
  @IsUUID()
  reporterId!: string;

  @ApiPropertyOptional({
    example: '2cb3e4f4-2f59-4f5a-b5a5-3b4b3c4e8f21',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
