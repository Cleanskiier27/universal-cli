import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState("Checking API...");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Mission Copilot online. What would you like to build?"
    }
  ]);
  const [chatError, setChatError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API is unavailable");
        }
        return response.json();
      })
      .then((data) => setHealth(data.status))
      .catch((error) => setHealth(error.message));
  }, []);

  async function submitCommand(event) {
    event.preventDefault();
    setResult("");
    setLastMessage(message);

    try {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Command failed");
      }

      setResult(data.result);
      setMessage("");
    } catch (error) {
      setResult(error.message);
    }
  }

  function exportText(kind, content) {
    const timestamp = new Date().toISOString().replaceAll(":", "-");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `preciseliens-${kind}-${timestamp}.txt`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }

  async function submitChat(event) {
    event.preventDefault();
    const prompt = chatPrompt.trim();

    if (!prompt || chatLoading) {
      return;
    }

    const nextMessages = [...chatMessages, { role: "user", content: prompt }];
    setChatMessages(nextMessages);
    setChatPrompt("");
    setChatError("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Mission Copilot could not respond.");
      }

      setChatMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: data.content }
      ]);
    } catch (error) {
      setChatError(error.message);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="mission-control">
      <div className="cinematic-frame" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <nav className="system-nav" aria-label="Application sections">
        <a className="brand" href="#top">PRECISELIENS</a>
        <div className="nav-links">
          <a href="#command-deck">COMMAND</a>
          <a href="#operations">OPERATIONS</a>
          <a href="/flash-commands.html">FLASH COMMANDS</a>
          <a href="/overlay">OVERLAY</a>
          <span className="live-indicator">LIVE</span>
        </div>
      </nav>

      <header className="masthead">
        <div id="top">
          <p className="eyebrow">PRECISELIENS // VITE EXPRESS CLI</p>
          <h1>Command the build surface.</h1>
          <p className="summary">
            A local mission-control interface for the Vite client, Express API,
            and terminal command runner.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#command-deck">Open command deck</a>
            <a className="primary-link secondary" href="/flash-commands.html">Flash Commands</a>
            <a className="primary-link tertiary" href="/overlay">Open Overlay</a>
            <span>LOCAL OPERATIONAL LAYER</span>
          </div>
        </div>
        <div className="hero-instrument">
          <div className="orbital-display" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="core" />
            <span className="core-label">VEX</span>
          </div>
          <dl className="telemetry">
            <div>
              <dt>API STATUS</dt>
              <dd className={health === "ok" ? "nominal" : ""}>{health}</dd>
            </div>
            <div>
              <dt>TRANSPORT</dt>
              <dd>VITE PROXY</dd>
            </div>
            <div>
              <dt>MODE</dt>
              <dd className="nominal">READY</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="command-deck" id="command-deck" aria-labelledby="command-title">
        <div className="section-heading">
          <p>COMMAND DECK // 01</p>
          <span>EXPRESS RELAY</span>
        </div>
        <h2 id="command-title">Transmit a local instruction</h2>
        <form onSubmit={submitCommand}>
          <label htmlFor="message">Payload</label>
          <div className="command-row">
            <input
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Enter command payload"
              maxLength="500"
              required
            />
            <button type="submit">Transmit</button>
          </div>
        </form>
        <output className={result ? "visible" : ""} aria-live="polite">
          {result || "Awaiting command payload."}
        </output>
        <div className="export-controls">
          <button
            className="secondary-button"
            type="button"
            disabled={!lastMessage}
            onClick={() => exportText("input", lastMessage)}
          >
            Export input
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={!result}
            onClick={() => exportText("output", result)}
          >
            Export output
          </button>
        </div>
      </section>

      <section className="copilot-deck" aria-labelledby="copilot-title">
        <div className="section-heading">
          <p>MISSION COPILOT // 02</p>
          <span>AZURE AI FOUNDRY RELAY</span>
        </div>
        <h2 id="copilot-title">Keep the mission moving</h2>
        <div className="chat-log" aria-live="polite">
          {chatMessages.map((chatMessage, index) => (
            <article className={`chat-message ${chatMessage.role}`} key={`${chatMessage.role}-${index}`}>
              <span>{chatMessage.role === "assistant" ? "COPILOT" : "YOU"}</span>
              <p>{chatMessage.content}</p>
            </article>
          ))}
          {chatLoading && (
            <article className="chat-message assistant">
              <span>COPILOT</span>
              <p className="thinking">Synthesizing response...</p>
            </article>
          )}
        </div>
        <form className="chat-form" onSubmit={submitChat}>
          <label htmlFor="chat-prompt">Ask Mission Copilot</label>
          <div className="command-row">
            <input
              id="chat-prompt"
              value={chatPrompt}
              onChange={(event) => setChatPrompt(event.target.value)}
              placeholder="Plan a feature, explain a command, or troubleshoot..."
              maxLength="4000"
              required
            />
            <button type="submit" disabled={chatLoading}>
              {chatLoading ? "Thinking" : "Ask Copilot"}
            </button>
          </div>
        </form>
        {chatError && <p className="chat-error" role="alert">{chatError}</p>}
      </section>

      <section className="operations-grid" id="operations" aria-label="CLI operations">
        <article>
          <p className="panel-label">CLIENT</p>
          <h2>Vite uplink</h2>
          <code>npm run dev</code>
        </article>
        <article>
          <p className="panel-label">SERVER</p>
          <h2>Express relay</h2>
          <code>npx vex serve</code>
        </article>
        <article>
          <p className="panel-label">DIAGNOSTIC</p>
          <h2>Health scan</h2>
          <code>npx vex status</code>
        </article>
        <article>
          <p className="panel-label">TERMINAL</p>
          <h2>CLI message</h2>
          <code>npx vex message "Hello"</code>
        </article>
      </section>

      <footer>
        <span>PRECISELIENS LOCAL SYSTEMS</span>
        <span>NODE // EXPRESS // REACT</span>
      </footer>
    </main>
  );
}
