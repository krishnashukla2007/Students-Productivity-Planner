import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/forms/AuthForm";
import { useAuth } from "../hooks/useAuth";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, authError } = useAuth();

  const destination = location.state?.from || "/app/dashboard";

  const handleSubmit = async (values) => {
    setIsBusy(true);
    setError("");
    try {
      if (mode === "login") {
        await login(values);
      } else {
        await signup(values);
      }
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to continue.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <span className="badge">
          {mode === "login" ? "Welcome back" : "Create your planner workspace"}
        </span>
        <h1>Student Productivity Planner</h1>
        <p className="muted">
          Use demo mode instantly, or set Supabase environment variables for real
          cloud authentication and storage.
        </p>

        <div className="segmented-control glass-card">
          <button
            type="button"
            className={mode === "login" ? "segment-active" : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "segment-active" : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          isBusy={isBusy}
          error={error || authError}
        />

        <p className="footnote">
          Need a quick walkthrough first? <Link to="/">Return to the overview</Link>
        </p>
      </div>
    </div>
  );
}

