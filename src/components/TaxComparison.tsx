import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaxComparisonProps {
  income: number;
  className?: string;
}

// Nigeria PAYE Tax Bands 2025
function calculateTax2025(income: number): number {
  const bands = [
    { limit: 300000, rate: 0.07 },
    { limit: 600000, rate: 0.11 },
    { limit: 1100000, rate: 0.15 },
    { limit: 1600000, rate: 0.19 },
    { limit: 3200000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 },
  ];

  let tax = 0;
  let remaining = income;
  let previousLimit = 0;

  for (const band of bands) {
    const taxableInBand = Math.min(remaining, band.limit - previousLimit);
    if (taxableInBand <= 0) break;
    tax += taxableInBand * band.rate;
    remaining -= taxableInBand;
    previousLimit = band.limit;
  }

  return tax;
}

// Nigeria PAYE Tax Bands 2026 (New Law - Progressive)
function calculateTax2026(income: number): number {
  // Increased exemption threshold and adjusted bands
  if (income <= 800000) return 0; // Increased exemption
  
  const taxableIncome = income - 800000;
  const bands = [
    { limit: 300000, rate: 0.05 },
    { limit: 600000, rate: 0.08 },
    { limit: 1100000, rate: 0.12 },
    { limit: 1600000, rate: 0.16 },
    { limit: 3200000, rate: 0.19 },
    { limit: Infinity, rate: 0.22 },
  ];

  let tax = 0;
  let remaining = taxableIncome;
  let previousLimit = 0;

  for (const band of bands) {
    const taxableInBand = Math.min(remaining, band.limit - previousLimit);
    if (taxableInBand <= 0) break;
    tax += taxableInBand * band.rate;
    remaining -= taxableInBand;
    previousLimit = band.limit;
  }

  return tax;
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TaxComparison({ income, className }: TaxComparisonProps) {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  
  const tax2025 = calculateTax2025(income);
  const tax2026 = calculateTax2026(income);
  const savings = tax2025 - tax2026;
  const savingsPercent = tax2025 > 0 ? ((savings / tax2025) * 100).toFixed(1) : '0';

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = savings / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= savings) {
        setAnimatedSavings(savings);
        clearInterval(timer);
      } else {
        setAnimatedSavings(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [savings]);

  const maxTax = Math.max(tax2025, tax2026);
  const bar2025Width = maxTax > 0 ? (tax2025 / maxTax) * 100 : 0;
  const bar2026Width = maxTax > 0 ? (tax2026 / maxTax) * 100 : 0;

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-success" />
          2025 vs 2026 Tax Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comparison Bars */}
        <div className="space-y-4">
          {/* 2025 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax Year 2025</span>
              <span className="font-semibold text-foreground">{formatNaira(tax2025)}</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/70 transition-all duration-700 ease-out"
                style={{ width: `${bar2025Width}%` }}
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
          </div>

          {/* 2026 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax Year 2026 (New Law)</span>
              <span className="font-semibold text-success">{formatNaira(tax2026)}</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-success transition-all duration-700 ease-out"
                style={{ width: `${bar2026Width}%` }}
              />
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        {savings > 0 && (
          <div className="rounded-xl bg-success/10 border border-success/20 p-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Your Annual Savings</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {formatNaira(animatedSavings)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Reduction</p>
                <p className="text-xl font-semibold text-success">{savingsPercent}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { calculateTax2025, calculateTax2026, formatNaira };
