import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { data: "fastify ready" };
  });
}
