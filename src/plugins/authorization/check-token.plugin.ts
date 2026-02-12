import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function checkTokenPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "checkToken",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        fastify.log.error(err);
        reply.send(err);
      }
    }
  );
}

export default fp(checkTokenPlugin, {
  name: 'check-token',
});
