import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';

import { IssueDomainEvent } from './contracts/issue-events';
import {
  IssueEventPattern,
  RABBITMQ_EXCHANGE,
  RABBITMQ_EXCHANGE_TYPE,
} from './rabbitmq.constants';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);

  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private  readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.ensureChannel();
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();

    this.channel = null;
    this.connection = null;
  }

  async publish(
    routingKey: IssueEventPattern,
    event: IssueDomainEvent,
  ): Promise<void> {
    const channel = await this.ensureChannel();

    await channel.assertExchange(RABBITMQ_EXCHANGE, RABBITMQ_EXCHANGE_TYPE, {
      durable: true,
    });

    channel.publish(
      RABBITMQ_EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
        contentType: 'application/json',
        messageId: event.eventId,
        timestamp: Date.now(),
      },
    );
  }

  async consume(
    queueName: string,
    routingKeys: IssueEventPattern[],
    handler: (event: IssueDomainEvent) => Promise<void>,
  ): Promise<void> {
    const channel = await this.ensureChannel();

    await channel.assertExchange(RABBITMQ_EXCHANGE, RABBITMQ_EXCHANGE_TYPE, {
      durable: true,
    });

    await channel.assertQueue(queueName, {
      durable: true,
    });

    for (const routingKey of routingKeys) {
      await channel.bindQueue(queueName, RABBITMQ_EXCHANGE, routingKey);
    }

    await channel.prefetch(10);

    await channel.consume(queueName, (message) => {
      if (!message) {
        return;
      }

      void this.handleMessage(channel, message, handler);
    });
  }

  private async handleMessage(
    channel: Channel,
    message: ConsumeMessage,
    handler: (event: IssueDomainEvent) => Promise<void>,
  ): Promise<void> {
    try {
      const event = JSON.parse(message.content.toString()) as IssueDomainEvent;

      await handler(event);
      channel.ack(message);
    } catch (error) {
      this.logger.error('Failed to process RabbitMQ message', error);
      channel.nack(message, false, false);
    }
  }

  private async ensureChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }

    const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@localhost:5672';

    this.connection = await connect(rabbitMqUrl);
    this.channel = await this.connection.createChannel();

    return this.channel;
  }
}
