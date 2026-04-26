import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/auth/dto/pagination-meta.dto';
import { IssueResponseDto } from './issue-response.dto';

export class PaginatedIssuesResponseDto {
  @ApiProperty({ type: IssueResponseDto, isArray: true })
  items!: IssueResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}