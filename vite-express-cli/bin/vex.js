#!/usr/bin/env node

import { spawn } from "node:child_process";

const [command = "help", ...argumentsList] = process.argv.slice(2);
const serverUrl = process.env.VEX_SERVER_URL ?? "http://localhost:3001";

function printUsage() {
  console.log(`
Usage: vex <command>

Commands:
  serve [--port <port>]  Start the Express API.
  status                 Check the API health endpoint.
  message <text>         Send text to the API command endpoint.
  help                   Show this help message.
`);
}

async function request(path, options) {
  const response = await fetch(`${serverUrl}${path}`, options);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed with status ${response.status}`);
  }

  return payload;
}

async function run() {
  switch (command) {
    case "serve": {
      const portIndex = argumentsList.indexOf("--port");
      const port = portIndex >= 0 ? argumentsList[portIndex + 1] : undefined;
      const child = spawn(process.execPath, ["server/index.js"], {
        stdio: "inherit",
        env: { ...process.env, ...(port ? { PORT: port } : {}) }
      });
      child.on("exit", (code) => process.exit(code ?? 0));
      return;
    }
    case "status": {
      const health = await request("/api/health");
      console.log(`API status: ${health.status}`);
      return;
    }
    case "message": {
      const message = argumentsList.join(" ").trim();
      if (!message) {
        throw new Error("Provide a message: vex message \"Hello\"");
      }

      const result = await request("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      console.log(result.result);
      return;
    }
    case "help":
    case "--help":
    case "-h":
      printUsage();
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

run().catch((error) => {
  console.error(`vex: ${error.message}`);
  process.exitCode = 1;
});
