import { Trash2 } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { EmptyState } from "../components/ui/EmptyState";
import { useAppData } from "../hooks/useAppData";

export function StudyPlannerPage() {
  const { sessions, weeklyFocusHours, profile, addSession, removeSession } = useAppData();

  return (
    <div className="page-grid">
      <section className="study-grid">
        <SessionForm onSubmit={addSession} />

        <article className="glass-card page-card">
          <div className="section-heading">
            <div>
              <h3>Weekly pacing</h3>
              <p className="muted">
                You have logged {weeklyFocusHours}h out of your{" "}
                {profile.focusHoursGoal}h focus goal this week.
              </p>
            </div>
          </div>

          <div className="progress-shell">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(
                  100,
                  (weeklyFocusHours / profile.focusHoursGoal) * 100 || 0
                )}%`,
              }}
            />
          </div>

          <div className="tip-list">
            <p>Best study block: {profile.preferredStudyBlock} minutes</p>
            <p>Course load: {profile.courseLoad}</p>
            <p>Semester goal: {profile.semesterGoal}</p>
          </div>
        </article>
      </section>

      <section className="glass-card page-card">
        <div className="section-heading">
          <div>
            <h3>Study log</h3>
            <p className="muted">
              Review recent sessions to understand what kind of work is producing momentum.
            </p>
          </div>
        </div>

        {sessions.length ? (
          <div className="stack-list">
            {sessions.map((session) => (
              <article key={session.id} className="list-item session-item">
                <div>
                  <strong>{session.topic}</strong>
                  <p className="muted">
                    {session.course} • {session.date} • {session.duration} minutes
                  </p>
                  <p>{session.outcome || "No outcome summary added."}</p>
                </div>
                <div className="button-row">
                  <span className={`pill pill-${session.energy}`}>{session.energy}</span>
                  <button
                    type="button"
                    className="icon-button danger-button"
                    onClick={() => removeSession(session.id)}
                    aria-label={`Delete ${session.topic}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No study sessions yet"
            body="Log your first focus block to build a realistic picture of your study habits."
          />
        )}
      </section>
    </div>
  );
}

