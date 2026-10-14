import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { createSlugFromText } from '../common/utils/create-slug-from-text.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Post } from './entities/post.entity.js';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOne(postData: Partial<Post>) {
    return this.postRepository.findOne({
      where: postData,
      relations: { author: true },
    });
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    return this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: { author: true },
    });
  }

  async findAllOwned(author: User) {
    return this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: { author: true },
    });
  }

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      author,
      content: dto.content,
      excerpt: dto.excerpt,
      coverImageUrl: dto.coverImageUrl,
      title: dto.title,
    });

    try {
      return await this.postRepository.save(post);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('Erro ao criar post', err.stack);
      } else {
        this.logger.error('Erro ao criar post com uma exceção não identificada');
      }

      throw new BadRequestException('Erro ao criar o post');
    }
  }
}