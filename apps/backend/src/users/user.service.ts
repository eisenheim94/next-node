import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/core/types';

interface CreateAuthUserInput {
  email: string;
  displayName: string;
  passwordHash: string;
  role: UserRole;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      order: {createdAt: 'DESC'},
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {id},
    });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' was not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({
      where: {email},
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findByEmail(createUserDto.email)

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      
      if (existingUser) {
        throw new NotFoundException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async createFromAuth(input: CreateAuthUserInput): Promise<UserEntity> {
    const user = this.usersRepository.create({
      email: input.email,
      displayName: input.displayName,
      passwordHash: input.passwordHash,
      role: input.role,
      hashedRefreshToken: null,
    });

    return this.usersRepository.save(user);
  }

  async updateRefreshTokenHash(
    userId: string,
    hashedRefreshToken: string
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      hashedRefreshToken,
    });
  }

  async clearRefreshTokenHash(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
