import { ApiProperty } from '@nestjs/swagger';
import { IssueEntity } from '../entities/issue.entity';
import { PaginationMetaDto } from 'src/auth/dto/pagination-meta.dto';

export class PaginatedIssuesRerponseDto {
  @ApiProperty({ type: IssueEntity, isArray: true })
  items!: IssueEntity[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}