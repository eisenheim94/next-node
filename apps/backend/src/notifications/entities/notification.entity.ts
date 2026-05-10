import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/users/entities/user.entity';
import { IssueEntity } from '../../issues/entities/issue.entity';

@Entity({ name: 'notifications' })
@Index(['sourceEventId', 'recipientId'], { unique: true })
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  sourceEventId!: string;

  @Column({ type: 'varchar', length: 100 })
  eventType!: string;

  @Column({ type: 'uuid' })
  issueId!: string;

  @Column({ type: 'uuid' })
  recipientId!: string;

  @ManyToOne(() => IssueEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue!: IssueEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient!: UserEntity;

  @Column({ type: 'varchar', length: 225 })
  message!: string;

  @Column({ type: 'timestamptz', nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
