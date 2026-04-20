import {
  BarChart3,
  CalendarClock,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navigation = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/app/planner", label: "Study Planner", icon: CalendarClock },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: UserCircle2 },
];

export function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar glass-card">
        <div className="sidebar-brand">
          <div className="brand-mark">M</div>
          <div>
            <h1>Momentum</h1>
            <p className="muted">
              Focused planning for deadlines, study blocks, and progress.
            </p>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-chip">
            <div className="avatar">{user?.name?.slice(0, 1) || "S"}</div>
            <div>
              <strong>{user?.name}</strong>
              <p className="muted">Your planner workspace</p>
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <span className="eyebrow">Student Productivity Planner</span>
            <h2>{greeting(user?.name)}</h2>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function greeting(name = "Student") {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${prefix}, ${name}`;
}
