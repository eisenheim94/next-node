import { Injectable, OnModuleInit } from '@nestjs/common';

import { IssueDomainEvent } from 'src/messaging/contracts/issue-events';
import { RabbitMqService } from 'src/messaging/rabbitmq.service';
import {
  ISSUE_AUDIT_QUEUE,
  IssueEventPattern,
} from 'src/messaging/rabbitmq.constants';

import { AuditService } from './audit.service';

@Injectable()
export class IssueAuditConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly auditService: AuditService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMqService.consume(
      ISSUE_AUDIT_QUEUE,
      [
        IssueEventPattern.ISSUE_CREATED,
        IssueEventPattern.ISSUE_STATUS_CHANGED,
      ],
      (event) => this.handleEvent(event),
    );
  }

  private async handleEvent(event: IssueDomainEvent): Promise<void> {
    await this.auditService.record(event);
  }
}
