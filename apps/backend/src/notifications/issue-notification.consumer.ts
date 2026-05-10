import { Injectable, OnModuleInit } from '@nestjs/common';

import { IssueDomainEvent } from 'src/messaging/contracts/issue-events';
import {
  ISSUE_NOTIFICATION_QUEUE,
  IssueEventPattern,
} from 'src/messaging/rabbitmq.constants';
import { RabbitMqService } from 'src/messaging/rabbitmq.service';

import { NotificationService } from './notification.service';

@Injectable()
export class IssueNotificationConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMqService.consume(
      ISSUE_NOTIFICATION_QUEUE,
      [
        IssueEventPattern.ISSUE_CREATED,
        IssueEventPattern.ISSUE_STATUS_CHANGED,
      ],
      (event) => this.handleEvent(event),
    );
  }

  private async handleEvent(event: IssueDomainEvent): Promise<void> {
    await this.notificationService.createForIssueEvent(event);
  }
}
