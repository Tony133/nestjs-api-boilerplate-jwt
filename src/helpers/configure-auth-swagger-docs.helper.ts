import { INestApplication } from '@nestjs/common';

export function configureAuthSwaggerDocs(app: INestApplication) {
  const apiDocumentationCredentials = {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  };

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use('/docs', (req: any, res: any, next: () => void) => {
    function parseAuthHeader(input: string): {
      user: string;
      password: string;
    } {
      const [, encodedPart] = input.split(' ');
      const buff = Buffer.from(encodedPart, 'base64');
      const text = buff.toString('ascii');
      const [user, password] = text.split(':');
      return { user, password };
    }

    function unauthorizedResponse(): void {
      if (httpAdapter.getType() === 'fastify') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
      }
      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.user !== apiDocumentationCredentials.user ||
      credentials?.password !== apiDocumentationCredentials.password
    ) {
      return unauthorizedResponse();
    }

    next();
  });
}
