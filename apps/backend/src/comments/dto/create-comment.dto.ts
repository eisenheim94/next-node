import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'I traced this to the filter state not being restored from the URL.',
  })
  @IsString()
  @MinLength(1)
  body!: string;

  @ApiProperty({
    example: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
    format: 'uuid',
  })
  @IsUUID()
  issueId!: string;

  @ApiProperty({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
    format: 'uuid',
  })
  @IsUUID()
  authorId!: string;
}