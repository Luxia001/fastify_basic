import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import multer from "fastify-multer";
import path from "path";

export default async function uploadRoute(fastify: FastifyInstance) {
  await fastify.register(import("@fastify/multipart"));

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const _ext = path.extname(file.originalname);
      const filename = `${Date.now()}${_ext}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { data: "upload ready" };
  });

  fastify.post(
    "/file",
    {
      preHandler: upload.single("file"),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const file = request.file as any;
      return { data: file };
    }
  );
}
