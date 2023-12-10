import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

export function configureSwaggerDocs(
  app: INestApplication,
  configService: ConfigService,
) {
  if (SWAGGER_ENVS.includes(configService.get<string>('NODE_ENV'))) {
    app.use(
      ['/docs', '/docs-json', '/docs-yaml'],
      basicAuth({
        challenge: true,
        users: {
          [configService.get<string>('SWAGGER_USER')]:
            configService.get<string>('SWAGGER_PASSWORD'),
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth')
      .addTag('users')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, documentFactory);
  }
}
