import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from '../projects/entities/project.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issuesRepository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepositry: Repository<UserEntity>
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<IssueEntity> {
    await this.ensureProjectExists(createIssueDto.projectId);
    await this.ensureUserExists(createIssueDto.reporterId, 'Reporter');

    if (createIssueDto.assigneeId) {
      await this.ensureUserExists(createIssueDto.assigneeId, 'Assignee');
    }

    const issue = this.issuesRepository.create({
      title: createIssueDto.title,
      description: createIssueDto.description ?? null,
      status: createIssueDto.status,
      priority: createIssueDto.priority,
      projectId: createIssueDto.projectId,
      reporterId: createIssueDto.reporterId,
      assigneeId: createIssueDto.assigneeId ?? null,
    });

    return this.issuesRepository.save(issue);
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<IssueEntity> {
    const issue = await this.findOne(id);

    if (updateIssueDto.projectId !== undefined) {
      await this.ensureProjectExists(updateIssueDto.projectId);
      issue.projectId = updateIssueDto.projectId;
    }

    if (updateIssueDto.reporterId !== undefined) {
      await this.ensureUserExists(updateIssueDto.reporterId, 'Reporter');
      issue.reporterId = updateIssueDto.reporterId;
    }

    if (updateIssueDto.assigneeId !== undefined) {
      await this.ensureUserExists(updateIssueDto.assigneeId, 'Assignee');
      issue.assigneeId = updateIssueDto.assigneeId;
    }

    if (updateIssueDto.title !== undefined) {
      issue.title = updateIssueDto.title;
    }

    if (updateIssueDto.description !== undefined) {
      issue.description = updateIssueDto.description;
    }

    if (updateIssueDto.status !== undefined) {
      issue.status = updateIssueDto.status;
    }

    if (updateIssueDto.priority !== undefined) {
      issue.priority = updateIssueDto.priority;
    }

    return this.issuesRepository.save(issue);
  }

  async remove (id: string): Promise<void> {
    const issue = await this.findOne(id);
    await this.issuesRepository.remove(issue);
  }

  async findAll(): Promise<IssueEntity[]> {
    return this.issuesRepository.find({
      order: {createdAt: 'DESC'},
    });
  }

  async findOne(id: string): Promise<IssueEntity> {
    const issue = await this.issuesRepository.findOne({
      where: {id},
    });

    if (!issue) {
      throw new NotFoundException(`Issue with id "${id}" was not found`)
    }

    return issue;
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: {id: projectId},
    });

    if (!project) {
      throw new NotFoundException(`Project with id "${projectId}" was not found`);
    }
  }

  private async ensureUserExists(userId: string, label: string): Promise<void> {
    const project = await this.usersRepositry.findOne({
      where: {id: userId},
    });

    if (!project) {
      throw new NotFoundException(`${label} with id "${userId}" was not found`);
    }
  }
}
