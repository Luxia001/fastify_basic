import fastify, { FastifyInstance } from "fastify";
import router from "./router";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import dotenv from "dotenv";
import fastifyMysql from "@fastify/mysql";
import dbConnect from "./plugins/db_conect";
import jwt from "./plugins/jwt";
import path from "path";

const multer = require("fastify-multer");

dotenv.config();
const app: FastifyInstance = fastify({ logger: { level: "info" } });

app.register(fastifyCors, {
  origin: "*",
});

// Register MySQL connection
app.register(dbConnect);

app.register(multer.contentParser);
app.register(jwt);
app.register(fastifyFormbody);
app.register(router);
app.register(require("./plugins/ws"));
app.register(require("./plugins/io"), {});

// import fastifyView from "@fastify/view";

// app.register(fastifyView, {
//   engine: {
//     ejs: require("ejs"),
//   },
//   root: path.join(__dirname, "../views"),
// });

app.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public"),
});

export default app;
