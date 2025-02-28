import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export default fp(async (fastify: any) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "default_secret",
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
