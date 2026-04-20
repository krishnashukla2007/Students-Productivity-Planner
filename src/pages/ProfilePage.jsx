import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
  const { user, authMode, updateProfile: updateAccountProfile } = useAuth();
  const { profile, updateProfile } = useAppData();
  const [status, setStatus] = useState("");
  const [values, setValues] = useState({
    name: user?.name || "",
    focusHoursGoal: profile.focusHoursGoal,
    preferredStudyBlock: profile.preferredStudyBlock,
    courseLoad: profile.courseLoad,
    semesterGoal: profile.semesterGoal,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateAccountProfile({ name: values.name });
    await updateProfile({
      focusHoursGoal: values.focusHoursGoal,
      preferredStudyBlock: values.preferredStudyBlock,
      courseLoad: values.courseLoad,
      semesterGoal: values.semesterGoal,
    });
    setStatus("Profile updated successfully.");
  };

  return (
    <section className="glass-card page-card">
      <div className="section-heading">
        <div>
          <h3>Planner preferences</h3>
          <p className="muted">
            Fine-tune how Momentum frames your workload and study routines.
          </p>
        </div>
        <span className="badge">
          {authMode === "supabase" ? "Supabase mode" : "Demo mode"}
        </span>
      </div>

      <form className="form-card profile-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input name="name" value={values.name} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Weekly focus goal (hours)</span>
            <input
              type="number"
              min="1"
              max="60"
              name="focusHoursGoal"
              value={values.focusHoursGoal}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Preferred study block (minutes)</span>
            <input
              type="number"
              min="30"
              max="240"
              step="15"
              name="preferredStudyBlock"
              value={values.preferredStudyBlock}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Course load</span>
            <input
              name="courseLoad"
              value={values.courseLoad}
              onChange={handleChange}
              placeholder="Full semester"
            />
          </label>
        </div>

        <label className="field">
          <span>Semester goal</span>
          <textarea
            rows="4"
            name="semesterGoal"
            value={values.semesterGoal}
            onChange={handleChange}
          />
        </label>

        {status ? <p className="success-message">{status}</p> : null}

        <button type="submit" className="primary-button">
          Save preferences
        </button>
      </form>
    </section>
  );
}
