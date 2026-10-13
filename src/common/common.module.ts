import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service.js';
import { BcryptHashingService } from './hashing/bcrypt-hashing.service.js';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [HashingService],
})
export class CommonModule {}