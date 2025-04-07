// plugins/io.ts
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Server as SocketIOServer, Socket } from "socket.io";

export default fp(async (fastify: FastifyInstance) => {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*", // ปรับตามต้องการ
    },
  });

  // ผูก socket.io เข้ากับ fastify instance
  fastify.decorate("io", io);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // ตัวอย่าง: รับข้อความจาก client
    socket.on("chat message", (msg) => {
      console.log("📩 Chat message:", msg);

      // ส่งกลับไปยังทุก client ที่เชื่อมต่อ
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
});
