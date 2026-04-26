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

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';
import { IssueService } from './issue.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiErrorResponseDto } from 'src/auth/dto/api-error-response.dto';
import { UserRole } from 'src/core/types';
import { PaginatedIssuesResponseDto } from './dto/paginated-issues-response.dto';
import { ListIssuesQueryDto } from './dto/list-issues-query.dto';
import { IssueResponseDto } from './dto/issue-response.dto';

@ApiTags('issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: IssueResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  create(@Body() createIssueDto: CreateIssueDto): Promise<IssueResponseDto> {
    return this.issueService.create(createIssueDto);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedIssuesResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  findAll(
    @Query() query: ListIssuesQueryDto,
  ): Promise<PaginatedIssuesResponseDto> {
    return this.issueService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: IssueResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  findOne(@Param('id') id: string): Promise<IssueResponseDto> {
    return this.issueService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: IssueResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<IssueResponseDto> {
    return this.issueService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  remove(@Param('id') id: string): Promise<void> {
    return this.issueService.remove(id);
  }
}
