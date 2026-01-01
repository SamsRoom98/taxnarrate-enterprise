import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, Wallet, Banknote } from 'lucide-react';
import { formatNaira, calculateTax2025, calculateTax2026 } from './TaxComparison';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

interface TaxCalculatorProps {
  className?: string;
  onCalculate?: (result: TaxResult) => void;
}

interface TaxResult {
  income: number;
  tax2025: number;
  tax2026: number;
  savings: number;
  effectiveRate: number;
}

const PRESET_AMOUNTS = [
  { label: '₦1M', value: 1000000 },
  { label: '₦2.5M', value: 2500000 },
  { label: '₦5M', value: 5000000 },
  { label: '₦10M', value: 10000000 },
  { label: '₦25M', value: 25000000 },
  { label: '₦50M', value: 50000000 },
];

export function TaxCalculator({ className, onCalculate }: TaxCalculatorProps) {
  const { userProfile } = useTax();
  const [income, setIncome] = useState<string>('2,500,000');
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = (incomeValue?: number) => {
    const value = incomeValue ?? (parseFloat(income.replace(/,/g, '')) || 0);
    const tax2025 = calculateTax2025(value);
    const tax2026 = calculateTax2026(value);
    
    const calculatedResult = {
      income: value,
      tax2025,
      tax2026,
      savings: tax2025 - tax2026,
      effectiveRate: value > 0 ? (tax2026 / value) * 100 : 0,
    };
    
    setResult(calculatedResult);
    onCalculate?.(calculatedResult);
  };

  const handlePresetClick = (value: number) => {
    setIncome(value.toLocaleString());
    handleCalculate(value);
  };

  const formatInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num ? parseInt(num).toLocaleString() : '';
  };

  // Auto-calculate on mount
  useEffect(() => {
    handleCalculate();
  }, []);

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {userProfile.taxMode === 'personal' ? 'PAYE Tax Calculator' : 'Business Tax Estimator'}
        </CardTitle>
        <CardDescription>
          Enter your {userProfile.taxMode === 'personal' ? 'annual gross income' : 'annual turnover'} to estimate your 2026 tax
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Amount Entry */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income" className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              {userProfile.taxMode === 'personal' ? 'Annual Gross Income' : 'Annual Turnover'}
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-lg">
                ₦
              </span>
              <Input
                id="income"
                value={income}
                onChange={(e) => setIncome(formatInput(e.target.value))}
                className="pl-10 text-xl font-bold h-14 bg-muted/30 border-2 focus:border-primary transition-colors"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Preset Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <Banknote className="h-3 w-3" />
              Quick Select
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset.value)}
                  className={cn(
                    "text-xs font-medium transition-all",
                    parseFloat(income.replace(/,/g, '')) === preset.value && 
                    "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={() => handleCalculate()} className="w-full" size="lg">
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