export type RiskLevel = 'low' | 'medium' | 'high';

export type TransactionType = 
  | 'salary' 
  | 'transfer' 
  | 'invoice' 
  | 'allowance' 
  | 'bonus' 
  | 'dividend' 
  | 'loan' 
  | 'gift' 
  | 'reimbursement' 
  | 'miscellaneous';

export interface TaxImplication {
  type: 'PAYE' | 'CIT' | 'WHT' | 'None';
  applicable: boolean;
  note: string;
}

export interface NarrationOption {
  id: string;
  name: string;
  description: string;
  explanation: string;
  riskLevel: RiskLevel;
  taxImplications: TaxImplication[];
  penaltyWarning?: string;
  documentationRequired: string[];
}

export interface NarrationLog {
  narrationId: string;
  narrationName: string;
  amount: number;
  transactionType: TransactionType;
  riskLevel: RiskLevel;
  timestamp: Date;
  mode: 'secure' | 'secure-plus';
  acknowledged: boolean;
}

export const NARRATION_OPTIONS: NarrationOption[] = [
  {
    id: 'salary',
    name: 'Salary / Wages',
    description: 'Regular employment income',
    explanation: 'Salary is treated as taxable income and usually attracts PAYE deductions. Employers are required to deduct and remit PAYE on behalf of employees.',
    riskLevel: 'low',
    taxImplications: [
      { type: 'PAYE', applicable: true, note: 'Standard PAYE rates apply' },
      { type: 'CIT', applicable: false, note: 'Not applicable to individuals' },
    ],
    documentationRequired: ['Employment contract', 'Payslip'],
  },
  {
    id: 'business-income',
    name: 'Business Income',
    description: 'Revenue from trade or services',
    explanation: 'Business income is subject to taxation based on the entity type. Companies pay CIT while sole proprietors may be taxed under personal income tax.',
    riskLevel: 'medium',
    taxImplications: [
      { type: 'CIT', applicable: true, note: 'Company Income Tax may apply' },
      { type: 'WHT', applicable: true, note: 'Withholding tax on certain payments' },
    ],
    penaltyWarning: 'Misclassification may result in back taxes and penalties',
    documentationRequired: ['Invoice', 'Business registration', 'Tax identification'],
  },
  {
    id: 'family-gift',
    name: 'Family Support / Gift',
    description: 'Transfers between family members',
    explanation: 'Genuine gifts between family members are generally not taxable. However, regular or large transfers may attract scrutiny to determine if they constitute disguised income.',
    riskLevel: 'medium',
    taxImplications: [
      { type: 'None', applicable: true, note: 'Generally not taxable if genuine' },
    ],
    penaltyWarning: 'Regular "gifts" may be reclassified as taxable income',
    documentationRequired: ['Gift declaration (recommended)', 'Family relationship proof'],
  },
  {
    id: 'loan',
    name: 'Loan',
    description: 'Borrowed funds to be repaid',
    explanation: 'Loan receipts are not income and therefore not taxable. However, proper documentation is essential to distinguish loans from income.',
    riskLevel: 'medium',
    taxImplications: [
      { type: 'None', applicable: true, note: 'Not taxable if properly documented' },
    ],
    penaltyWarning: 'Undocumented loans may be treated as taxable income',
    documentationRequired: ['Loan agreement', 'Repayment schedule', 'Evidence of repayment'],
  },
  {
    id: 'reimbursement',
    name: 'Reimbursement',
    description: 'Refund of expenses incurred',
    explanation: 'Reimbursements for legitimate business expenses are not taxable income. They must be supported by receipts and expense claims.',
    riskLevel: 'low',
    taxImplications: [
      { type: 'None', applicable: true, note: 'Not taxable with proper documentation' },
    ],
    documentationRequired: ['Original receipts', 'Expense claim form', 'Approval evidence'],
  },
  {
    id: 'allowance',
    name: 'Allowance / Bonus',
    description: 'Additional employment benefits',
    explanation: 'Allowances and bonuses are typically treated as part of taxable employment income. Some allowances may have specific tax treatments.',
    riskLevel: 'low',
    taxImplications: [
      { type: 'PAYE', applicable: true, note: 'Usually taxable as employment income' },
    ],
    documentationRequired: ['Payslip', 'Allowance letter'],
  },
  {
    id: 'dividend',
    name: 'Dividend',
    description: 'Distribution from company profits',
    explanation: 'Dividends are subject to withholding tax at source. Companies are required to deduct and remit WHT before distributing dividends.',
    riskLevel: 'low',
    taxImplications: [
      { type: 'WHT', applicable: true, note: '10% withholding tax applies' },
    ],
    documentationRequired: ['Dividend warrant', 'WHT receipt'],
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Other transaction types',
    explanation: 'Miscellaneous narrations may attract additional scrutiny as they lack specificity. Tax treatment depends on the actual nature of the transaction.',
    riskLevel: 'high',
    taxImplications: [
      { type: 'PAYE', applicable: false, note: 'Depends on actual nature' },
      { type: 'CIT', applicable: false, note: 'Depends on actual nature' },
    ],
    penaltyWarning: 'Vague narrations increase audit risk and may lead to unfavorable tax treatment',
    documentationRequired: ['Supporting documents specific to transaction'],
  },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'salary', label: 'Salary Payment' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'invoice', label: 'Invoice Payment' },
  { value: 'allowance', label: 'Allowance' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'dividend', label: 'Dividend' },
  { value: 'loan', label: 'Loan' },
  { value: 'gift', label: 'Gift' },
  { value: 'reimbursement', label: 'Reimbursement' },
  { value: 'miscellaneous', label: 'Other' },
];
