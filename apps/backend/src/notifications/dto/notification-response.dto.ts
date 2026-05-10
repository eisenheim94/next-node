import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryDto } from '../../users/dto/user-summary.dto';
import { IssueSummaryDto } from '../../issues/dto/issue-summary.dto';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sourceEventId!: string;

  @ApiProperty()
  eventType!: string;

  @ApiProperty({ type: IssueSummaryDto })
  issue!: IssueSummaryDto;

  @ApiProperty({ type: UserSummaryDto })
  recipient!: UserSummaryDto;

  @ApiProperty()
  message!: string;

  @ApiProperty({ nullable: true })
  readAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;
}
