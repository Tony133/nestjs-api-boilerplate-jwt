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

  await app.register(require('@fastify/under-pressure'), {
    maxHeapUsedBytes: 150 * 1024 * 1024, // Memory limit (150 MB)
    maxEventLoopDelay: 100, // Event loop delay limit in ms
    maxRssBytes: 200 * 1024 * 1024, // RSS limit (200 MB)
    dropConnection: true, // If `true`, the server will reject excess connections
    retryAfter: 30, // Delay in seconds to retry connecting
    responseServerError: 'true', // Set 503 response
  });
}
