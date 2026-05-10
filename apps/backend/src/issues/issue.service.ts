import { randomUUID } from 'crypto';
import {
  IssueCreatedEvent,
  IssueStatusChangedEvent,
} from 'src/messaging/contracts/issue-events';
import { IssueEventPattern } from 'src/messaging/rabbitmq.constants';
import { RabbitMqService } from 'src/messaging/rabbitmq.service';

import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {ProjectEntity} from '../projects/entities/project.entity';
import {UserEntity} from '../users/entities/user.entity';
import {CreateIssueDto} from './dto/create-issue.dto';
import {UpdateIssueDto} from './dto/update-issue.dto';
import {IssueEntity} from './entities/issue.entity';
import {IssueSortBy, ListIssuesQueryDto} from './dto/list-issues-query.dto';
import {IssueResponseDto} from './dto/issue-response.dto';
import {PaginatedIssuesResponseDto} from './dto/paginated-issues-response.dto';

@Injectable()
export class IssueService {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    @InjectRepository(IssueEntity)
    private readonly issuesRepository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly rabbitMqService: RabbitMqService,
  ) { }

  async create(createIssueDto: CreateIssueDto): Promise<IssueResponseDto> {
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

    const savedIssue = await this.issuesRepository.save(issue);
    const createdIssue = await this.findOne(savedIssue.id);

    await this.publishIssueCreatedEvent(createdIssue);

    return createdIssue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<IssueResponseDto> {
    const issue = await this.findOne(id);
    const previousStatus = issue.status;

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

    await this.issuesRepository.save(issue);
    const updatedIssue = await this.findOne(id);

    if (
      updateIssueDto.status !== undefined &&
      previousStatus !== updateIssueDto.status
    ) {
      await this.publishIssueStatusChangedEvent(updatedIssue, previousStatus);
    }

    return updatedIssue;
  }

  async remove(id: string): Promise<void> {
    const issue = await this.findOneEntity(id);
    await this.issuesRepository.remove(issue);
  }

  async findAll(query: ListIssuesQueryDto): Promise<PaginatedIssuesResponseDto> {
    const queryBuilder = this.issuesRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.project', 'project')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .loadRelationCountAndMap('issue.commentCount', 'issue.comments')
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
        { search: `%${query.search}%` },
      );
    }

    queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.limit);

    return {
      items: items.map((issue) => this.mapIssueToResponse(issue)),
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

  private async findOneEntity(id: string): Promise<IssueEntity> {
    const issue = await this.issuesRepository.findOne({
      where: { id },
      relations: {
        project: true,
        reporter: true,
        assignee: true,
      },
    });

    if (!issue) {
      throw new NotFoundException(`Issue with id "${id}" was not found`)
    }

    return issue;
  }

  async findOne(id: string): Promise<IssueResponseDto> {
    const issue = await this.issuesRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.project', 'project')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .loadRelationCountAndMap('issue.commentCount', 'issue.comments')
      .where('issue.id = :id', { id })
      .getOne();

    if (!issue) {
      throw new NotFoundException(`Issue with id "${id}" was not found`)
    }

    return this.mapIssueToResponse(issue);
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
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`${label} with id "${userId}" was not found`);
    }
  }

  private async publishIssueCreatedEvent(issue: IssueResponseDto): Promise<void> {
    const event: IssueCreatedEvent = {
      eventId: randomUUID(),
      pattern: IssueEventPattern.ISSUE_CREATED,
      occurredAt: new Date().toISOString(),
      payload: {
        issueId: issue.id,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
        projectId: issue.projectId,
        reporterId: issue.reporterId,
        assigneeId: issue.assigneeId,
      },
    };

    await this.publishEvent(event.pattern, event);
  }

  private async publishIssueStatusChangedEvent(
    issue: IssueResponseDto,
    previousStatus: IssueResponseDto['status'],
  ): Promise<void> {
    const event: IssueStatusChangedEvent = {
      eventId: randomUUID(),
      pattern: IssueEventPattern.ISSUE_STATUS_CHANGED,
      occurredAt: new Date().toISOString(),
      payload: {
        issueId: issue.id,
        title: issue.title,
        previousStatus,
        currentStatus: issue.status,
        priority: issue.priority,
        projectId: issue.projectId,
        reporterId: issue.reporterId,
        assigneeId: issue.assigneeId,
      },
    };

    await this.publishEvent(event.pattern, event);
  }

  private async publishEvent(
    pattern: IssueEventPattern,
    event: IssueCreatedEvent | IssueStatusChangedEvent,
  ): Promise<void> {
    try {
      await this.rabbitMqService.publish(pattern, event);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${pattern}`, error);
    }
  }

  private mapIssueToResponse(issue: IssueEntity): IssueResponseDto {
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      projectId: issue.projectId,
      reporterId: issue.reporterId,
      assigneeId: issue.assigneeId,
      project: {
        id: issue.project.id,
        name: issue.project.name,
        description: issue.project.description,
      },
      reporter: {
        id: issue.reporter.id,
        email: issue.reporter.email,
        displayName: issue.reporter.displayName,
        role: issue.reporter.role,
      },
      assignee: issue.assignee
        ? {
          id: issue.assignee.id,
          email: issue.assignee.email,
          displayName: issue.assignee.displayName,
          role: issue.assignee.role,
        }
        : null,
      commentCount: issue.commentCount ?? 0,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }

}
