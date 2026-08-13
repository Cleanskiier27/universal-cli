import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";
import { dailyRevenue } from "../data/mock";

const performanceQueries = [
  { query: "datacentral cloud llc", clicks: 1820, impressions: 24100, ctr: "7.6%", position: 3.2 },
  { query: "geemini ai runtime", clicks: 940, impressions: 15230, ctr: "6.2%", position: 5.1 },
  { query: "agi.ms", clicks: 612, impressions: 8420, ctr: "7.3%", position: 2.8 },
  { query: "networkbuster neural os", clicks: 380, impressions: 6110, ctr: "6.2%", position: 6.4 },
  { query: "enterprise ai infrastructure", clicks: 275, impressions: 9820, ctr: "2.8%", position: 11.2 },
];

export default function Performance() {
  const totalClicks = performanceQueries.reduce((sum, q) => sum + q.clicks, 0);
  const totalImpressions = performanceQueries.reduce((sum, q) => sum + q.impressions, 0);

  return (
    <div className="view">
      <div className="view-header">
        <h1>Search Performance</h1>
        <p>Clicks, impressions, and ranking trends across your top queries.</p>
      </div>

      <div className="stat-row">
        <Card title="Total Clicks" className="stat-card">
          <strong>{totalClicks.toLocaleString()}</strong>
          <span className="stat-delta positive">+8.4%</span>
        </Card>
        <Card title="Total Impressions" className="stat-card">
          <strong>{totalImpressions.toLocaleString()}</strong>
          <span className="stat-delta positive">+3.1%</span>
        </Card>
        <Card title="Average CTR" className="stat-card">
          <strong>6.1%</strong>
          <span className="stat-delta negative">-0.4%</span>
        </Card>
        <Card title="Average Position" className="stat-card">
          <strong>4.9</strong>
          <span className="stat-delta positive">+0.6</span>
        </Card>
      </div>

      <Card title="Weekly Revenue-Correlated Traffic" subtitle="Actual vs. projected daily performance">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dailyRevenue}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ background: "#0b0e17", border: "1px solid rgba(0,243,255,0.3)" }} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Actual" stroke="#00f3ff" fill="url(#revenueFill)" />
            <Area type="monotone" dataKey="projected" name="Projected" stroke="#9d00ff" fillOpacity={0} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top Queries">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Query</th>
              <th>Clicks</th>
              <th>Impressions</th>
              <th>CTR</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {performanceQueries.map((row) => (
              <tr key={row.query}>
                <td>{row.query}</td>
                <td>{row.clicks.toLocaleString()}</td>
                <td>{row.impressions.toLocaleString()}</td>
                <td>{row.ctr}</td>
                <td>{row.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
