import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState("Checking API...");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

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

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">VITE + EXPRESS + CLI</p>
        <h1>One stack, three interfaces.</h1>
        <p className="summary">
          Develop a React client, a small Express API, and reusable commands
          from one application workspace.
        </p>
      </section>

      <section className="card">
        <div className="status">
          <span>API status</span>
          <strong>{health}</strong>
        </div>

        <form onSubmit={submitCommand}>
          <label htmlFor="message">Send a command</label>
          <div className="command-row">
            <input
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Hello from the Vite client"
              maxLength="500"
              required
            />
            <button type="submit">Run</button>
          </div>
        </form>

        {result && <output>{result}</output>}
      </section>

      <section className="commands">
        <h2>CLI commands</h2>
        <code>npm run dev</code>
        <code>npx vex serve</code>
        <code>npx vex status</code>
        <code>npx vex message "Hello"</code>
      </section>
    </main>
  );
}
