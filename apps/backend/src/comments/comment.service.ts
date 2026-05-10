import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { IssueEntity } from 'src/issues/entities/issue.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

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

  async create(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    await this.ensureIssueExists(createCommentDto.issueId);
    await this.ensureUserExists(createCommentDto.authorId);

    const comment = this.commentsRepository.create({
      body: createCommentDto.body,
      issueId: createCommentDto.issueId,
      authorId: createCommentDto.authorId,
    });

    const savedComment = await this.commentsRepository.save(comment);
    const commentWithAuthor = await this.findCommentWithAuthor(savedComment.id);

    return this.mapCommentToResponse(commentWithAuthor);
  }

  async findAllByIssue(issueId: string): Promise<CommentResponseDto[]> {
    await this.ensureIssueExists(issueId);

    const comments = await this.commentsRepository.find({
      where: { issueId },
      relations: {
        author: true,
      },
      order: { createdAt: 'DESC' },
    });

    return comments.map((comment) => this.mapCommentToResponse(comment));
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

  private async findCommentWithAuthor(id: string): Promise<CommentEntity> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} was not found`);
    }

    return comment;
  }

  private mapCommentToResponse(comment: CommentEntity): CommentResponseDto {
    return {
      id: comment.id,
      body: comment.body,
      issueId: comment.issueId,
      author: {
        id: comment.author.id,
        email: comment.author.email,
        displayName: comment.author.displayName,
        role: comment.author.role,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
