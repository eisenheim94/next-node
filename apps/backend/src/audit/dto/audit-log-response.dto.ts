import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({
    example: '9f43718f-9d5b-43e8-8fd9-7cf0f8e4b2af',
  })
  id!: string;

  @ApiProperty({
    example: '34dbb5df-1a4a-4c44-a4aa-8f9f4ffbe3ff',
  })
  eventId!: string;

  @ApiProperty({
    example: 'issue.created',
  })
  eventType!: string;

  @ApiProperty({
    example: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
  })
  issueId!: string;

  @ApiProperty({
    example: '2026-05-04T11:30:00.000Z',
  })
  occurredAt!: Date;

  @ApiProperty({
    example: {
      issueId: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
      title: 'Fix broken dashboard filter',
      projectId: 'b3cdb513-6c95-4730-a8d8-738ef3f456b2',
      reporterId: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
      assigneeId: null,
      priority: 'HIGH',
      status: 'BACKLOG',
    },
  })
  payload!: Record<string, unknown>;

  @ApiProperty({
    example: '2026-05-04T11:30:01.000Z',
  })
  processedAt!: Date;
}
