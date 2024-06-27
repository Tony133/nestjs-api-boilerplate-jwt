import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

export function configureSwaggerDocs(
  app: INestApplication,
  configService: ConfigService,
) {
  if (
    SWAGGER_ENVS.includes(configService.get<string | undefined>('NODE_ENV'))
  ) {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addServer('http://localhost:3000', 'Local server')
      .addTag('auth')
      .addTag('users')
      .addBearerAuth({
        description: 'Please enter token:',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, documentFactory, {
      explorer: true,
      swaggerOptions: {
        filter: true,
        showRequestDuration: true,
      },
      jsonDocumentUrl: '/docs/json',
      yamlDocumentUrl: '/docs/yaml',
    });
  }
}
