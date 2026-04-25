import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';
import { IssueService } from './issue.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiErrorResponseDto } from 'src/auth/dto/api-error-response.dto';
import { PaginatedIssuesRerponseDto } from './dto/paginated-issues-response.dto';
import { ListIssuesQueryDto } from './dto/list-issues-query.dto';

@ApiTags('issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post()
  @ApiCreatedResponse({ type: IssueEntity })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  create(@Body() createIssueDto: CreateIssueDto): Promise<IssueEntity> {
    return this.issueService.create(createIssueDto);
  }

  @Get()
  @ApiOkResponse({ type: IssueEntity, isArray: true })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  findAll(
    @Query() query: ListIssuesQueryDto,
  ): Promise<PaginatedIssuesRerponseDto> {
    return this.issueService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: IssueEntity })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  findOne(@Param('id') id: string): Promise<IssueEntity> {
    return this.issueService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: IssueEntity })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<IssueEntity> {
    return this.issueService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  remove(@Param('id') id: string): Promise<void> {
    return this.issueService.remove(id);
  }
}
