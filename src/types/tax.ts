export type UserMode = 'lite' | 'secure' | 'secure-plus';

export type AccountType = 'individual' | 'small-business' | 'mid-size' | 'corporate';

export type TaxMode = 'personal' | 'business';

export interface UserProfile {
  accountType: AccountType;
  mode: UserMode;
  taxMode: TaxMode;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
}

export interface TaxCalculation {
  income: number;
  tax2025: number;
  tax2026: number;
  savings: number;
  rentRelief: number;
  effectiveRate: number;
}

export interface ComplianceStatus {
  nrsTaxId: boolean;
  eInvoicing: boolean;
  payeStatus: 'ready' | 'at-risk' | 'pending';
  overallScore: number;
}

export interface FeatureAccess {
  id: string;
  name: string;
  description: string;
  requiredMode: UserMode;
  isLocked: boolean;
}
