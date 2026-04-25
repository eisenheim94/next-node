import { ApiProperty } from '@nestjs/swagger';
import { IssueEntity } from 'src/issues/entities/issue.entity';
import { UserEntity } from 'src/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @ApiProperty({
    example: '9c8f4d7b-5b9a-4f7c-a2b3-6a9f5d2c1e44',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'I traced this to the filter state not being restored from the URL.',
  })
  @Column({ type: 'text' })
  body!: string;

  @ManyToOne(() => IssueEntity, (issue) => issue.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issueId' })
  issue!: IssueEntity;

  @ApiProperty({
    example: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
  })
  @Column({ type: 'uuid' })
  issueId!: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
  })
  @JoinColumn({ name: 'authorId' })
  author!: UserEntity;

  @ApiProperty({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
  })
  @Column({ type: 'uuid' })
  authorId!: string;

  @ApiProperty({
    example: '2026-04-25T12:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-25T12:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}