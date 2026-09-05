import type { KPIData } from '@/types';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Percent,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface Props {
  kpis: KPIData;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

export function KPICards({ kpis }: Props) {
  const cards = [
    {
      label: 'Total Claims',
      value: kpis.totalClaims.toLocaleString(),
      icon: FileText,
      color: 'bg-slate-100 text-slate-700',
      accent: 'border-l-slate-400',
    },
    {
      label: 'Fraudulent Claims',
      value: kpis.fraudulentClaims.toLocaleString(),
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      accent: 'border-l-red-500',
    },
    {
      label: 'Genuine Claims',
      value: kpis.genuineClaims.toLocaleString(),
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      accent: 'border-l-emerald-500',
    },
    {
      label: 'Fraud Rate',
      value: `${kpis.fraudRate.toFixed(2)}%`,
      icon: Percent,
      color: 'bg-amber-50 text-amber-600',
      accent: 'border-l-amber-500',
    },
    {
      label: 'Total Claim Amount',
      value: formatCurrency(kpis.totalClaimAmount),
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
      accent: 'border-l-blue-500',
    },
    {
      label: 'Average Claim Amount',
      value: formatCurrency(kpis.avgClaimAmount),
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
      accent: 'border-l-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-lg border border-slate-200 border-l-4 ${card.accent} bg-white p-3 shadow-sm`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <span className={`flex h-7 w-7 items-center justify-center rounded ${card.color}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="text-lg font-bold text-slate-900 sm:text-xl">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
