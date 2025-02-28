import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import indexRoute from "./controllers/index";
import demoRoute from "./controllers/demo";
import schemaRoute from "./controllers/schema";
import dbRoute from "./controllers/db";

export default async function router(fastify: FastifyInstance) {
  fastify.register(indexRoute, { prefix: "/" });
  fastify.register(demoRoute, { prefix: "/demo" });
  fastify.register(schemaRoute, { prefix: "/schema" });
  fastify.register(dbRoute, { prefix: "/db" });
  fastify.setErrorHandler(
    (error, request: FastifyRequest, reply: FastifyReply) => {
      console.error(error);
      reply
        .status(500)
        .send({ error: "Internal Server Error", message: error.message });
    }
  );
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({ error: "Not Found" });
  });
}
