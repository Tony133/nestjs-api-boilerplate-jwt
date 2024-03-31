import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import { configureAuthSwaggerDocs } from './helpers/configure-auth-swagger-docs.helper';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create(AppModule, fastifyAdapter);
  const configService = app.get<ConfigService>(ConfigService);

  await fastifyAdapter.register(require('@fastify/cors'), {
    origin: [configService.get<string>('ENDPOINT_CORS')],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
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

  const port = configService.get<number>('NODE_API_PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  if (configService.get<string>('NODE_ENV') === 'dev') {
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
