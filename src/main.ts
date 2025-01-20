import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import { configureAuthSwaggerDocs } from './helpers/configure-auth-swagger-docs.helper';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app =
    await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  const configService = app.get<ConfigService>(ConfigService);

  await fastifyAdapter.register(require('@fastify/cors'), {
    origin: true || [configService.get<string>('ENDPOINT_URL_CORS')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods',
    credentials: true,
  });

  await fastifyAdapter.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

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

  configureAuthSwaggerDocs(app, configService);
  configureSwaggerDocs(app, configService);

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
