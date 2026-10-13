import { Controller, Get, Param } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe.pipe.js';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    return `olá do controller do user #${id}`;
  }
}