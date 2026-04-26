import { ApiProperty } from '@nestjs/swagger';
import { IssueUserSummaryDto } from 'src/issues/dto/issue-user-summary.dto';

export class CommentResponseDto {
  @ApiProperty({
    example: '9c8f4d7b-5b9a-4f7c-a2b3-6a9f5d2c1e44',
  })
  id!: string;

  @ApiProperty({
    example: 'I traced this to the filter state not being restored from the URL.',
  })
  body!: string;

  @ApiProperty({
    example: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
  })
  issueId!: string;

  @ApiProperty({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
  })
  authorId!: string;

  @ApiProperty({ type: IssueUserSummaryDto })
  author!: IssueUserSummaryDto;

  @ApiProperty({
    example: '2026-04-25T12:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-25T12:30:00.000Z',
  })
  updatedAt!: Date;
}
