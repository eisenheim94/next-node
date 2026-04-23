import {
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
  } from 'class-validator';
  
  import { IssuePriority, IssueStatus } from '../../core/types';

  export class CreateIssueDto {
    @IsString()
    @MaxLength(160)
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(IssueStatus)
    status?: IssueStatus;

    @IsOptional()
    @IsEnum(IssuePriority)
    priority?: IssuePriority

    @IsUUID()
    projectId!: string;

    @IsUUID()
    reporterId!: string;

    @IsOptional()
    @IsUUID()
    assigneeId?: string;
  }