import { FastifyInstance } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    mysql: {
      fastifyBasic: any;
      imNight: any;
    };
    jwt: any;
    authenticate: any;
  }

  export interface FastifyRequest {
    file: any;
    files: any[];
  }
}
