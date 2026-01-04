import { useTax } from '@/contexts/TaxContext';
import { usePayment } from '@/contexts/PaymentContext';
import { Header } from '@/components/Header';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { ComplianceCard } from '@/components/ComplianceCard';
import { TaxCalculator } from '@/components/TaxCalculator';
import { TaxComparison } from '@/components/TaxComparison';
import { FeatureCard } from '@/components/FeatureCard';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { ReadinessBanner } from '@/components/ReadinessBanner';
import { StatCard } from '@/components/StatCard';
import { NarrationAssistant } from '@/components/narration/NarrationAssistant';
import { TaxPaymentCard } from '@/components/payment/TaxPaymentCard';
import { UpgradeCTABanner } from '@/components/payment/UpgradeCTABanner';
import { PaymentHistoryCard } from '@/components/payment/PaymentHistoryCard';
import { TaxClearanceCard } from '@/components/payment/TaxClearanceCard';
import { OverdueTaxChecker } from '@/components/payment/OverdueTaxChecker';
import { EmployeePayrollCard } from '@/components/payroll/EmployeePayrollCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  Building2, 
  FileText, 
  Receipt,
  Sparkles,
  Users,
  TrendingDown,
  Wallet,
  Percent
} from 'lucide-react';

export function Dashboard() {
  const { userProfile, complianceStatus, updateTaxMode } = useTax();
  const { openSubscriptionModal, paymentState } = usePayment();

  const readinessScore = paymentState.taxPaidFor2026 ? 100 : complianceStatus.overallScore;
  const isBusinessTax = userProfile.taxMode === 'business';

  // Sample tax breakdown for the payment card
  const sampleIncome = 2500000;
  const pensionDeduction = Math.round(sampleIncome * 0.08);
  const rentRelief = 500000;
  const taxableIncome = sampleIncome - pensionDeduction - rentRelief;
  const taxAmount = 344000; // Calculated tax

  const taxBreakdown = {
    grossIncome: sampleIncome,
    pensionDeduction,
    rentRelief: isBusinessTax ? 0 : rentRelief,
    taxableIncome,
    taxAmount,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Law Readiness Banner */}
        <ReadinessBanner score={readinessScore} className="mb-8 animate-fade-up" />

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8 animate-fade-up delay-100">
          <ModeSwitcher 
            mode={userProfile.taxMode} 
            onChange={updateTaxMode}
          />
        </div>

        {/* Enterprise Banner for Corporate */}
        {userProfile.accountType === 'corporate' && userProfile.mode !== 'secure-plus' && (
          <div className="mb-8 rounded-xl bg-gradient-to-r from-premium/20 via-premium/10 to-transparent border border-premium/30 p-4 animate-fade-up delay-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-premium/20">
                  <Building2 className="h-5 w-5 text-premium" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Enterprise Features Required</p>
                  <p className="text-sm text-muted-foreground">
                    Corporate accounts need Secure+ for full compliance capabilities
                  </p>
                </div>
              </div>
              <Button variant="premium" size="sm" onClick={() => openSubscriptionModal('secure-plus')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Secure+
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Estimated Savings"
            value={156000}
            prefix="₦"
            icon={TrendingDown}
            trend={{ value: 23, label: 'vs 2025', isPositive: true }}
            variant="success"
            className="animate-fade-up delay-100"
          />
          <StatCard
            title="Annual Tax (2026)"
            value={taxAmount}
            prefix="₦"
            icon={Wallet}
            variant="default"
            className="animate-fade-up delay-200"
          />
          <StatCard
            title="Effective Rate"
            value={13.8}
            suffix="%"
            icon={Percent}
            trend={{ value: 2.4, label: 'reduction', isPositive: true }}
            variant="default"
            className="animate-fade-up delay-300"
          />
          <StatCard
            title="Compliance Score"
            value={readinessScore}
            suffix="%"
            icon={Receipt}
            variant={readinessScore >= 80 ? 'success' : 'warning'}
            className="animate-fade-up delay-400"
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tax Calculator */}
            <TaxCalculator className="animate-fade-up" />

            {/* Tax Payment Card */}
            <TaxPaymentCard 
              taxAmount={taxAmount} 
              taxBreakdown={taxBreakdown}
              className="animate-fade-up delay-100"
            />

            {/* Narration Assistant - Secure/Secure+ only */}
            <NarrationAssistant className="animate-fade-up delay-200" />

            {/* Employee Payroll - Business only */}
            <EmployeePayrollCard className="animate-fade-up delay-250" />

            {/* Tax Comparison */}
            <TaxComparison income={sampleIncome} className="animate-fade-up delay-300" />

            {/* Personal Features */}
            {userProfile.taxMode === 'personal' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  title="Rent Relief Calculator"
                  description="Calculate your housing allowance deduction"
                  requiredMode="secure"
                  value="₦500,000 max cap"
                  className="animate-fade-up delay-400"
                >
                  <p className="text-sm text-muted-foreground">
                    Up to ₦500,000 annual rent relief under 2026 law
                  </p>
                </FeatureCard>

                <FeatureCard
                  title="Multi-Year History"
                  description="Track your PAYE across years"
                  requiredMode="secure-plus"
                  isPremium
                  className="animate-fade-up delay-500"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">2024</span>
                      <span className="font-medium">₦425,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">2025</span>
                      <span className="font-medium">₦468,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-success">2026</span>
                      <span className="font-medium text-success">₦312,000</span>
                    </div>
                  </div>
                </FeatureCard>
              </div>
            )}

            {/* Business Features */}
            {userProfile.taxMode === 'business' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  title="E-Invoice Generator"
                  description="Generate compliant e-invoices with QR codes"
                  requiredMode="secure"
                  className="animate-fade-up delay-300"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Required for 2026</p>
                      <p className="font-medium">E-Invoicing compliance</p>
                    </div>
                  </div>
                </FeatureCard>

                <FeatureCard
                  title="Audit-Ready Reports"
                  description="Downloadable compliance reports"
                  requiredMode="secure-plus"
                  isPremium
                  className="animate-fade-up delay-400"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full audit trail</p>
                      <p className="font-medium">Compliance logs</p>
                    </div>
                  </div>
                </FeatureCard>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Compliance Status */}
            <ComplianceCard status={complianceStatus} className="animate-fade-up" />

            {/* Overdue Tax Checker - Secure/Secure+ only */}
            {userProfile.mode !== 'lite' && (
              <OverdueTaxChecker className="animate-fade-up delay-100" />
            )}

            {/* Tax Clearance Certificate - Secure+ only */}
            <TaxClearanceCard className="animate-fade-up delay-200" />

            {/* Payment History - Secure+ only */}
            <PaymentHistoryCard className="animate-fade-up delay-300" />

            {/* Upgrade Prompt */}
            {userProfile.mode === 'lite' && (
              <UpgradePrompt targetMode="secure" className="animate-fade-up delay-400" />
            )}

            {userProfile.mode === 'secure' && (
              <UpgradePrompt targetMode="secure-plus" className="animate-fade-up delay-400" />
            )}

            {/* Quick Actions */}
            <Card variant="elevated" className="animate-fade-up delay-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between" disabled={userProfile.mode === 'lite'}>
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download Tax Summary
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" disabled={userProfile.mode === 'lite'}>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Verify Identity
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upgrade CTA Banner */}
        {userProfile.mode !== 'secure-plus' && (
          <div className="mt-8 animate-fade-up">
            <UpgradeCTABanner />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TN</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">TaxNarrate</p>
                <p className="text-xs text-muted-foreground">
                  by Simplex Business Solutions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Simplex Business Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
