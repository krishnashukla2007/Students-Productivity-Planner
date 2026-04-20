import { useEffect, useState } from "react";

const defaultValues = {
  title: "",
  course: "",
  dueDate: "",
  priority: "medium",
  status: "todo",
  estimateHours: 2,
  tags: "",
  notes: "",
};

export function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (editingTask) {
      setValues({
        ...editingTask,
        tags: editingTask.tags.join(", "),
      });
    } else {
      setValues(defaultValues);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values);
    setValues(defaultValues);
  };

  return (
    <form className="form-card glass-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <h3>{editingTask ? "Update task" : "Add a new task"}</h3>
          <p className="muted">
            Keep assignments, revision, and personal goals in one flow.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Task title</span>
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Prepare DBMS lab report"
            required
          />
        </label>

        <label className="field">
          <span>Course</span>
          <input
            name="course"
            value={values.course}
            onChange={handleChange}
            placeholder="Database Systems"
            required
          />
        </label>

        <label className="field">
          <span>Due date</span>
          <input
            type="date"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Priority</span>
          <select name="priority" value={values.priority} onChange={handleChange}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="field">
          <span>Estimated hours</span>
          <input
            type="number"
            name="estimateHours"
            min="1"
            max="40"
            value={values.estimateHours}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Tags</span>
        <input
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="assignment, team, revision"
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          name="notes"
          rows="4"
          value={values.notes}
          onChange={handleChange}
          placeholder="Break this task into subtasks or add submission notes."
        />
      </label>

      <div className="button-row">
        <button type="submit" className="primary-button">
          {editingTask ? "Save changes" : "Add task"}
        </button>
        {editingTask ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

