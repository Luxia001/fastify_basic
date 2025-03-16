import fp from "fastify-plugin";
import fastifyMysql from "@fastify/mysql";
import dotenv from "dotenv";

dotenv.config();

export default fp(async (fastify) => {
  fastify.register(fastifyMysql, {
    name: "fastifyBasic",
    promise: true,
    connectionString: `mysql://root:12345678@localhost:3306/fastify_basic`,
  });

  // fastify.register(fastifyMysql, {
  //   name: "imNight",
  //   promise: true,
  //   connectionString: `mysql://root:12345678@localhost:3306/im_night`,
  // });
});
