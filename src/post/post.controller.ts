import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.js';
import { PostResponseDto } from './dto/post-response.dto.js';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePostDto,
  ) {
    const post = await this.postService.create(dto, req.user);
    return new PostResponseDto(post);
  }
}