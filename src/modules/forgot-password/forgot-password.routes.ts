import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ForgotPasswordBody, forgotPasswordSchema } from './forgot-password.schemas';
import { FastifyInstance } from 'fastify';

const forgotPasswordRoutes: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.post<{ Body: ForgotPasswordBody }>(
    '/',
    { schema: forgotPasswordSchema },
    async function (request, reply) {
      return await fastify.forgotPasswordService.forgotPassword(request.body);
    }
  );
};

export default forgotPasswordRoutes;