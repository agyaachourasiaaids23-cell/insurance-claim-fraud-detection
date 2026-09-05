import type { Claim, FilterState } from '@/types';
import { Filter, RotateCcw } from 'lucide-react';

interface Props {
  claims: Claim[];
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  activeCount: number;
}

const DEFAULT_FILTERS: FilterState = {
  fraudStatus: 'all',
  incidentType: 'all',
  incidentSeverity: 'all',
  gender: 'all',
  policyState: 'all',
  incidentState: 'all',
  vehicleCategory: 'all',
  ageGroup: 'all',
  claimAmountRange: 'all',
};

function uniqueSorted(claims: Claim[], key: keyof Claim): string[] {
  const set = new Set<string>();
  for (const c of claims) {
    const v = String(c[key] ?? '');
    if (v) set.add(v);
  }
  return Array.from(set).sort();
}

const AGE_GROUP_ORDER = ['Under 25', '25–34', '35–44', '45–54', '55+'];

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
      >
        <option value="all">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterSidebar({ claims, filters, onChange, onReset, activeCount }: Props) {
  const accidentAreas = uniqueSorted(claims, 'AccidentArea');
  const faults = uniqueSorted(claims, 'Fault');
  const sexes = uniqueSorted(claims, 'Sex');
  const basePolicies = uniqueSorted(claims, 'BasePolicy');
  const months = uniqueSorted(claims, 'Month');
  const vehicleCats = uniqueSorted(claims, 'VehicleCategory');
  const ageGroups = AGE_GROUP_ORDER.filter((a) =>
    claims.some((c) => c.ageGroup === a)
  );

  const claimAmountOptions = [
    { value: 'low', label: 'Low (< $30K)' },
    { value: 'mid', label: 'Mid ($30K–$60K)' },
    { value: 'high', label: 'High ($60K+)' },
  ];

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-800">Filters</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <SelectField
          label="Fraud Status"
          value={filters.fraudStatus}
          options={['Fraud', 'Genuine']}
          onChange={(v) => onChange('fraudStatus', v)}
        />
        <SelectField
          label="Accident Area"
          value={filters.incidentType}
          options={accidentAreas}
          onChange={(v) => onChange('incidentType', v)}
        />
        <SelectField
          label="Fault (Incident Severity)"
          value={filters.incidentSeverity}
          options={faults}
          onChange={(v) => onChange('incidentSeverity', v)}
        />
        <SelectField
          label="Gender"
          value={filters.gender}
          options={sexes}
          onChange={(v) => onChange('gender', v)}
        />
        <SelectField
          label="Base Policy"
          value={filters.policyState}
          options={basePolicies}
          onChange={(v) => onChange('policyState', v)}
        />
        <SelectField
          label="Incident Month"
          value={filters.incidentState}
          options={months}
          onChange={(v) => onChange('incidentState', v)}
        />
        <SelectField
          label="Vehicle Category"
          value={filters.vehicleCategory}
          options={vehicleCats}
          onChange={(v) => onChange('vehicleCategory', v)}
        />
        <SelectField
          label="Age Group"
          value={filters.ageGroup}
          options={ageGroups}
          onChange={(v) => onChange('ageGroup', v)}
        />
        <SelectField
          label="Claim Amount Range"
          value={filters.claimAmountRange}
          options={claimAmountOptions.map((o) => o.label)}
          onChange={(label) => {
            const match = claimAmountOptions.find((o) => o.label === label);
            onChange('claimAmountRange', match ? match.value : 'all');
          }}
        />
      </div>
    </aside>
  );
}

export { DEFAULT_FILTERS };
