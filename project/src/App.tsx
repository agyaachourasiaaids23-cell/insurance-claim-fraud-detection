import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Claim, FilterState } from '@/types';
import { loadClaims } from '@/utils/dataLoader';
import {
  computeKPIs,
  applyFilters,
  fraudDonutData,
  fraudByIncidentType,
  fraudBySeverity,
  claimAmountByFraudStatus,
  fraudByPolicyCategory,
  fraudByVehicleMake,
  fraudByAgeGroup,
  claimTrendByMonth,
  fraudByVehicleCategory,
  computeRiskIndicators,
} from '@/utils/analytics';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FilterSidebar, DEFAULT_FILTERS } from '@/components/FilterSidebar';
import { FraudDonutChart } from '@/components/FraudDonutChart';
import { FraudByIncidentTypeChart } from '@/components/FraudByIncidentTypeChart';
import { FraudBySeverityChart } from '@/components/FraudBySeverityChart';
import { ClaimAmountChart } from '@/components/ClaimAmountChart';
import { FraudByPolicyChart } from '@/components/FraudByPolicyChart';
import { FraudByVehicleChart } from '@/components/FraudByVehicleChart';
import { FraudByAgeGroupChart } from '@/components/FraudByAgeGroupChart';
import { ClaimTrendChart } from '@/components/ClaimTrendChart';
import { FraudByVehicleCategoryChart } from '@/components/FraudByVehicleCategoryChart';
import { ClaimsTable } from '@/components/ClaimsTable';
import { RiskIndicators } from '@/components/RiskIndicators';
import { Loader2, AlertCircle } from 'lucide-react';

function useClaims() {
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClaims()
      .then(setClaims)
      .catch((e) => setError(e.message || 'Failed to load dataset'));
  }, []);

  return { claims, error };
}

export default function App() {
  const { claims, error } = useClaims();
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterState(DEFAULT_FILTERS);
    setSearchTerm('');
  }, []);

  const activeFilterCount = useMemo(
    () => Object.values(filterState).filter((v) => v !== 'all').length,
    [filterState]
  );

  const fullFilters = useMemo(
    () => ({ ...filterState, searchTerm }),
    [filterState, searchTerm]
  );

  const filteredClaims = useMemo(
    () => (claims ? applyFilters(claims, fullFilters) : []),
    [claims, fullFilters]
  );

  const kpis = useMemo(() => computeKPIs(filteredClaims), [filteredClaims]);
  const donutData = useMemo(() => fraudDonutData(filteredClaims), [filteredClaims]);
  const incidentTypeData = useMemo(() => fraudByIncidentType(filteredClaims), [filteredClaims]);
  const severityData = useMemo(() => fraudBySeverity(filteredClaims), [filteredClaims]);
  const amountData = useMemo(() => claimAmountByFraudStatus(filteredClaims), [filteredClaims]);
  const policyData = useMemo(() => fraudByPolicyCategory(filteredClaims), [filteredClaims]);
  const vehicleData = useMemo(() => fraudByVehicleMake(filteredClaims), [filteredClaims]);
  const ageData = useMemo(() => fraudByAgeGroup(filteredClaims), [filteredClaims]);
  const trendData = useMemo(() => claimTrendByMonth(filteredClaims), [filteredClaims]);
  const vehicleCatData = useMemo(() => fraudByVehicleCategory(filteredClaims), [filteredClaims]);
  const riskIndicators = useMemo(() => computeRiskIndicators(filteredClaims), [filteredClaims]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h2 className="text-lg font-bold text-slate-800">Failed to Load Dataset</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <p className="text-xs text-slate-500">
            Please ensure fraud_oracle.csv is available in the public/data directory.
          </p>
        </div>
      </div>
    );
  }

  if (!claims) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          <p className="text-sm text-slate-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-5 lg:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <FilterSidebar
            claims={claims}
            filters={filterState}
            onChange={handleFilterChange}
            onReset={handleReset}
            activeCount={activeFilterCount}
          />

          <div className="space-y-4">
            <KPICards kpis={kpis} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FraudDonutChart
                data={donutData}
                onSegmentClick={(name) => handleFilterChange('fraudStatus', name)}
              />
              <FraudByIncidentTypeChart
                data={incidentTypeData}
                onBarClick={(name) => handleFilterChange('incidentType', name)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FraudBySeverityChart
                data={severityData}
                onBarClick={(name) => handleFilterChange('incidentSeverity', name)}
              />
              <ClaimAmountChart data={amountData} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FraudByPolicyChart
                data={policyData}
                onBarClick={(name) => {
                  const match = claims.find((c) => c.PolicyType === name);
                  if (match) handleFilterChange('policyState', match.BasePolicy);
                }}
              />
              <FraudByVehicleChart
                data={vehicleData}
                onBarClick={(_name) => {}}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FraudByAgeGroupChart
                data={ageData}
                onBarClick={(name) => handleFilterChange('ageGroup', name)}
              />
              <FraudByVehicleCategoryChart
                data={vehicleCatData}
                onBarClick={(name) => handleFilterChange('vehicleCategory', name)}
              />
            </div>

            <ClaimTrendChart
              data={trendData}
              onPointClick={(name) => handleFilterChange('incidentState', name)}
            />

            <ClaimsTable
              claims={filteredClaims}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <RiskIndicators
              indicators={riskIndicators}
              overallFraudRate={kpis.fraudRate}
            />

            <footer className="pb-6 pt-2 text-center text-xs text-slate-400">
              Insurance Claim Fraud Detection Dashboard — Data Warehousing & Mining Project
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
