import { UserMode, AccountType } from './tax';

export type PaymentMethod = 'card' | 'transfer' | 'ussd' | 'debit';
export type PaymentPlan = 'full' | 'quarterly' | 'monthly';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

// Subscription Pricing
export interface SubscriptionPricing {
  individual: Record<Exclude<UserMode, 'lite'>, number>;
  business: Record<Exclude<UserMode, 'lite'>, number>;
}

export const SUBSCRIPTION_PRICING: SubscriptionPricing = {
  individual: {
    'secure': 5000,
    'secure-plus': 15000,
  },
  business: {
    'secure': 50000,
    'secure-plus': 250000,
  },
};

// Subscription Receipt
export interface SubscriptionReceipt {
  transactionRef: string;
  date: string;
  amount: number;
  mode: UserMode;
  method: PaymentMethod;
  userType: 'individual' | 'business';
}

// Tax Receipt
export interface TaxReceipt {
  nrsReceiptNo: string;
  tin: string;
  taxYear: number;
  taxType: 'PAYE' | 'CIT';
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  taxpayerName: string;
}

// Payment History Item
export interface PaymentHistoryItem {
  id: string;
  type: 'subscription' | 'tax';
  amount: number;
  date: string;
  status: PaymentStatus;
  receipt: SubscriptionReceipt | TaxReceipt;
}

// Tax Breakdown
export interface TaxBreakdown {
  grossIncome: number;
  pensionDeduction: number;
  rentRelief: number;
  taxableIncome: number;
  taxAmount: number;
}

// Payment State
export interface PaymentState {
  // Subscription
  showSubscriptionModal: boolean;
  targetMode: Exclude<UserMode, 'lite'>;
  subscriptionMethod: PaymentMethod;
  subscriptionProcessing: boolean;
  subscriptionSuccess: boolean;
  subscriptionReceipt: SubscriptionReceipt | null;

  // Tax Payment
  showTaxPaymentModal: boolean;
  taxAmount: number;
  taxPaymentPlan: PaymentPlan;
  taxPaymentMethod: PaymentMethod;
  taxProcessing: boolean;
  taxSuccess: boolean;
  taxConsentGiven: boolean;
  taxReceipt: TaxReceipt | null;
  taxBreakdown: TaxBreakdown | null;

  // General
  paymentHistory: PaymentHistoryItem[];
  taxPaidFor2026: boolean;
}

// Helper functions
export function getSubscriptionPrice(
  accountType: AccountType,
  mode: Exclude<UserMode, 'lite'>
): number {
  const isBusinessAccount = accountType !== 'individual';
  const pricing = isBusinessAccount ? SUBSCRIPTION_PRICING.business : SUBSCRIPTION_PRICING.individual;
  return pricing[mode];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

export function generateTransactionRef(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

export function generateNRSReceiptNo(): string {
  return `NRS-2026-${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
