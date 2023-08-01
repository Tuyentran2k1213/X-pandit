import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FilterUser, UserIdsDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JWTAuthGuard } from 'src/utils';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() filter: FilterUser): Promise<User[]> {
    return this.userService.findAll(filter);
  }

  @Get('deleted')
  getDeleted(): Promise<User[]> {
    return this.userService.getDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('softDelete')
  delete(@Body() body: UserIdsDto): Promise<string> {
    return this.userService.delete(body);
  }

  @Patch('restore')
  restore(@Body() body: UserIdsDto) {
    return this.userService.restore(body);
  }

  @Delete('hardDelete')
  remove(@Body() body: UserIdsDto): Promise<string> {
    return this.userService.remove(body);
  }
}
