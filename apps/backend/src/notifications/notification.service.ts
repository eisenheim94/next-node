import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IssueDomainEvent } from 'src/messaging/contracts/issue-events';
import { IssueEventPattern } from 'src/messaging/rabbitmq.constants';

import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async createForIssueEvent(event: IssueDomainEvent): Promise<void> {
    const recipientIds = this.getRecipientIds(event);

    for (const recipientId of recipientIds) {
      const existingNotification = await this.notificationRepository.findOne({
        where: {
          sourceEventId: event.eventId,
          recipientId,
        },
      });

      if (existingNotification) {
        continue;
      }

      const notification = this.notificationRepository.create({
        sourceEventId: event.eventId,
        eventType: event.pattern,
        issueId: event.payload.issueId,
        recipientId,
        message: this.buildMessage(event),
        readAt: null,
      });

      await this.notificationRepository.save(notification);
    }
  }

  async findForUser(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find({
      where: {
        recipientId: userId,
      },
      relations: {
        recipient: true,
        issue: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return notifications.map((notifications) => this.mapToResponse(notifications));
  }

  private getRecipientIds(event: IssueDomainEvent): string[] {
    const recipientIds = new Set<string>();

    if (event.payload.assigneeId) {
      recipientIds.add(event.payload.assigneeId);
    }

    if (event.pattern === IssueEventPattern.ISSUE_STATUS_CHANGED) {
      recipientIds.add(event.payload.reporterId);
    }

    return [...recipientIds];
  }

  private buildMessage(event: IssueDomainEvent): string {
    if (event.pattern === IssueEventPattern.ISSUE_CREATED) {
      return `Issue "${event.payload.title}" was created.`;
    }

    return `Issue "${event.payload.title}" moved from ${event.payload.previousStatus} to ${event.payload.currentStatus}`;
  }

  private mapToResponse(notification: NotificationEntity): NotificationResponseDto {
    return {
      id: notification.id,
      sourceEventId: notification.sourceEventId,
      eventType: notification.eventType,
      issue: {
        id: notification.issue.id,
        title: notification.issue.title,
        status: notification.issue.status,
        priority: notification.issue.priority,
      },
      recipient: {
        id: notification.recipient.id,
        email: notification.recipient.email,
        displayName: notification.recipient.displayName,
        role: notification.recipient.role,
      },
      message: notification.message,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
