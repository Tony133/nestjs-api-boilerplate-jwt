import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { IamModule } from './iam/iam.module';
import { validateSchemaEnv } from './helpers/validation-schema-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
      validate: validateSchemaEnv,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL'),
          limit: config.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('TYPEORM_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        synchronize: true,
        entities: [__dirname + '/**/*.{model,entity}.{ts,js}'],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: ['dist/subscriber/**/*.js'],
        cli: {
          migrationsDir: config.get<string>('TYPEORM_MIGRATIONS_DIR'),
          subscribersDir: config.get<string>('TYPEORM_SUBSCRIBERS_DIR'),
        },
      }),
    }),
    IamModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
