import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe.pipe.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    return `olá do controller do user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}