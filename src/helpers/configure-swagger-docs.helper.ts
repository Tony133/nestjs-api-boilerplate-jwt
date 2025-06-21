import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwaggerDocs(app: INestApplication) {
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addServer('http://localhost:3000', 'Local server')
      .addTag('auth')
      .addTag('users')
      .addTag('app')
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
      customfavIcon: '/favicon.ico',
      customSiteTitle: 'API Documentation',
      customCss: `
        .swagger-ui svg {
          content: url('/favicon.ico');
        }
        // .swagger-ui .topbar {
        // }
        // .swagger-ui .scheme-container { display: block; }
        // .swagger-ui .information-container { display: none; }
        // .swagger-ui .opblock-tag { background-color: #f8f9fa; }
        // .swagger-ui .opblock-tag:hover { background-color: #e9ecef; }
        // .swagger-ui .opblock-summary { background-color: #f1f3f5; }
        // .swagger-ui .opblock-summary:hover { background-color: #e9ecef; }
        // .swagger-ui .opblock-summary-method { color: #495057; }
        // .swagger-ui .opblock-summary-path { color: #6c757d; }
        // .swagger-ui .opblock-description { color: #343a40; }
        // .swagger-ui .opblock-body { background-color: #ffffff; }
        // .swagger-ui .opblock-body pre { background-color: #f8f9fa; }
        // .swagger-ui .opblock-body code { color: #212529; }
        // .swagger-ui .opblock-body .parameters { border: 1px solid #ced4da; }
        // .swagger-ui .opblock-body .responses { border: 1px solid #ced4da; }
        // .swagger-ui .opblock-body .response { background-color: #ffffff; }
        // .swagger-ui .opblock-body .response pre { background-color: #f8f9fa; }
        // .swagger-ui .opblock-body .response code { color: #212529; }
      `,
      swaggerOptions: {
        filter: true,
        showRequestDuration: true,
      },
      jsonDocumentUrl: '/docs/json',
      yamlDocumentUrl: '/docs/yaml',
    });
  }
}
