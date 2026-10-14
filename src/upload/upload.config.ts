import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const storage = memoryStorage();

export const fileFilter = (
  _request: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new BadRequestException('Somente imagens são permitidas!'), false);
    return;
  }

  callback(null, true);
};

export const limits = {
  fileSize: 900 * 1024,
  files: 1,
};

export const uploadsDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'uploads',
);
