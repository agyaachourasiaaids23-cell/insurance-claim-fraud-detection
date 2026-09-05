import type { RiskIndicator } from '@/utils/analytics';
import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  indicators: RiskIndicator[];
  overallFraudRate: number;
}

export function RiskIndicators({ indicators, overallFraudRate }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-800">Fraud Risk Indicators</h3>
      </div>
      <p className="mb-3 text-sm text-slate-600">
        Patterns associated with fraudulent claims in the dataset. Overall fraud rate:{' '}
        <span className="font-semibold text-slate-800">{overallFraudRate.toFixed(2)}%</span>
      </p>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          These indicators represent patterns observed in the dataset and should not be
          interpreted as definitive proof of fraud. They highlight characteristics that are
          associated with higher fraud frequency in this dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {indicators.map((ind) => {
          const isHigh = ind.fraudRate > overallFraudRate;
          const ratio = overallFraudRate > 0 ? ind.fraudRate / overallFraudRate : 0;
          const barWidth = Math.min(100, ratio * 50);
          return (
            <div
              key={ind.label}
              className={`rounded-lg border p-3 ${
                isHigh
                  ? 'border-red-200 bg-red-50/50'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{ind.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isHigh
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {ind.fraudRate.toFixed(2)}%
                </span>
              </div>
              <p className="mb-2 text-xs text-slate-500">{ind.description}</p>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {ind.fraudCount} fraud / {ind.totalCount} total
                </span>
                {isHigh && (
                  <span className="font-medium text-red-600">
                    {ratio.toFixed(1)}x overall
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    isHigh ? 'bg-red-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
