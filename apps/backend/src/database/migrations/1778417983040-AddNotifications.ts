import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotifications1778417983040 implements MigrationInterface {
    name = 'AddNotifications1778417983040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sourceEventId" character varying(100) NOT NULL, "eventType" character varying(100) NOT NULL, "issueId" uuid NOT NULL, "recipientId" uuid NOT NULL, "message" character varying(225) NOT NULL, "readAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3b80113c6637066c2790d45592" ON "notifications" ("sourceEventId", "recipientId") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_db873ba9a123711a4bff527ccd5" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_db873ba9a123711a4bff527ccd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b80113c6637066c2790d45592"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
