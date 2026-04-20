import { ArrowRight, ChartColumnBig, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Plan around real deadlines",
    body: "Manage assignments, revision, and project milestones in one schedule.",
    icon: Clock3,
  },
  {
    title: "Track consistency, not just tasks",
    body: "See how your study hours and completion rate move every week.",
    icon: ChartColumnBig,
  },
  {
    title: "Protected student workspace",
    body: "Use demo mode instantly or connect Supabase for full backend auth and data.",
    icon: ShieldCheck,
  },
];

export function LandingPage() {
  return (
    <div className="marketing-shell">
      <header className="marketing-nav">
        <div className="brand-inline">
          <div className="brand-mark">M</div>
          <div>
            <strong>Momentum</strong>
            <p className="nav-caption">Student productivity planner</p>
          </div>
        </div>
        <Link className="ghost-button" to="/auth">
          Open app
        </Link>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="badge">Built for serious student workflows</span>
          <h1>Turn scattered deadlines into a calm, focused weekly plan.</h1>
          <p>
            Momentum is a student productivity planner for managing assignments,
            study sessions, and academic consistency without bouncing across apps.
          </p>
          <div className="button-row">
            <Link className="primary-button" to="/auth">
              Start planning
              <ArrowRight size={16} />
            </Link>
            <a className="ghost-button" href="#features">
              See features
            </a>
          </div>
          <div className="hero-proof">
            <div>
              <strong>All-in-one planning</strong>
              <span>Tasks, sessions, analytics, and protected access</span>
            </div>
            <div>
              <strong>Submission-ready</strong>
              <span>Responsive UI with real auth and persistence support</span>
            </div>
          </div>
        </div>

        <div className="hero-panel glass-card">
          <div className="hero-panel-top">
            <span className="eyebrow">Planner snapshot</span>
            <div className="hero-orb" />
          </div>
          <div className="hero-score-card">
            <p>Weekly focus</p>
            <strong>8.5h</strong>
            <span>steady momentum across 5 sessions</span>
          </div>
          <div className="hero-mini-grid">
            <div className="mini-stat">
              <span>Urgent tasks</span>
              <strong>3</strong>
            </div>
            <div className="mini-stat">
              <span>Completion rate</span>
              <strong>74%</strong>
            </div>
          </div>
          <div className="hero-agenda">
            <div className="agenda-line">
              <span className="agenda-time">09:00</span>
              <span>React sprint planning</span>
            </div>
            <div className="agenda-line">
              <span className="agenda-time">14:30</span>
              <span>Database revision block</span>
            </div>
            <div className="agenda-line">
              <span className="agenda-time">18:00</span>
              <span>Assignment review and cleanup</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="glass-card feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
