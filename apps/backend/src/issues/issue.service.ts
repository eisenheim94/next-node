import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from '../projects/entities/project.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';
import { IssueSortBy, ListIssuesQueryDto } from './dto/list-issues-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issuesRepository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepositry: Repository<UserEntity>
  ) { }

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

  async remove(id: string): Promise<void> {
    const issue = await this.findOne(id);
    await this.issuesRepository.remove(issue);
  }

  async findAll(query: ListIssuesQueryDto): Promise<PaginatedResponse<IssueEntity>> {
    const queryBuilder = this.issuesRepository
      .createQueryBuilder('issue')
      .orderBy(
        `issue.${this.mapSortBy(query.sortBy)}`,
        query.sortOrder,
      );

    if (query.status) {
      queryBuilder.andWhere('issue.status = :status', {
        status: query.status,
      });
    }

    if (query.priority) {
      queryBuilder.andWhere('issue.priority = :priority', {
        priority: query.priority,
      });
    }

    if (query.projectId) {
      queryBuilder.andWhere('issue.projectId = :projectId', {
        projectId: query.projectId,
      });
    }

    if (query.reporterId) {
      queryBuilder.andWhere('issue.reporterId = :reporterId', {
        reporterId: query.reporterId,
      });
    }

    if (query.assigneeId) {
      queryBuilder.andWhere('issue.assigneeId = :assigneeId', {
        assigneeId: query.assigneeId,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(issue.title ILIKE :search OR issue.description ILIKE :search)',
        { search: `%${query.search}` },
      );
    }

    queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.limit);

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findOne(id: string): Promise<IssueEntity> {
    const issue = await this.issuesRepository.findOne({
      where: { id },
    });

    if (!issue) {
      throw new NotFoundException(`Issue with id "${id}" was not found`)
    }

    return issue;
  }

  private mapSortBy(sortBy: IssueSortBy): string {
    switch (sortBy) {
      case IssueSortBy.UPDATED_AT:
        return 'updatedAt';
      case IssueSortBy.TITLE:
        return 'title';
      case IssueSortBy.STATUS:
        return 'status';
      case IssueSortBy.PRIORITY:
        return 'priority';
      case IssueSortBy.CREATED_AT:
      default:
        return 'createdAt';
    }
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with id "${projectId}" was not found`);
    }
  }

  private async ensureUserExists(userId: string, label: string): Promise<void> {
    const project = await this.usersRepositry.findOne({
      where: { id: userId },
    });

    if (!project) {
      throw new NotFoundException(`${label} with id "${userId}" was not found`);
    }
  }
}
