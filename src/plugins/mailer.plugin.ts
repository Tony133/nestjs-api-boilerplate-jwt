import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { MailerService } from '../shared/mailer/mailer.service';

async function mailerPlugin(fastify: FastifyInstance) {
  const { config } = fastify;

  const emailConfig = {
    host: config.EMAIL_TEST_HOST || config.EMAIL_HOST,
    port: config.EMAIL_TEST_PORT || config.EMAIL_PORT,
    secure: config.EMAIL_TEST_SECURE ?? config.EMAIL_SECURE,
    auth: {
      user: config.EMAIL_TEST_AUTH_USER || config.EMAIL_AUTH_USER,
      pass: config.EMAIL_TEST_AUTH_PASSWORD || config.EMAIL_AUTH_PASSWORD
    },
    from: {
      name: config.EMAIL_TEST_FROM_NAME || config.EMAIL_FROM_NAME,
      email: config.EMAIL_TEST_FROM_EMAIL || config.EMAIL_FROM_EMAIL
    },
    logger: config.EMAIL_TEST_LOGGER ?? config.EMAIL_LOGGER,
    debug: config.EMAIL_TEST_DEBUG ?? config.EMAIL_DEBUG
  };

  const mailerService = new MailerService(emailConfig);
  fastify.decorate('mailerService', mailerService);
}

export default fp(mailerPlugin, {
  name: 'mailer',
  dependencies: ['config']
});
