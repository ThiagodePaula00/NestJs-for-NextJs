import { Logger, Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AuthModule } from './auth/auth.module.js';
import { PostModule } from './post/post.module.js';
import { UserModule } from './user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const configModule = ConfigModule.forRoot({
  isGlobal: true,
});
const observeAppKey = process.env.OBSERVE_APP_KEY;
const observeAppSecret = process.env.OBSERVE_APP_SECRET;
const observeModule =
  observeAppKey && observeAppSecret
    ? ObserveModule.forRoot({
        appKey: observeAppKey,
        appSecret: observeAppSecret,
        serviceId: process.env.OBSERVE_SERVICE_ID || 'nest-js-for-next-js',
      })
    : undefined;

if (!observeModule) {
  new Logger('AppModule').log(
    'Observability disabled: OBSERVE_APP_KEY and OBSERVE_APP_SECRET are not both configured',
  );
}

@Module({
  imports: [
    ...(observeModule ? [observeModule] : []),
    AuthModule,
    UserModule,
    PostModule,
    UploadModule,
    configModule,
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
})
export class AppModule {}
