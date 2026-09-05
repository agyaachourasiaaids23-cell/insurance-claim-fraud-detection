import { Database, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Insurance Claim Fraud Detection
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Interactive analysis of insurance claims, fraud patterns and risk indicators
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Database className="h-4 w-4 text-slate-600" />
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Dataset: Vehicle Insurance Claims</p>
              <p className="text-slate-500">Source: fraud_oracle.csv</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
