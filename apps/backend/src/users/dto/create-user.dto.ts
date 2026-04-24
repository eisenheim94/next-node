import { IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';

import { UserRole } from '../../core/types';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(120)
  displayName!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}