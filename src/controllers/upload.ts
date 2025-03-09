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
  const uploadFix = multer({
    storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype !== "image/*") {
        return cb(new Error("Only PNG files are allowed"), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

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

  fastify.post(
    "/files",
    {
      preHandler: upload.array("file", 4),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const files = request.files as any;
      return { data: files };
    }
  );
  fastify.post(
    "/fileFix",
    {
      preHandler: uploadFix.single("file"),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const file = request.file as any;
      return { data: file };
    }
  );
}
