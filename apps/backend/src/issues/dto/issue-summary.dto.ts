import { ApiProperty } from '@nestjs/swagger';

import { IssuePriority, IssueStatus } from 'src/core/types';

export class IssueSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: IssueStatus })
  status!: IssueStatus;

  @ApiProperty({ enum: IssuePriority })
  priority!: IssuePriority;
}
