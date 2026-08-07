import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(__dirname, "../dist");

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/commands", (request, response) => {
  const message = typeof request.body?.message === "string"
    ? request.body.message.trim()
    : "";

  if (!message) {
    return response.status(400).json({ error: "A message is required." });
  }

  response.json({ result: `Command received: ${message}` });
});

app.use(express.static(distDirectory));

app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(distDirectory, "index.html"), (error) => {
    if (error) {
      response.status(404).send("Build the client with `npm run build` first.");
    }
  });
});

app.listen(port, () => {
  console.log(`Vite Express API listening at http://localhost:${port}`);
});
