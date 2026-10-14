import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Post } from './entities/post.entity.js';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: `post-${Math.random().toString(36).substring(2, 8)}`,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      author,
    });

    return this.postRepository.save(post);
  }
}