import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  const webSocketServer = require("ws").Server;
  const wsOptions: any = {
    server: fastify.server,
    path: "/ws",
  };

  const wss = new webSocketServer(wsOptions);

  fastify.decorate("ws", wss);

  wss.on("connection", (ws: any) => {
    console.log("connectioned");
    ws.on("message", (message: any) => {
      wss.clients.forEach((client: any) => {
        if (client.readyState === 1) {
          client.send("hi from wildcard route : " + message);
        }
      });
    });
  });

  fastify.addHook("onClose", (instance, done) => {
    wss.close(done);
    done();
  });
});
