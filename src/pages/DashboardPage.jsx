import { AlertTriangle, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();
  const {
    tasks,
    sessions,
    completionRate,
    weeklyFocusHours,
    urgentTasks,
    profile,
    isLoading,
  } = useAppData();

  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== "done")
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
    .slice(0, 4);

  const latestSessions = sessions.slice(0, 3);

  if (isLoading) {
    return <div className="glass-card page-card">Loading your dashboard...</div>;
  }

  return (
    <div className="page-grid">
      <section className="hero-summary glass-card">
        <div>
          <span className="badge">This week at a glance</span>
          <h1>{user?.name}, your semester goals are now actionable.</h1>
          <p className="muted">
            Stay aligned with your target of {profile.focusHoursGoal} focus hours
            and protect time for deep work before deadlines become urgent.
          </p>
        </div>
        <div className="hero-summary-actions">
          <Link to="/app/tasks" className="primary-button">
            Manage tasks
          </Link>
          <Link to="/app/planner" className="ghost-button">
            Log session
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          label="Task completion"
          value={`${completionRate}%`}
          helper="Tracks how much of your current workload you have closed."
          tone="gold"
        />
        <MetricCard
          label="Weekly focus hours"
          value={`${weeklyFocusHours}h`}
          helper={`Target: ${profile.focusHoursGoal}h this week`}
          tone="teal"
        />
        <MetricCard
          label="Open tasks"
          value={tasks.filter((task) => task.status !== "done").length}
          helper="Assignments, revision blocks, and study goals still in motion."
        />
        <MetricCard
          label="Urgent tasks"
          value={urgentTasks.length}
          helper="Items due in the next 72 hours."
          tone="rose"
        />
      </section>

      <section className="two-column-layout">
        <article className="glass-card page-card">
          <div className="section-heading">
            <div>
              <h3>
                <CalendarDays size={18} /> Upcoming priorities
              </h3>
              <p className="muted">The next items competing for your attention.</p>
            </div>
          </div>

          {upcomingTasks.length ? (
            <div className="stack-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="list-item">
                  <div>
                    <strong>{task.title}</strong>
                    <p className="muted">
                      {task.course} | due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span className={`pill pill-${task.priority}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active tasks yet"
              body="Add your first assignment or study goal to see your week take shape."
            />
          )}
        </article>

        <article className="glass-card page-card">
          <div className="section-heading">
            <div>
              <h3>
                <Sparkles size={18} /> Recent study sessions
              </h3>
              <p className="muted">Short feedback loops build strong habits.</p>
            </div>
          </div>

          {latestSessions.length ? (
            <div className="stack-list">
              {latestSessions.map((session) => (
                <div key={session.id} className="list-item">
                  <div>
                    <strong>{session.topic}</strong>
                    <p className="muted">
                      {session.course} | {session.duration} minutes
                    </p>
                  </div>
                  <span className={`pill pill-${session.energy}`}>{session.energy}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No sessions logged yet"
              body="Start logging study blocks to unlock your focus analytics."
            />
          )}
        </article>
      </section>

      <section className="glass-card callout-card">
        <AlertTriangle size={18} />
        <p>
          <strong>Focus hint:</strong> schedule your hardest task inside your
          preferred {profile.preferredStudyBlock}-minute study block and keep
          easier admin work for later in the day.
        </p>
      </section>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
