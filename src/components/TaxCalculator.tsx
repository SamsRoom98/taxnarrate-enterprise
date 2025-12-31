import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp } from 'lucide-react';
import { formatNaira, calculateTax2025, calculateTax2026 } from './TaxComparison';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

interface TaxCalculatorProps {
  className?: string;
}

export function TaxCalculator({ className }: TaxCalculatorProps) {
  const { userProfile } = useTax();
  const [income, setIncome] = useState<string>('2500000');
  const [result, setResult] = useState<{
    tax2025: number;
    tax2026: number;
    savings: number;
    effectiveRate: number;
  } | null>(null);

  const handleCalculate = () => {
    const incomeValue = parseFloat(income.replace(/,/g, '')) || 0;
    const tax2025 = calculateTax2025(incomeValue);
    const tax2026 = calculateTax2026(incomeValue);
    
    setResult({
      tax2025,
      tax2026,
      savings: tax2025 - tax2026,
      effectiveRate: incomeValue > 0 ? (tax2026 / incomeValue) * 100 : 0,
    });
  };

  const formatInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num ? parseInt(num).toLocaleString() : '';
  };

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {userProfile.taxMode === 'personal' ? 'PAYE Tax Calculator' : 'Business Tax Estimator'}
        </CardTitle>
        <CardDescription>
          Estimate your tax under the 2026 Nigerian Tax Law
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="income" className="text-sm font-medium">
            {userProfile.taxMode === 'personal' ? 'Annual Gross Income' : 'Annual Turnover'}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₦
            </span>
            <Input
              id="income"
              value={income}
              onChange={(e) => setIncome(formatInput(e.target.value))}
              className="pl-8 text-lg font-medium h-12"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full" size="lg">
          <TrendingUp className="h-4 w-4 mr-2" />
          Calculate Tax Estimate
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t border-border animate-fade-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">2025 Tax</p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {formatNaira(result.tax2025)}
                </p>
              </div>
              <div className="rounded-lg bg-success/10 p-4">
                <p className="text-sm text-success">2026 Tax</p>
                <p className="text-xl font-bold text-success mt-1">
                  {formatNaira(result.tax2026)}
                </p>
              </div>
            </div>

            {result.savings > 0 && (
              <div className="rounded-xl bg-gradient-to-r from-success/20 to-success/5 border border-success/30 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-success">Estimated Savings</p>
                    <p className="text-2xl font-bold text-success">{formatNaira(result.savings)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Effective Rate</p>
                    <p className="text-lg font-semibold text-foreground">
                      {result.effectiveRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userProfile.mode === 'lite' && (
              <p className="text-xs text-center text-muted-foreground italic">
                Estimate Only • Upgrade for detailed breakdown
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
