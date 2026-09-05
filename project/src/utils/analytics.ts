import type { Claim, KPIData, Filters } from '@/types';
import { getClaimAmount } from './dataLoader';

export function computeKPIs(claims: Claim[]): KPIData {
  const total = claims.length;
  const fraudulent = claims.filter((c) => c.isFraud).length;
  const genuine = total - fraudulent;
  const totalClaimAmount = claims.reduce((sum, c) => sum + getClaimAmount(c), 0);
  const avgClaimAmount = total > 0 ? totalClaimAmount / total : 0;
  const totalDeductible = claims.reduce((sum, c) => sum + (c.Deductible || 0), 0);
  const avgDeductible = total > 0 ? totalDeductible / total : 0;
  return {
    totalClaims: total,
    fraudulentClaims: fraudulent,
    genuineClaims: genuine,
    fraudRate: total > 0 ? (fraudulent / total) * 100 : 0,
    totalDeductible,
    avgDeductible,
    totalClaimAmount,
    avgClaimAmount,
  };
}

export function applyFilters(claims: Claim[], filters: Filters): Claim[] {
  return claims.filter((c) => {
    if (filters.fraudStatus !== 'all' && c.fraudLabel !== filters.fraudStatus) return false;
    if (filters.incidentType !== 'all' && c.AccidentArea !== filters.incidentType) return false;
    if (filters.incidentSeverity !== 'all' && c.Fault !== filters.incidentSeverity) return false;
    if (filters.gender !== 'all' && c.Sex !== filters.gender) return false;
    if (filters.policyState !== 'all' && c.BasePolicy !== filters.policyState) return false;
    if (filters.incidentState !== 'all' && c.Month !== filters.incidentState) return false;
    if (filters.vehicleCategory !== 'all' && c.VehicleCategory !== filters.vehicleCategory) return false;
    if (filters.ageGroup !== 'all' && c.ageGroup !== filters.ageGroup) return false;
    if (filters.claimAmountRange !== 'all') {
      const amt = getClaimAmount(c);
      if (filters.claimAmountRange === 'low' && amt >= 30000) return false;
      if (filters.claimAmountRange === 'mid' && (amt < 30000 || amt >= 60000)) return false;
      if (filters.claimAmountRange === 'high' && amt < 60000) return false;
    }
    if (filters.searchTerm) {
      const s = filters.searchTerm.toLowerCase();
      const hay = [
        String(c.PolicyNumber),
        c.Make,
        c.VehicleCategory,
        c.Sex,
        c.Fault,
        c.AccidentArea,
        c.PolicyType,
        c.fraudLabel,
        c.Month,
        c.MonthClaimed,
        String(c.Age),
      ].join(' ').toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
}

export function fraudDonutData(claims: Claim[]) {
  const fraud = claims.filter((c) => c.isFraud).length;
  const genuine = claims.length - fraud;
  return [
    { name: 'Genuine', value: genuine, color: '#1e6f5c' },
    { name: 'Fraud', value: fraud, color: '#c0392b' },
  ];
}

export function fraudByIncidentType(claims: Claim[]) {
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.AccidentArea || 'Unknown';
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return Array.from(groups.entries())
    .map(([name, g]) => ({
      name,
      fraudRate: g.total > 0 ? (g.fraud / g.total) * 100 : 0,
      fraud: g.fraud,
      total: g.total,
    }))
    .sort((a, b) => b.fraudRate - a.fraudRate);
}

export function fraudBySeverity(claims: Claim[]) {
  const groups = new Map<string, { fraud: number; genuine: number }>();
  for (const c of claims) {
    const key = c.Fault || 'Unknown';
    const g = groups.get(key) || { fraud: 0, genuine: 0 };
    if (c.isFraud) g.fraud++;
    else g.genuine++;
    groups.set(key, g);
  }
  return Array.from(groups.entries()).map(([name, g]) => ({
    name,
    Fraud: g.fraud,
    Genuine: g.genuine,
  }));
}

export function claimAmountByFraudStatus(claims: Claim[]) {
  const fraud = claims.filter((c) => c.isFraud);
  const genuine = claims.filter((c) => !c.isFraud);
  const fraudTotal = fraud.reduce((s, c) => s + getClaimAmount(c), 0);
  const genuineTotal = genuine.reduce((s, c) => s + getClaimAmount(c), 0);
  return [
    {
      name: 'Genuine',
      avgAmount: genuine.length > 0 ? Math.round(genuineTotal / genuine.length) : 0,
      totalAmount: Math.round(genuineTotal),
      count: genuine.length,
    },
    {
      name: 'Fraud',
      avgAmount: fraud.length > 0 ? Math.round(fraudTotal / fraud.length) : 0,
      totalAmount: Math.round(fraudTotal),
      count: fraud.length,
    },
  ];
}

export function fraudByPolicyCategory(claims: Claim[]) {
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.PolicyType || 'Unknown';
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return Array.from(groups.entries())
    .map(([name, g]) => ({
      name,
      fraud: g.fraud,
      genuine: g.total - g.fraud,
      total: g.total,
    }))
    .sort((a, b) => b.fraud - a.fraud);
}

export function fraudByVehicleMake(claims: Claim[]) {
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.Make || 'Unknown';
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return Array.from(groups.entries())
    .map(([name, g]) => ({
      name,
      fraud: g.fraud,
      genuine: g.total - g.fraud,
      fraudRate: g.total > 0 ? (g.fraud / g.total) * 100 : 0,
      total: g.total,
    }))
    .sort((a, b) => b.fraud - a.fraud)
    .slice(0, 15);
}

export function fraudByAgeGroup(claims: Claim[]) {
  const order = ['Under 25', '25–34', '35–44', '45–54', '55+'];
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.ageGroup;
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return order
    .filter((o) => groups.has(o))
    .map((name) => {
      const g = groups.get(name)!;
      return {
        name,
        fraud: g.fraud,
        genuine: g.total - g.fraud,
        fraudRate: g.total > 0 ? (g.fraud / g.total) * 100 : 0,
        total: g.total,
      };
    });
}

const MONTH_ORDER = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function claimTrendByMonth(claims: Claim[]) {
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.Month || 'Unknown';
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return MONTH_ORDER.filter((m) => groups.has(m)).map((name) => {
    const g = groups.get(name)!;
    return {
      name,
      total: g.total,
      fraud: g.fraud,
      fraudRate: g.total > 0 ? (g.fraud / g.total) * 100 : 0,
    };
  });
}

export function fraudByVehicleCategory(claims: Claim[]) {
  const groups = new Map<string, { total: number; fraud: number }>();
  for (const c of claims) {
    const key = c.VehicleCategory || 'Unknown';
    const g = groups.get(key) || { total: 0, fraud: 0 };
    g.total++;
    if (c.isFraud) g.fraud++;
    groups.set(key, g);
  }
  return Array.from(groups.entries())
    .map(([name, g]) => ({
      name,
      fraud: g.fraud,
      genuine: g.total - g.fraud,
      fraudRate: g.total > 0 ? (g.fraud / g.total) * 100 : 0,
      total: g.total,
    }))
    .sort((a, b) => b.fraud - a.fraud);
}

export interface RiskIndicator {
  label: string;
  value: string;
  fraudCount: number;
  totalCount: number;
  fraudRate: number;
  description: string;
}

export function computeRiskIndicators(claims: Claim[]): RiskIndicator[] {
  const indicators: RiskIndicator[] = [];
  const allFraud = claims.filter((c) => c.isFraud).length;
  const overallRate = claims.length > 0 ? (allFraud / claims.length) * 100 : 0;

  const push = (
    label: string,
    value: string,
    subset: Claim[],
    description: string
  ) => {
    const fraudCount = subset.filter((c) => c.isFraud).length;
    const totalCount = subset.length;
    const fraudRate = totalCount > 0 ? (fraudCount / totalCount) * 100 : 0;
    indicators.push({
      label,
      value,
      fraudCount,
      totalCount,
      fraudRate,
      description:
        fraudRate > overallRate
          ? `${description} This pattern is associated with higher fraud frequency in this dataset.`
          : description,
    });
  };

  push(
    'Fault: Policy Holder',
    'Policy Holder',
    claims.filter((c) => c.Fault === 'Policy Holder'),
    'Claims where the policy holder is at fault.'
  );
  push(
    'No Police Report Filed',
    'No',
    claims.filter((c) => c.PoliceReportFiled === 'No'),
    'Claims where no police report was filed.'
  );
  push(
    'Property Damage: No',
    'No',
    claims.filter((c) => c.AddressChange_Claim === 'no change'),
    'Claims with no address change at the time of claim.'
  );
  push(
    'No Witnesses Present',
    'No',
    claims.filter((c) => c.WitnessPresent === 'No'),
    'Claims where no witnesses were present.'
  );
  push(
    'Past Claims: 2 to 4',
    '2 to 4',
    claims.filter((c) => c.PastNumberOfClaims === '2 to 4'),
    'Claimants with 2 to 4 past claims.'
  );
  push(
    'Past Claims: More than 4',
    'more than 4',
    claims.filter((c) => c.PastNumberOfClaims === 'more than 4'),
    'Claimants with more than 4 past claims.'
  );
  push(
    'Vehicle Age: New',
    'new',
    claims.filter((c) => c.AgeOfVehicle === 'new'),
    'Claims involving new vehicles.'
  );
  push(
    'High Claim Amount (60K+)',
    '60000+',
    claims.filter((c) => getClaimAmount(c) >= 60000),
    'Claims with estimated claim amounts of 60,000 or higher.'
  );
  push(
    'Accident Area: Urban',
    'Urban',
    claims.filter((c) => c.AccidentArea === 'Urban'),
    'Claims from urban accident areas.'
  );
  push(
    'Base Policy: All Perils',
    'All Perils',
    claims.filter((c) => c.BasePolicy === 'All Perils'),
    'Claims under the All Perils base policy.'
  );
  push(
    'Days Policy Accident: 1 to 7',
    '1 to 7',
    claims.filter((c) => c.Days_Policy_Accident === '1 to 7'),
    'Accidents occurring within 1-7 days of policy start.'
  );

  return indicators.sort((a, b) => b.fraudRate - a.fraudRate);
}
