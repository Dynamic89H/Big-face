/**
 * GrandLoader — premium loading state for Big Face.
 * Gold lion ring + shimmer text. Use everywhere instead of blank screens.
 */
export default function GrandLoader({ text = 'Loading' }: { text?: string }) {
  return (
    <div className="grand-loader">
      <div className="ring" />
      <div className="shimmer-text">{text}</div>
    </div>
  );
}

/**
 * GrandEmpty — premium empty state for Big Face.
 * Gold-bordered card with icon, inviting copy, and action button.
 */
export function GrandEmpty({
  icon,
  title,
  copy,
  cta,
  onCta,
}: {
  icon: string;
  title: string;
  copy: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="grand-empty">
      <div className="icon">{icon}</div>
      <h3 className="title">{title}</h3>
      <p className="copy">{copy}</p>
      {cta && onCta && (
        <button className="cta" onClick={onCta}>
          {cta}
        </button>
      )}
    </div>
  );
}

/**
 * SkelList — shimmer skeleton rows for list loading.
 */
export function SkelList({ rows = 4 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skel-row" />
      ))}
    </div>
  );
}
