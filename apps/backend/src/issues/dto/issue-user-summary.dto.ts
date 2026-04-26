import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/types';

export class IssueUserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}