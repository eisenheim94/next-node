import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { UserRole } from '../../core/types';

export class RegisterDto {
  @ApiProperty({ example: 'foo@bar.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Foo Bar' })
  @IsString()
  @MinLength(2)
  displayName!: string;

  @ApiProperty({ example: 'foobar123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.MEMBER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}