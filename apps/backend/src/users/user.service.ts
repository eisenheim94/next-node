import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const existingUser = await this.usersRepository.findOne({
            where: {email: createUserDto.email},
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findOne(id);

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: {email: updateUserDto.email},
            });
            
            if (existingUser) {
                throw new NotFoundException('User with this email already exists');
            }
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        this.usersRepository.remove(user);
    }
}
