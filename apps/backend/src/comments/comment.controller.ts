import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { ApiErrorResponseDto } from 'src/auth/dto/api-error-response.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  create(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.commentService.create(createCommentDto);
  }

  @Get('issue/:issueId')
  @ApiOkResponse({ type: CommentResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  findAllByIssue(
    @Param('issueId', new ParseUUIDPipe()) issueId: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.findAllByIssue(issueId);
  }
}
