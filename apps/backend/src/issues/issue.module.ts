import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from '../projects/entities/project.entity';
import { UserEntity } from '../users/entities/user.entity';
import { IssueEntity } from './entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IssueEntity,
      ProjectEntity,
      UserEntity,
    ]),
    MessagingModule,
  ],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
