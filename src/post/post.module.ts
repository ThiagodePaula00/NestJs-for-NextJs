import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller.js';
import { Post } from './entities/post.entity.js';
import { PostService } from './post.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}