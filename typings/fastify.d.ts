import { FastifyInstance } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    mysql: {
      fastifyBasic: any;
      imNight: any;
    };
    jwt: any;
    authenticate: any;
    ws: any;
  }

  export interface FastifyRequest {
    file: any;
    files: any[];
  }
}
