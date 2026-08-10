# Vite Express CLI

An isolated starter application combining a Vite React client, Express API, and Node.js command-line interface.

## Start

```bash
cd vite-express-cli
npm install
npm run dev
```

The Vite client runs at `http://localhost:5173` and proxies API requests to Express at `http://localhost:3001`.

## Mission Copilot chat

The client includes a multi-turn Mission Copilot panel backed by Azure AI Foundry. Copy
`.env.example` to `.env`, then configure an OpenAI-compatible Foundry endpoint, API key,
and deployment name. The Express server reads these variables and keeps the API key out of
the browser.

## CLI

Run the CLI from this directory:

```bash
npx vex serve --port 3001
npx vex status
npx vex message "Hello from the terminal"
```

Set `VEX_SERVER_URL` to target a different API base URL. For a production run, build the client first and then start Express:

```bash
npm run build
npm start
```
