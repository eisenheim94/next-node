import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';
import { IssueService } from './issue.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post()
  @ApiCreatedResponse({ type: IssueEntity })
  create(@Body() createIssueDto: CreateIssueDto): Promise<IssueEntity> {
    return this.issueService.create(createIssueDto);
  }

  @Get()
  @ApiOkResponse({ type: IssueEntity, isArray: true })
  findAll(): Promise<IssueEntity[]> {
    return this.issueService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: IssueEntity })
  findOne(@Param('id') id: string): Promise<IssueEntity> {
    return this.issueService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: IssueEntity })
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<IssueEntity> {
    return this.issueService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: IssueEntity })
  remove(@Param('id') id: string): Promise<void> {
    return this.issueService.remove(id);
  }
}
