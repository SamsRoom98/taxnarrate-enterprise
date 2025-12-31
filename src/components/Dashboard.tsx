import { useTax } from '@/contexts/TaxContext';
import { ModeBadge } from '@/components/ModeBadge';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { ComplianceCard } from '@/components/ComplianceCard';
import { TaxCalculator } from '@/components/TaxCalculator';
import { TaxComparison } from '@/components/TaxComparison';
import { FeatureCard } from '@/components/FeatureCard';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  Building2, 
  FileText, 
  History, 
  Home, 
  Receipt,
  Shield,
  Sparkles,
  Users
} from 'lucide-react';

export function Dashboard() {
  const { userProfile, complianceStatus, updateTaxMode, updateMode } = useTax();

  const readinessScore = complianceStatus.overallScore;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Tax<span className="text-success">Narrate</span>
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeBadge mode={userProfile.mode} />
            {userProfile.mode === 'lite' && (
              <Button variant="upgrade" size="sm" onClick={() => updateMode('secure')}>
                <Shield className="h-4 w-4 mr-2" />
                Upgrade to Secure
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Law Readiness Banner */}
        <Card variant="elevated" className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="success" className="bg-success/20 text-success-foreground border-success/30">
                    Live Update
                  </Badge>
                  <span className="text-sm text-primary-foreground/80">January 1, 2026</span>
                </div>
                <h2 className="text-2xl font-bold">2026 Law Readiness Status</h2>
                <p className="text-primary-foreground/80 mt-1">
                  Your compliance readiness score for Nigeria's new tax regulations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-4xl font-bold">{readinessScore}%</p>
                  <p className="text-sm text-primary-foreground/80">Ready</p>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-primary-foreground/20 flex items-center justify-center">
                  <div 
                    className="h-12 w-12 rounded-full bg-success flex items-center justify-center"
                    style={{
                      background: `conic-gradient(hsl(var(--success)) ${readinessScore}%, transparent ${readinessScore}%)`
                    }}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-success transition-all duration-1000 ease-out"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <ModeSwitcher 
            mode={userProfile.taxMode} 
            onChange={updateTaxMode}
          />
        </div>

        {/* Enterprise Banner for Corporate */}
        {userProfile.accountType === 'corporate' && userProfile.mode !== 'secure-plus' && (
          <div className="mb-8 rounded-xl bg-gradient-to-r from-premium/20 via-premium/10 to-transparent border border-premium/30 p-4 animate-fade-up">
            <div className="flex items-center justify-between gap-4">
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
              <Button variant="premium" size="sm" onClick={() => updateMode('secure-plus')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Secure+
              </Button>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tax Calculator */}
            <TaxCalculator />

            {/* Tax Comparison */}
            <TaxComparison income={2500000} />

            {/* Personal Features */}
            {userProfile.taxMode === 'personal' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  title="Rent Relief Calculator"
                  description="Calculate your housing allowance deduction"
                  requiredMode="secure"
                  value="₦500,000 max cap"
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
            <ComplianceCard status={complianceStatus} />

            {/* Upgrade Prompt */}
            {userProfile.mode === 'lite' && (
              <UpgradePrompt targetMode="secure" />
            )}

            {userProfile.mode === 'secure' && (
              <UpgradePrompt targetMode="secure-plus" />
            )}

            {/* Quick Actions */}
            <Card variant="elevated">
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

        {/* Risk Warning Banner */}
        {userProfile.mode !== 'secure-plus' && (
          <div className="mt-8">
            <UpgradePrompt targetMode="secure-plus" variant="banner" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                © 2024 Simplex Business Solutions. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
