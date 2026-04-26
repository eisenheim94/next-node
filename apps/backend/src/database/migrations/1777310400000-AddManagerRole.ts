import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManagerRole1777310400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS \'MANAGER\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE "users" SET "role" = \'ADMIN\' WHERE "role" = \'MANAGER\'',
    );
    await queryRunner.query(
      'ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."users_role_enum" AS ENUM(\'ADMIN\', \'MEMBER\')',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::text::"public"."users_role_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'MEMBER\'',
    );
    await queryRunner.query(
      'DROP TYPE "public"."users_role_enum_old"',
    );
  }
}
