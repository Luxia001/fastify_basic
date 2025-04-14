import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function demoRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { data: "demo ready" };
  });

  fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { data: [{ data1: "demo post ready" }] };
  });

  fastify.post(
    "/params",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, password }: any = request.query;
      return {
        data: { username: username, password: password },
      };
    }
  );

  fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: any = request.params;
    return { data: { id: id } };
  });

  fastify.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: any = request.body;
    return { data: { id: id } };
  });

  fastify.delete(
    "/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      return { data: { id: id }, message: "deleted" };
    }
  );

  fastify.get(
    "/views/demo.ejs",
    {},
    async (request: FastifyRequest, reply: FastifyReply) => {
      const name = "API EJS";
      reply.view("/views/demo.ejs", { name });
    }
  );
}
