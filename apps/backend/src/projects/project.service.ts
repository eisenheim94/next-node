import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly projectsRepository: Repository<ProjectEntity>,
    ) {}

    async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
        const project = this.projectsRepository.create({
            name: createProjectDto.name,
            description: createProjectDto.description ?? null,
        });

        return this.projectsRepository.save(project);
    }

    async findAll(): Promise<ProjectEntity[]> {
        return this.projectsRepository.find({
            order: {createdAt: 'DESC'},
        });
    }

    async findOne(id: string): Promise<ProjectEntity> {
        const project = await this.projectsRepository.findOne({
            where: {id},
        });

        if (!project) {
            throw new NotFoundException(`Project with id "${id}" was not found`);
        }

        return project
    }

    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
        const project = await this.findOne(id);

        if (updateProjectDto.name !== undefined) {
            project.name = updateProjectDto.name;
        }

        if (updateProjectDto.description !== undefined) {
            project.description = updateProjectDto.description;
        }

        return this.projectsRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const project = await this.findOne(id);
        await this.projectsRepository.remove(project);
    }
}
