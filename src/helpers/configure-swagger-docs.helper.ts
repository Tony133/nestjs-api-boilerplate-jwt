import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwaggerDocs(app: INestApplication) {
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addServer('http://localhost:3000', 'Local server')
      .addTag('auth', 'API by authentication')
      .addTag('users', 'API by users management')
      .addTag('app', 'API of example ( resources protected and public ) ')
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
