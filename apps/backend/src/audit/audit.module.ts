import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from 'src/messaging/messaging.module';

import { AuditController } from './audit.controller';
import { IssueAuditConsumer } from './issue-audit.consumer';
import { AuditService } from './audit.service';
import { AuditLogEntity } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity]), MessagingModule],
  controllers: [AuditController],
  providers: [AuditService, IssueAuditConsumer],
  exports: [AuditService],
})
export class AuditModule {}
