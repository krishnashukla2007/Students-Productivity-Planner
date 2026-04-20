import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "../components/ui/EmptyState";
import { useAppData } from "../hooks/useAppData";

const COLORS = ["#d97706", "#0891b2", "#14532d"];

export function AnalyticsPage() {
  const { taskStatusData, focusTrend, completionRate, weeklyFocusHours, tasks } =
    useAppData();

  const hasData = tasks.length > 0;

  if (!hasData) {
    return (
      <EmptyState
        title="Analytics unlock after your first tasks"
        body="Add tasks and study sessions so Momentum can show your trends, workload balance, and weekly consistency."
      />
    );
  }

  return (
    <div className="analytics-grid">
      <article className="glass-card page-card">
        <div className="section-heading">
          <div>
            <h3>Task distribution</h3>
            <p className="muted">
              Completion rate is currently {completionRate}% across your active workload.
            </p>
          </div>
        </div>
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="glass-card page-card">
        <div className="section-heading">
          <div>
            <h3>Focus trend</h3>
            <p className="muted">
              You have logged {weeklyFocusHours} hours across the current week.
            </p>
          </div>
        </div>
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={focusTrend}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#0f766e"
                fill="url(#focusGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}

