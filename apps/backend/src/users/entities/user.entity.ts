import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../core/types';
import { IssueEntity } from '../../issues/entities/issue.entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 120 })
  displayName!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hashedRefreshToken!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role!: UserRole;

  @OneToMany(() => IssueEntity, (issue) => issue.reporter)
  reportedIssues!: IssueEntity[];

  @OneToMany(() => IssueEntity, (issue) => issue.assignee)
  assignedIssues!: IssueEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments!: CommentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
