import { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    mysql: {
      fastifyBasic: any;
      imNight: any;
    };
    jwt: any;
    authenticate: any;
    ws: any;
    io: any;
  }

  export interface FastifyRequest {
    file: any;
    files: any[];
  }

  interface FastifyReply {
    view: any;
  }
}
