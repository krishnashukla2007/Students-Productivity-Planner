import { useState } from "react";

const initialValues = {
  topic: "",
  course: "",
  date: new Date().toISOString().slice(0, 10),
  duration: 60,
  energy: "high",
  outcome: "",
};

export function SessionForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values);
    setValues(initialValues);
  };

  return (
    <form className="form-card glass-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <h3>Log a study session</h3>
          <p className="muted">
            Capture your focus sessions to spot what helps you stay consistent.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Topic</span>
          <input
            name="topic"
            value={values.topic}
            onChange={handleChange}
            placeholder="React Router revision"
            required
          />
        </label>

        <label className="field">
          <span>Course</span>
          <input
            name="course"
            value={values.course}
            onChange={handleChange}
            placeholder="Web Applications"
            required
          />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" name="date" value={values.date} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Duration (minutes)</span>
          <input
            type="number"
            name="duration"
            min="15"
            step="15"
            value={values.duration}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Energy level</span>
          <select name="energy" value={values.energy} onChange={handleChange}>
            <option value="high">High</option>
            <option value="steady">Steady</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Outcome</span>
        <textarea
          name="outcome"
          rows="3"
          value={values.outcome}
          onChange={handleChange}
          placeholder="Finished routing notes and fixed stale state bug."
        />
      </label>

      <button type="submit" className="primary-button">
        Save session
      </button>
    </form>
  );
}

