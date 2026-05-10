import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from 'src/messaging/messaging.module';

import { NotificationEntity } from './entities/notification.entity';
import { IssueNotificationConsumer } from './issue-notification.consumer';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), MessagingModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    IssueNotificationConsumer,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
