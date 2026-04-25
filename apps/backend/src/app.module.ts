import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssueModule } from './issues/issue.module';
import { ProjectModule } from './projects/project.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getTypeOrmOptions } from './database/typeorm.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const baseOptions = getTypeOrmOptions(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          ...baseOptions,
          autoLoadEntities: true,
          entities: undefined,
          migrations: undefined,
        };
      },
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    IssueModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
