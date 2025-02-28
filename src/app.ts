import fastify, { FastifyInstance } from "fastify";
import router from "./router";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import dotenv from "dotenv";
import fastifyMysql from "@fastify/mysql";
import dbConnect from "./plugins/db_conect";
import jwt from "./plugins/jwt";

dotenv.config();
const app: FastifyInstance = fastify({ logger: { level: "info" } });

app.register(fastifyCors, {
  origin: "*",
});

// Register MySQL connection
app.register(dbConnect);
app.register(jwt);
app.register(fastifyFormbody);
app.register(router);

export default app;
