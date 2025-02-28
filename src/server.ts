import app from "./app";

const port = 8000;
const address = "127.0.0.1";

const start = async () => {
  try {
    await app.listen({ port, host: address });
    console.log(`🚀 Server is running on http://${address}:${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
