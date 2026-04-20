export function MetricCard({ label, value, helper, tone = "default" }) {
  return (
    <article className={`metric-card glass-card tone-${tone}`}>
      <span className="eyebrow">{label}</span>
      <h3>{value}</h3>
      <p className="muted">{helper}</p>
    </article>
  );
}

