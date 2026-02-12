import { join } from 'node:path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import {
  FastifyError,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions
} from 'fastify';

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

// Centralized configuration
export const options: AppOptions = {
  bodyLimit: 1048576 * 50,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      }
    },
    transport:
      process.env.LOG_LEVEL === 'debug'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
              ignore: 'pid,hostname',
              colorize: true
            }
          }
        : undefined
  },
  ajv: {
    customOptions: {
      removeAdditional: 'all'
    }
  }
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  
  // Centralized error handling
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const statusCode = error.statusCode ?? 500;
    request.log.error({ err: error });

    const response = {
      statusCode,
      error:
        error.code ??
        (statusCode >= 500 ? 'Internal Server Error' : 'Bad Request'),
      message:
        statusCode >= 500 && process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : error.message,
      ...(error.validation ? { details: error.validation } : {})
    };

    return reply.status(statusCode).send(response);
  });

  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  });

  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'modules'),
    options: { ...opts, prefix: '/api' },
    encapsulate: true,
    maxDepth: 2,
    indexPattern: /.*plugin\.ts$/,
    ignorePattern: /.*\.(schema|service|routes)\.ts$/
  });

};

export default app;
export { app };
