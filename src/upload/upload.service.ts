import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { uploadsDirectory } from './upload.config.js';

const supportedImageTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class UploadService {
  async handleUpload(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const maxFileSize = 900 * 1024;
    if (file.size > maxFileSize) {
      throw new BadRequestException('Arquivo muito grande');
    }

    const fileType = await fileTypeFromBuffer(file.buffer);
    if (!fileType || !supportedImageTypes.has(fileType.mime)) {
      throw new BadRequestException('Arquivo inválido ou tipo não permitido.');
    }

    const today = new Date().toISOString().slice(0, 10);
    const uploadPath = resolve(uploadsDirectory, today);
    const fileName = `${Date.now()}-${randomUUID()}.${fileType.ext}`;
    const fileFullPath = resolve(uploadPath, fileName);

    await mkdir(uploadPath, { recursive: true });
    await writeFile(fileFullPath, file.buffer, { flag: 'wx' });

    return {
      url: `/uploads/${today}/${fileName}`,
    };
  }
}
