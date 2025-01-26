import { NestFastifyApplication } from '@nestjs/platform-fastify';

export async function registerFastifyPlugins(app: NestFastifyApplication) {

  await app.register(require('@fastify/cors'), {
    origin: true || [process.env.ENDPOINT_URL_CORS],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods',
    credentials: true,
  });

  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(require('@fastify/helmet'), {
    crossOriginResourcePolicy: true,
    contentSecurityPolicy: false,
    referrerPolicy: {
      policy: 'same-origin',
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true, // Optional: Include subdomains
      preload: true, // Optional: Indicate to browsers to preload HSTS
    },
    frameguard: {
      action: 'deny',
    },
  });
}
