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

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @ApiCreatedResponse({ type: ProjectEntity })
  create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOkResponse({ type: ProjectEntity, isArray: true })
  findAll(): Promise<ProjectEntity[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProjectEntity })
  findOne(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProjectEntity })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProjectEntity })
  remove(@Param('id') id: string): Promise<void> {
    return this.projectService.remove(id);
  }
}
