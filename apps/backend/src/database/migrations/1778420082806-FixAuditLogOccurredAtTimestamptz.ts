import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAuditLogOccurredAtTimestamptz1778420082806 implements MigrationInterface {
  name = 'FixAuditLogOccurredAtTimestamptz1778420082806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "occurredAt"
      TYPE TIMESTAMP WITH TIME ZONE
      USING "occurredAt" AT TIME ZONE 'UTC'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "occurredAt"
      TYPE TIMESTAMP WITHOUT TIME ZONE
      USING "occurredAt" AT TIME ZONE 'UTC'
    `);
  }
}
