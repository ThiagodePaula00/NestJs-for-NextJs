import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
