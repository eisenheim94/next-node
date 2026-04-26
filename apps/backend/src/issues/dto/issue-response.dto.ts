import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus } from 'src/core/types';
import { IssueProjectSummaryDto } from './issue-project-summary.dto';
import { IssueUserSummaryDto } from './issue-user-summary.dto';

export class IssueResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: IssueStatus })
  status!: IssueStatus;

  @ApiProperty({ enum: IssuePriority })
  priority!: IssuePriority;

  @ApiProperty()
  projectId!: string;

  @ApiProperty({ nullable: true })
  assigneeId!: string | null;

  @ApiProperty()
  reporterId!: string;

  @ApiProperty({ type: IssueProjectSummaryDto })
  project!: IssueProjectSummaryDto;

  @ApiProperty({ type: IssueUserSummaryDto, nullable: true })
  assignee!: IssueUserSummaryDto | null;

  @ApiProperty({ type: IssueUserSummaryDto })
  reporter!: IssueUserSummaryDto;

  @ApiProperty({ example: 3 })
  commentCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}