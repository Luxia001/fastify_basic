import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function schemaRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { data: "schemaRoute ready" };
  });

  fastify.post(
    "/regitser",
    {
      schema: {
        headers: {},
        params: {},
        query: {},
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            email: { type: "string", format: "email" },
            username: { type: "string", maxLength: 20 },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { data: "register" };
    }
  );

  fastify.get(
    "/info/:id",
    {
      schema: {
        headers: {
          type: "object",
          required: ["authorization"],
          properties: {
            "x-fastyfy-token": { type: "string" },
            authorization: { type: "string" },
          },
        },
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", pattern: "^[0-9]{4}$" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      return { data: id };
    }
  );
}
