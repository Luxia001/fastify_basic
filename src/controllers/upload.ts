import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import multer from "fastify-multer";
import path from "path";
import fs from "fs";

const mime = require("mime-types");

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

      const { originalname, filename, mimetype, size } = file;
      const connection = await fastify.mysql.fastifyBasic.getConnection();

      const query = `
        INSERT INTO files (file_origianalname, file_name, mimetype, size, file_path) 
        VALUES (?, ?, ?, ?, ?)`;
      await connection.query(query, [
        originalname,
        filename,
        mimetype,
        size,
        "http://127.0.0.1:8000/uploads/" + filename,
      ]);
      return reply.send({
        message: "File uploaded successfully",
        data: file,
      });
    }
  );

  fastify.post(
    "/files",
    {
      preHandler: upload.array("file", 4),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const files = request.files as any;
      const connection = await fastify.mysql.fastifyBasic.getConnection();

      const query = `
        INSERT INTO files (file_origianalname, file_name, mimetype, size, file_path) 
        VALUES (?, ?, ?, ?, ?)`;
      const insertedFiles = [];

      for (const file of files) {
        const { originalname, filename, mimetype, size } = file;
        const filePath = `http://127.0.0.1:8000/uploads/${filename}`;

        const [result] = await connection.query(query, [
          originalname,
          filename,
          mimetype,
          size,
          filePath,
        ]);

        insertedFiles.push({
          id: (result as any).insertId,
          originalname,
          filename,
          mimetype,
          size,
          filePath,
        });
      }

      return reply.send({
        message: "Files uploaded successfully",
        data: insertedFiles,
      });
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

  fastify.get(
    "/file/:fileName",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const param: any = request.params;
      const fileName = param.fileName;
      const filePath = path.join("uploads/", fileName);
      const _mimetype = mime.lookup(fileName);
      const fileData = fs.readFileSync(filePath);
      reply.header("Content-Type", _mimetype);
      reply.send(fileData);
    }
  );

  fastify.delete(
    "/file/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const connection = await fastify.mysql.fastifyBasic.getConnection();

      try {
        // Get file info from database
        const [files] = await connection.query(
          "SELECT file_name FROM files WHERE file_id = ?",
          [id]
        );

        if (!files || (files as any[]).length === 0) {
          return reply.status(404).send({
            message: "File not found",
          });
        }

        const fileName = (files as any[])[0].file_name;
        const filePath = path.join("uploads/", fileName);

        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Delete record from database
        await connection.query("DELETE FROM files WHERE file_id = ?", [id]);

        return reply.send({
          message: "File deleted successfully",
          id: id,
          fileName: fileName,
        });
      } catch (error) {
        return reply.status(500).send({
          message: "Error deleting file",
          error: error,
        });
      } finally {
        connection.release();
      }
    }
  );
}
