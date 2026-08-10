import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(__dirname, "../dist");

app.use(express.json());

function getFoundryChatEndpoint() {
  const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT?.replace(/\/+$/, "");

  if (!endpoint) {
    return null;
  }

  return endpoint.endsWith("/openai/v1")
    ? `${endpoint}/chat/completions`
    : `${endpoint}/openai/v1/chat/completions`;
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/copilot/chat", async (request, response) => {
  const apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY;
  const deployment = process.env.AZURE_AI_FOUNDRY_DEPLOYMENT;
  const endpoint = getFoundryChatEndpoint();
  const messages = request.body?.messages;

  if (!apiKey || !deployment || !endpoint) {
    return response.status(503).json({
      error: "Azure AI Foundry chat is not configured on this server."
    });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return response.status(400).json({
      error: "Provide between 1 and 20 chat messages."
    });
  }

  const validMessages = messages.every(({ role, content }) =>
    ["user", "assistant"].includes(role) &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= 4000
  );

  if (!validMessages) {
    return response.status(400).json({
      error: "Messages must have a user or assistant role and contain up to 4000 characters."
    });
  }

  try {
    const foundryResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        model: deployment,
        messages: [
          {
            role: "system",
            content: "You are Mission Copilot, a concise assistant for a Vite, Express, and CLI application."
          },
          ...messages
        ]
      })
    });
    const payload = await foundryResponse.json();

    if (!foundryResponse.ok) {
      console.error("Azure AI Foundry request failed:", payload);
      return response.status(502).json({
        error: "Azure AI Foundry could not complete the chat request."
      });
    }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return response.status(502).json({
        error: "Azure AI Foundry returned an empty chat response."
      });
    }

    response.json({ content, model: payload.model ?? deployment });
  } catch (error) {
    console.error("Azure AI Foundry request failed:", error.message);
    response.status(502).json({
      error: "Azure AI Foundry could not be reached."
    });
  }
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
