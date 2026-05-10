import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditLogs1777905278132 implements MigrationInterface {
    name = 'AddAuditLogs1777905278132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventId" character varying(100) NOT NULL, "eventType" character varying(100) NOT NULL, "issueId" uuid NOT NULL, "occurredAt" TIMESTAMP NOT NULL, "payload" jsonb NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f953f2cb581d00109a05741e13f" UNIQUE ("eventId"), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
