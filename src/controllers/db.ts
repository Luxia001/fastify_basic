import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";

export default async function dbRoute(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const connection = await fastify.mysql.fastifyBasic.getConnection();

      const [rows] = await connection.query("SELECT * FROM users");
      return { data: rows };
    }
  );

  fastify.get(
    "/imnight",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const connection = await fastify.mysql.imNight.getConnection();
      const [rows] = await connection.query("SELECT * FROM menu");
      return { data: rows };
    }
  );

  fastify.post(
    "/register",
    {
      schema: {
        headers: {},
        params: {},
        query: {},
        body: {
          type: "object",
          required: ["fristName", "lastName", "username", "password"],
          properties: {
            fristName: { type: "string" },
            lastName: { type: "string" },
            username: { type: "string", maxLength: 20 },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { fristName, lastName, username, password } = request.body as any;
      const connection = await fastify.mysql.fastifyBasic.getConnection();

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query =
        "INSERT INTO users (frist_name,last_name,username, password) VALUES (?, ?, ?, ?)";
      await connection.query(query, [
        fristName,
        lastName,
        username,
        hashedPassword,
      ]);
      return { data: "register success" };
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        headers: {},
        params: {},
        query: {},
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", maxLength: 20 },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, password } = request.body as any;
      const connection = await fastify.mysql.fastifyBasic.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return { data: "user not found" };
      }
      const isPasswordMatch = await bcrypt.compare(password, rows[0].password);
      if (!isPasswordMatch) {
        return { data: "password not match" };
      }
      return { data: "login success" };
    }
  );

  fastify.put(
    "/updateUser",
    {
      schema: {
        headers: {},
        params: {},
        query: {},
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
            fristName: { type: "string" },
            lastName: { type: "string" },
            username: { type: "string", maxLength: 20 },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id, fristName, lastName, username, password } =
        request.body as any;
      const connection = await fastify.mysql.fastifyBasic.getConnection();
      const query =
        "UPDATE users SET frist_name = ?, last_name = ?,username=?,password=? WHERE id = ?";
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await connection.query(query, [
        fristName,
        lastName,
        username,
        hashedPassword,
        id,
      ]);
      return { data: "update success" };
    }
  );

  fastify.delete(
    "/deleteUser/:id",
    {
      schema: {
        headers: {},
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
        query: {},
        body: {},
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as any;
      const connection = await fastify.mysql.fastifyBasic.getConnection();
      const query = "DELETE FROM users WHERE id = ?";
      await connection.query(query, [id]);
      return { data: "delete success" };
    }
  );
}
