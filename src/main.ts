import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import { configureAuthSwaggerDocs } from './helpers/configure-auth-swagger-docs.helper';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { registerFastifyPlugins } from './common/plugins/register-fastify.plugins';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: new ConsoleLogger({
        json: true,
        colors: true,
      }),
    },
  );
  const configService = app.get<ConfigService>(ConfigService);

  // Plugins for Fastify
  registerFastifyPlugins(app);
  // Swagger Configurations
  configureAuthSwaggerDocs(app, configService);
  configureSwaggerDocs(app, configService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get<number>('SERVER_PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  if (configService.get<string>('NODE_ENV') !== 'production') {
    Logger.debug(
      `${await app.getUrl()} - Environment: ${configService.get<string>(
        'NODE_ENV',
      )}`,
      'Environment',
    );

    Logger.debug(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
  }
}
bootstrap();
