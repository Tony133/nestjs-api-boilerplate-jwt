import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";

async function jwtPlugin(fastify: FastifyInstance) {
  const secretKey = process.env.SECRET_KEY_JWT;

  if (!secretKey) {
    fastify.log.error("SECRET_KEY_JWT is required");
    throw new Error("SECRET_KEY_JWT is required");
  }

  await fastify.register(fastifyJwt, {
    secret: secretKey
  });
}

export default fp(jwtPlugin, {
  name: 'fastify-jwt'
});
