import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sourceEventId!: string;

  @ApiProperty()
  eventType!: string;

  @ApiProperty()
  issueId!: string;

  @ApiProperty()
  recipientId!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({ nullable: true })
  readAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;
}
