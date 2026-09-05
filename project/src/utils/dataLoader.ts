import Papa from 'papaparse';
import type { Claim, RawClaim } from '@/types';

const DATASET_URL = `${import.meta.env.BASE_URL}data/fraud_oracle.csv`;

export function getAgeGroup(age: number): string {
  if (age < 25) return 'Under 25';
  if (age <= 34) return '25–34';
  if (age <= 44) return '35–44';
  if (age <= 54) return '45–54';
  return '55+';
}

export function getVehiclePriceNumeric(priceRange: string): number {
  const text = (priceRange || '').toLowerCase();
  if (text.includes('less than 20000')) return 15000;
  if (text.includes('20000 to 29000')) return 25000;
  if (text.includes('30000 to 39000')) return 35000;
  if (text.includes('40000 to 59000')) return 50000;
  if (text.includes('60000 to 69000')) return 65000;
  if (text.includes('more than 69000')) return 75000;
  return 0;
}

export function getClaimAmount(claim: RawClaim): number {
  const baseAmount = getVehiclePriceNumeric(claim.VehiclePrice);
  return baseAmount + (claim.Deductible || 0);
}

export async function loadClaims(): Promise<Claim[]> {
  const response = await fetch(DATASET_URL);
  if (!response.ok) {
    throw new Error(`Failed to load dataset: ${response.status}`);
  }
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<RawClaim>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const claims: Claim[] = [];
        for (const row of result.data) {
          if (!row || typeof row !== 'object') continue;
          const r = row as unknown as Record<string, unknown>;
          const policyNumber = Number(r.PolicyNumber);
          if (!Number.isFinite(policyNumber) || policyNumber <= 0) continue;
          const fraudRaw = Number(r.FraudFound_P);
          if (!Number.isFinite(fraudRaw)) continue;
          const age = Number(r.Age);
          const cleanAge = Number.isFinite(age) && age > 0 ? age : 0;
          const raw = row as unknown as RawClaim;
          claims.push({
            ...raw,
            Age: cleanAge,
            FraudFound_P: fraudRaw,
            Deductible: Number(r.Deductible) || 0,
            DriverRating: Number(r.DriverRating) || 0,
            WeekOfMonth: Number(r.WeekOfMonth) || 0,
            WeekOfMonthClaimed: Number(r.WeekOfMonthClaimed) || 0,
            RepNumber: Number(r.RepNumber) || 0,
            Year: Number(r.Year) || 0,
            isFraud: fraudRaw === 1,
            fraudLabel: fraudRaw === 1 ? 'Fraud' : 'Genuine',
            ageGroup: getAgeGroup(cleanAge),
            vehiclePriceRange: String(r.VehiclePrice || 'Unknown'),
          });
        }
        resolve(claims);
      },
      error: (err: Error) => reject(err),
    });
  });
}
