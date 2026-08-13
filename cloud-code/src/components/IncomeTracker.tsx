import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";
import { dailyRevenue, revenueStreams } from "../data/mock";

export default function IncomeTracker() {
  const totalMonthly = revenueStreams.reduce((sum, stream) => sum + stream.monthly, 0);
  const weeklyTotal = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const avgGrowth =
    revenueStreams.reduce((sum, stream) => sum + stream.growth, 0) / revenueStreams.length;

  return (
    <div className="view">
      <div className="view-header">
        <h1>Income Tracker</h1>
        <p>Revenue streams, daily performance, and growth metrics across every channel.</p>
      </div>

      <div className="stat-row">
        <Card title="Total Monthly Revenue" className="stat-card">
          <strong>${totalMonthly.toLocaleString()}</strong>
          <span className="stat-delta positive">+{avgGrowth.toFixed(1)}%</span>
        </Card>
        <Card title="This Week" className="stat-card">
          <strong>${weeklyTotal.toLocaleString()}</strong>
          <span className="stat-delta positive">+14.2%</span>
        </Card>
        <Card title="Active Revenue Streams" className="stat-card">
          <strong>{revenueStreams.length}</strong>
          <span className="stat-delta">stable</span>
        </Card>
        <Card title="Projected Next Month" className="stat-card">
          <strong>${Math.round(totalMonthly * 1.08).toLocaleString()}</strong>
          <span className="stat-delta positive">+8.0%</span>
        </Card>
      </div>

      <div className="grid-two">
        <Card title="Revenue Streams" subtitle="Monthly breakdown by channel">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={revenueStreams}
                dataKey="monthly"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {revenueStreams.map((stream) => (
                  <Cell key={stream.id} fill={stream.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b0e17", border: "1px solid rgba(0,243,255,0.3)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Daily Revenue" subtitle="Actual vs. projected this week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ background: "#0b0e17", border: "1px solid rgba(0,243,255,0.3)" }} />
              <Legend />
              <Bar dataKey="revenue" name="Actual" fill="#00ff88" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" name="Projected" fill="#9d00ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Revenue Streams Detail">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Stream</th>
              <th>Monthly Revenue</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {revenueStreams.map((stream) => (
              <tr key={stream.id}>
                <td>
                  <span className="dot" style={{ background: stream.color }} />
                  {stream.name}
                </td>
                <td>${stream.monthly.toLocaleString()}</td>
                <td className={stream.growth >= 0 ? "stat-delta positive" : "stat-delta negative"}>
                  {stream.growth >= 0 ? "+" : ""}
                  {stream.growth}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Wealth Megastructure Insights" subtitle="AI-generated observations from Geemini runtime">
        <ul className="insight-list">
          <li>Subscriptions are your fastest-growing stream at +21.8% MoM — consider tiered upsells.</li>
          <li>API Licensing growth (+34.5%) suggests strong enterprise demand; prioritize SLA tier expansion.</li>
          <li>Sponsorships declined -3.2%; renegotiate placements or diversify sponsor mix.</li>
          <li>Weekly revenue is outpacing projections by 14.2% — reallocate ad spend toward Friday peak traffic.</li>
        </ul>
      </Card>
    </div>
  );
}
