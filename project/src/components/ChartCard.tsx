import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  height?: number;
}

export function ChartCard({ title, subtitle, children, className = '', height = 280 }: Props) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}
