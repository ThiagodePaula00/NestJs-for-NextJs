import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PostModule } from './post/post.module.js';
import { UserModule } from './user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DB_TYPE === 'better-sqlite3') {
          return {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || './db.sqlite',
            synchronize: process.env.DB_SYNCHRONIZE === '1',
            autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
          };
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: process.env.DB_SYNCHRONIZE === '1',
          autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
