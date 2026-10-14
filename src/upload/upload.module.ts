import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { uploadsDirectory } from './upload.config.js';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: uploadsDirectory,
      serveRoot: '/uploads',
      serveStaticOptions: {
        fallthrough: false,
        index: false,
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
