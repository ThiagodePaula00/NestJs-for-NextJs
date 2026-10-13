import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { CommonModule } from '../common/common.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    UserModule,
    CommonModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = Number(
          configService.get('JWT_EXPIRATION', 86400),
        );

        if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
          throw new InternalServerErrorException(
            'JWT_EXPIRATION must be a positive number of seconds',
          );
        }

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}