import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { TaskForm } from "../components/forms/TaskForm";
import { useAppData } from "../hooks/useAppData";

export function TasksPage() {
  const { tasks, addTask, updateTask, removeTask } = useAppData();
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  const handleSubmit = async (values) => {
    if (editingTask) {
      await updateTask(editingTask.id, values);
      setEditingTask(null);
      return;
    }

    await addTask(values);
  };

  return (
    <div className="page-grid">
      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
      />

      <section className="glass-card page-card">
        <div className="section-heading">
          <div>
            <h3>Task board</h3>
            <p className="muted">
              Use status, effort, and deadline together to decide what to do next.
            </p>
          </div>
          <select
            className="filter-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All tasks</option>
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {filteredTasks.length ? (
          <div className="stack-list">
            {filteredTasks.map((task) => (
              <article key={task.id} className="task-card">
                <div className="task-card-header">
                  <div>
                    <h4>{task.title}</h4>
                    <p className="muted">
                      {task.course} | due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => setEditingTask(task)}
                      aria-label={`Edit ${task.title}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-button danger-button"
                      onClick={() => removeTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p>{task.notes || "No notes added yet."}</p>

                <div className="task-meta">
                  <span className={`pill pill-${task.priority}`}>{task.priority}</span>
                  <span className={`pill pill-${task.status}`}>{task.status}</span>
                  <span className="pill">{task.estimateHours}h estimate</span>
                </div>

                {task.tags.length ? (
                  <div className="tag-row">
                    {task.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks in this view"
            body="Create a task or switch the filter to see more of your workload."
          />
        )}
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
