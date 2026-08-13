import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "./Card";
import { linkDistribution, linkStats, topLinkingSites } from "../data/mock";

export default function Links() {
  const totalLinks = linkStats.internalLinks + linkStats.externalLinks;
  const internalPct = ((linkStats.internalLinks / totalLinks) * 100).toFixed(1);

  return (
    <div className="view">
      <div className="view-header">
        <h1>Links</h1>
        <p>Internal and external link analytics across your property.</p>
      </div>

      <div className="stat-row">
        <Card title="Total Links" className="stat-card">
          <strong>{totalLinks.toLocaleString()}</strong>
        </Card>
        <Card title="Internal Links" className="stat-card">
          <strong>{linkStats.internalLinks.toLocaleString()}</strong>
          <span className="stat-delta positive">{internalPct}%</span>
        </Card>
        <Card title="External Links" className="stat-card">
          <strong>{linkStats.externalLinks.toLocaleString()}</strong>
          <span className="stat-delta">{(100 - Number(internalPct)).toFixed(1)}%</span>
        </Card>
        <Card title="Top Linking Sites" className="stat-card">
          <strong>{topLinkingSites.length}</strong>
        </Card>
      </div>

      <Card title="Link Distribution by Section" subtitle="Internal links per site area">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={linkDistribution} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
            <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" width={110} />
            <Tooltip contentStyle={{ background: "#0b0e17", border: "1px solid rgba(0,243,255,0.3)" }} />
            <Bar dataKey="links" fill="#00f3ff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top Linking Sites" subtitle="External domains linking to your property">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Links Found</th>
              <th>Target Pages</th>
            </tr>
          </thead>
          <tbody>
            {topLinkingSites.map((site) => (
              <tr key={site.id}>
                <td>{site.domain}</td>
                <td>{site.linksFound.toLocaleString()}</td>
                <td>{site.targetPages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
