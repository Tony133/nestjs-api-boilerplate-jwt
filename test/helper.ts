// This file contains code that we reuse between our tests.
import * as test from 'node:test'
import Fastify, { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import serviceApp, { options as appOptions } from '../src/app';
import { MailerService } from '../src/shared/mailer/mailer.service';

declare module 'fastify' {
  interface FastifyInstance {
    mailerService: MailerService;
  }
}

export type TestContext = {
  after: typeof test.after
}

function mockMailerPlugin(fastify: FastifyInstance) {
  // Mock MailerService
  const mockMailer: MailerService = {
    transporter: {} as any,
    sendMail: async (options: any) => {
      return {
        messageId: `mock-${Date.now()}`,
        accepted: [options.to],
        response: '250 Message accepted'
      };
    }
  } as unknown as MailerService;

  fastify.decorate('mailerService', mockMailer);
}

export function config() {
  return {
    ...appOptions,
    skipOverride: true // Register our application with fastify-plugin
  }
}

// Automatically build and tear down our instance
export async function build(t?: TestContext) {
  const app = Fastify();

  app.register(fp(mockMailerPlugin), config());
  app.register(fp(serviceApp), config());
  await app.ready();

  // If we pass the test contest, it will close the app after we are done
  if (t && t.after) {
    t.after(() => app.close());
  }

  return app;
}