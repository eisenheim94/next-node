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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.BACKLOG,
  })
  status!: IssueStatus;

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

  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => UserEntity, (user) => user.reportedIssues, {
    nullable: false,
  })
  @JoinColumn({ name: 'reporterId' })
  reporter!: UserEntity;

  @Column({ type: 'uuid' })
  reporterId!: string;

  @ManyToOne(() => UserEntity, (user) => user.assignedIssues, {
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee!: UserEntity | null;

  @Column({ type: 'uuid', nullable: true })
  assigneeId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
