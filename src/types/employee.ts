export interface Employee {
  id: string;
  name: string;
  email: string;
  tin: string;
  monthlyGross: number;
  monthlyTax: number;
  annualTax: number;
  selected: boolean;
  status: 'active' | 'inactive';
  dateAdded: string;
}

export interface PayrollState {
  employees: Employee[];
  showAddModal: boolean;
  showPaymentModal: boolean;
  paymentMode: 'bulk' | 'individual';
  selectedEmployees: string[];
  totalPayrollTax: number;
  processingPayroll: boolean;
  payrollSuccess: boolean;
}

export function calculateEmployeeTax(monthlyGross: number): { monthlyTax: number; annualTax: number } {
  const annualGross = monthlyGross * 12;
  const pension = annualGross * 0.08;
  const taxableIncome = annualGross - pension;
  
  // 2026 PAYE bands
  let tax = 0;
  let remaining = taxableIncome;
  
  const bands = [
    { limit: 300000, rate: 0.07 },
    { limit: 300000, rate: 0.11 },
    { limit: 500000, rate: 0.15 },
    { limit: 500000, rate: 0.19 },
    { limit: 1600000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 },
  ];
  
  for (const band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.limit);
    tax += taxable * band.rate;
    remaining -= taxable;
  }
  
  return {
    monthlyTax: Math.round(tax / 12),
    annualTax: Math.round(tax),
  };
}

export function generateEmployeeId(): string {
  return `EMP-${Date.now().toString(36).toUpperCase()}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}
