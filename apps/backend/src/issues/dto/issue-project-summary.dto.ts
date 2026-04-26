import { ApiProperty } from '@nestjs/swagger';

export class IssueProjectSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;
}