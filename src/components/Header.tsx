import { useState } from 'react';
import { ModeBadge } from '@/components/ModeBadge';
import { HeaderNavLink } from '@/components/HeaderNavLink';
import { Button } from '@/components/ui/button';
import { useTax } from '@/contexts/TaxContext';
import { 
  Home, 
  FileText, 
  History, 
  Shield, 
  Menu,
  X,
  Settings,
  HelpCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = 'dashboard' | 'reports' | 'history' | 'settings';

export function Header() {
  const { userProfile, updateMode } = useTax();
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-bold text-sm">TN</span>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
                Tax<span className="text-success">Narrate</span>
              </h1>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <HeaderNavLink
                icon={Home}
                label="Dashboard"
                active={activeNav === 'dashboard'}
                onClick={() => setActiveNav('dashboard')}
              />
              <HeaderNavLink
                icon={FileText}
                label="Reports"
                active={activeNav === 'reports'}
                onClick={() => setActiveNav('reports')}
                badge={userProfile.mode !== 'lite' ? 2 : undefined}
              />
              <HeaderNavLink
                icon={History}
                label="History"
                active={activeNav === 'history'}
                onClick={() => setActiveNav('history')}
              />
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications - Only for non-lite */}
            {userProfile.mode !== 'lite' && (
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
              </Button>
            )}

            {/* Help */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <HelpCircle className="h-4 w-4" />
            </Button>

            {/* Mode Badge */}
            <ModeBadge mode={userProfile.mode} />

            {/* Upgrade Button */}
            {userProfile.mode === 'lite' && (
              <Button 
                variant="upgrade" 
                size="sm" 
                onClick={() => updateMode('secure')}
                className="hidden sm:inline-flex"
              >
                <Shield className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden border-t border-border bg-card overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container mx-auto px-4 py-3 space-y-1">
          <HeaderNavLink
            icon={Home}
            label="Dashboard"
            active={activeNav === 'dashboard'}
            onClick={() => {
              setActiveNav('dashboard');
              setMobileMenuOpen(false);
            }}
          />
          <HeaderNavLink
            icon={FileText}
            label="Reports"
            active={activeNav === 'reports'}
            onClick={() => {
              setActiveNav('reports');
              setMobileMenuOpen(false);
            }}
          />
          <HeaderNavLink
            icon={History}
            label="History"
            active={activeNav === 'history'}
            onClick={() => {
              setActiveNav('history');
              setMobileMenuOpen(false);
            }}
          />
          <HeaderNavLink
            icon={Settings}
            label="Settings"
            active={activeNav === 'settings'}
            onClick={() => {
              setActiveNav('settings');
              setMobileMenuOpen(false);
            }}
          />
          {userProfile.mode === 'lite' && (
            <Button
              variant="upgrade"
              className="w-full mt-3"
              onClick={() => updateMode('secure')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Upgrade to Secure
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
