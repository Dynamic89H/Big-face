import type { CSSProperties, ReactNode } from 'react';

interface PageHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * PageHeader — consistent professional header for every Big Face page.
 * Gold gradient title, subtle subtitle, optional action buttons.
 */
export default function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.75rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.9rem',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    background: 'linear-gradient(135deg, #ffffff 30%, #ffd700 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const subStyle: CSSProperties = {
    color: 'var(--muted)',
    fontSize: '0.95rem',
    margin: '0.4rem 0 0',
    lineHeight: 1.5,
    maxWidth: '600px',
  };

  return (
    <div style={headerStyle}>
      <div>
        <h1 style={titleStyle}>
          {icon && <span style={{ marginRight: '0.6rem', WebkitTextFillColor: 'initial' }}>{icon}</span>}
          {title}
        </h1>
        {subtitle && <p style={subStyle}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
