import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IssueDomainEvent } from 'src/messaging/contracts/issue-events';

import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import { AuditLogEntity } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor (
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async record(event: IssueDomainEvent): Promise<AuditLogResponseDto> {
    const existingAuditLog = await this.auditLogRepository.findOne({
      where: { eventId: event.eventId },
    });

    if (existingAuditLog) {
      return this.mapToResponse(existingAuditLog);
    }

    const auditLog = this.auditLogRepository.create({
      eventId: event.eventId,
      eventType: event.pattern,
      issueId: event.payload.issueId,
      occurredAt: new Date(event.occurredAt),
      payload: event.payload as unknown as Record<string, unknown>,
    });

    const savedAuditLog = await this.auditLogRepository.save(auditLog);

    return this.mapToResponse(savedAuditLog);
  }

  async findAll(): Promise<AuditLogResponseDto[]> {
    const auditLogs = await this.auditLogRepository.find({
      order: {
        processedAt: 'DESC',
      },
    });

    return auditLogs.map((log) => this.mapToResponse(log));
  }

  private mapToResponse(log: AuditLogEntity): AuditLogResponseDto {
    return {
      id: log.id,
      eventId: log.eventId,
      eventType: log.eventType,
      issueId: log.issueId,
      occurredAt: log.occurredAt,
      payload: log.payload,
      processedAt: log.processedAt,
    };
  }
}
