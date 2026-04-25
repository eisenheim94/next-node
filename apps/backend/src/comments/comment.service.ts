import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { IssueEntity } from 'src/issues/entities/issue.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(IssueEntity)
    private readonly issuesRepository: Repository<IssueEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) { }

  async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
    await this.ensureIssueExists(createCommentDto.issueId);
    await this.ensureUserExists(createCommentDto.authorId);

    const comment = this.commentsRepository.create({
      body: createCommentDto.body,
      issueId: createCommentDto.issueId,
      authorId: createCommentDto.authorId,
    });

    return this.commentsRepository.save(comment);
  }

  async findAllByIssue(issueId: string): Promise<CommentEntity[]> {
    await this.ensureIssueExists(issueId);

    return this.commentsRepository.find({
      where: { issueId },
      order: { createdAt: 'DESC' },
    });
  }

  async ensureIssueExists(id: string) {
    const issue = await this.issuesRepository.findOne({
      where: { id },
    });

    if (!issue) {
      throw new NotFoundException(`Issue with id ${id} wat not found`);
    }
  }

  async ensureUserExists(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
  }
}