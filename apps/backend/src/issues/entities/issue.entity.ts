import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IssuePriority, IssueStatus } from '../../core/types';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'issues' })
export class IssueEntity {
  @ApiProperty({
    example: '4e1b4a8a-6ac0-4ef0-8f22-1dc78bde3b63',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'Fix broken dashboard filter',
  })
  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @ApiProperty({
    example: 'The status filter resets after page refresh.',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ApiProperty({
    enum: IssueStatus,
    example: IssueStatus.BACKLOG,
    default: IssueStatus.BACKLOG,
  })
  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.BACKLOG,
  })
  status!: IssueStatus;

  @ApiProperty({
    enum: IssuePriority,
    example: IssuePriority.MEDIUM,
    default: IssuePriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
  })
  priority!: IssuePriority;

  @ManyToOne(() => ProjectEntity, (project) => project.issues, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project!: ProjectEntity;

  @ApiProperty({
    example: '8c6a0d12-5e70-4d8e-a2a1-8e8c4d2f1b10',
  })
  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => UserEntity, (user) => user.reportedIssues, {
    nullable: false,
  })
  @JoinColumn({ name: 'reporterId' })
  reporter!: UserEntity;

  @ApiProperty({
    example: '43d7b7b5-9e5f-48d7-8d7f-c33c82db9c51',
  })
  @Column({ type: 'uuid' })
  reporterId!: string;

  @ManyToOne(() => UserEntity, (user) => user.assignedIssues, {
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee!: UserEntity | null;

  @ApiProperty({
    example: '2cb3e4f4-2f59-4f5a-b5a5-3b4b3c4e8f21',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  assigneeId!: string | null;

  @ApiProperty({
    example: '2026-04-25T10:15:30.000Z',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-25T11:45:12.000Z',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}
