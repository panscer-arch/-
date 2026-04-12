import type { PropsWithChildren } from "react";

export function Surface({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <section className={`lc-surface ${className}`.trim()}>{children}</section>;
}

export function StatTile({
  label,
  value,
  helper
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <Surface className="lc-stat-tile">
      <p className="lc-kicker">{label}</p>
      <h3>{value}</h3>
      {helper ? <p className="lc-muted">{helper}</p> : null}
    </Surface>
  );
}

export function Pill({ children }: PropsWithChildren) {
  return <span className="lc-pill">{children}</span>;
}

export function SectionHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="lc-section-header">
      <div>
        <p className="lc-kicker">Section</p>
        <h2>{title}</h2>
      </div>
      {description ? <p className="lc-muted">{description}</p> : null}
    </div>
  );
}
