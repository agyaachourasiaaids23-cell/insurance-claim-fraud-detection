export interface RawClaim {
  Month: string;
  WeekOfMonth: number;
  DayOfWeek: string;
  Make: string;
  AccidentArea: string;
  DayOfWeekClaimed: string;
  MonthClaimed: string;
  WeekOfMonthClaimed: number;
  Sex: string;
  MaritalStatus: string;
  Age: number;
  Fault: string;
  PolicyType: string;
  VehicleCategory: string;
  VehiclePrice: string;
  FraudFound_P: number;
  PolicyNumber: number;
  RepNumber: number;
  Deductible: number;
  DriverRating: number;
  Days_Policy_Accident: string;
  Days_Policy_Claim: string;
  PastNumberOfClaims: string;
  AgeOfVehicle: string;
  AgeOfPolicyHolder: string;
  PoliceReportFiled: string;
  WitnessPresent: string;
  AgentType: string;
  NumberOfSuppliments: string;
  AddressChange_Claim: string;
  NumberOfCars: string;
  Year: number;
  BasePolicy: string;
}

export type Claim = RawClaim & {
  isFraud: boolean;
  ageGroup: string;
  fraudLabel: string;
  vehiclePriceRange: string;
};

export interface KPIData {
  totalClaims: number;
  fraudulentClaims: number;
  genuineClaims: number;
  fraudRate: number;
  totalDeductible: number;
  avgDeductible: number;
  totalClaimAmount: number;
  avgClaimAmount: number;
}

export interface Filters {
  fraudStatus: string;
  incidentType: string;
  incidentSeverity: string;
  gender: string;
  policyState: string;
  incidentState: string;
  vehicleCategory: string;
  ageGroup: string;
  claimAmountRange: string;
  searchTerm: string;
}

export interface FilterState {
  fraudStatus: string;
  incidentType: string;
  incidentSeverity: string;
  gender: string;
  policyState: string;
  incidentState: string;
  vehicleCategory: string;
  ageGroup: string;
  claimAmountRange: string;
}
