import { Body, Controller, Post, Get, Patch, Delete, Param } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({type: UserEntity})
    create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({type: UserEntity, isArray: true})
    findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({type: UserEntity})
    findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ApiOkResponse({type: UserEntity})
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOkResponse({type: UserEntity})
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }
}
