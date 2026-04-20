export function EmptyState({ title, body }) {
  return (
    <div className="glass-card empty-state">
      <h3>{title}</h3>
      <p className="muted">{body}</p>
    </div>
  );
}

