import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { fileFilter, limits, storage } from './upload.config.js';
import { UploadService } from './upload.service.js';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage, limits, fileFilter }))
  uploadFile(@UploadedFile() file: Express.Multer.File | undefined) {
    return this.uploadService.handleUpload(file);
  }
}
