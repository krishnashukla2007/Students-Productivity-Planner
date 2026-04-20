import { useState } from "react";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export function AuthForm({ mode, onSubmit, isBusy, error }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form className="form-card glass-card" onSubmit={handleSubmit}>
      <div className="form-row">
        {mode === "signup" ? (
          <label className="field">
            <span>Full name</span>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Aarav Sharma"
              required
            />
          </label>
        ) : null}

        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="student@campus.edu"
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          minLength={6}
          required
        />
      </label>

      {error ? <p className="error-message">{error}</p> : null}

      <button type="submit" className="primary-button" disabled={isBusy}>
        {isBusy ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}

