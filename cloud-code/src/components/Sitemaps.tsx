import { useState } from "react";
import Card from "./Card";
import { sitemaps as initialSitemaps } from "../data/mock";
import type { SitemapEntry } from "../types";

const statusClass: Record<SitemapEntry["status"], string> = {
  success: "badge-success",
  pending: "badge-info",
  error: "badge-error",
};

export default function Sitemaps() {
  const [sitemaps, setSitemaps] = useState<SitemapEntry[]>(initialSitemaps);
  const [newSitemapUrl, setNewSitemapUrl] = useState("");

  const totalDiscovered = sitemaps.reduce((sum, s) => sum + s.discovered, 0);
  const totalErrors = sitemaps.reduce((sum, s) => sum + s.errors, 0);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const url = newSitemapUrl.trim();
    if (!url) return;

    const entry: SitemapEntry = {
      id: `sm-${Date.now()}`,
      url,
      status: "pending",
      discovered: 0,
      lastSubmitted: new Date().toISOString().slice(0, 10),
      errors: 0,
    };

    setSitemaps((current) => [entry, ...current]);
    setNewSitemapUrl("");
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Sitemaps</h1>
        <p>Submit sitemaps and monitor crawl discovery status.</p>
      </div>

      <div className="stat-row">
        <Card title="Submitted Sitemaps" className="stat-card">
          <strong>{sitemaps.length}</strong>
        </Card>
        <Card title="Pages Discovered" className="stat-card">
          <strong>{totalDiscovered.toLocaleString()}</strong>
        </Card>
        <Card title="Total Errors" className="stat-card">
          <strong>{totalErrors}</strong>
          <span className={totalErrors > 0 ? "stat-delta negative" : "stat-delta positive"}>
            {totalErrors > 0 ? "needs attention" : "all clear"}
          </span>
        </Card>
      </div>

      <Card title="Submit a Sitemap">
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="/sitemap-new.xml"
            value={newSitemapUrl}
            onChange={(event) => setNewSitemapUrl(event.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </Card>

      <Card title="Sitemap Status">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Sitemap</th>
              <th>Status</th>
              <th>Discovered Pages</th>
              <th>Last Submitted</th>
              <th>Errors</th>
            </tr>
          </thead>
          <tbody>
            {sitemaps.map((sitemap) => (
              <tr key={sitemap.id}>
                <td>{sitemap.url}</td>
                <td>
                  <span className={`badge ${statusClass[sitemap.status]}`}>{sitemap.status}</span>
                </td>
                <td>{sitemap.discovered.toLocaleString()}</td>
                <td>{sitemap.lastSubmitted}</td>
                <td>{sitemap.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
