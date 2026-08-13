import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "./Card";
import { indexingReasons, indexingSummary } from "../data/mock";

const pieData = [
  { name: "Indexed", value: indexingSummary.indexed, color: "#00ff88" },
  { name: "Not Indexed", value: indexingSummary.notIndexed, color: "#ff3d81" },
];

const severityClass: Record<string, string> = {
  info: "badge-info",
  warning: "badge-warning",
  error: "badge-error",
};

export default function Pages() {
  const total = indexingSummary.indexed + indexingSummary.notIndexed;
  const indexedPct = ((indexingSummary.indexed / total) * 100).toFixed(1);

  return (
    <div className="view">
      <div className="view-header">
        <h1>Pages</h1>
        <p>Indexing status across your property, with detailed exclusion reasons.</p>
      </div>

      <div className="stat-row">
        <Card title="Total Pages" className="stat-card">
          <strong>{total.toLocaleString()}</strong>
        </Card>
        <Card title="Indexed" className="stat-card">
          <strong>{indexingSummary.indexed.toLocaleString()}</strong>
          <span className="stat-delta positive">{indexedPct}%</span>
        </Card>
        <Card title="Not Indexed" className="stat-card">
          <strong>{indexingSummary.notIndexed.toLocaleString()}</strong>
          <span className="stat-delta negative">{(100 - Number(indexedPct)).toFixed(1)}%</span>
        </Card>
      </div>

      <div className="grid-two">
        <Card title="Indexing Status" subtitle="Indexed vs. non-indexed pages">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b0e17", border: "1px solid rgba(0,243,255,0.3)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Why Pages Aren't Indexed" subtitle="Breakdown by reason">
          <table className="cc-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Pages</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {indexingReasons.map((row) => (
                <tr key={row.reason}>
                  <td>{row.reason}</td>
                  <td>{row.count.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${severityClass[row.severity]}`}>{row.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
