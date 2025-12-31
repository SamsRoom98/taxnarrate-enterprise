import { User, Building2 } from 'lucide-react';
import { TaxMode } from '@/types/tax';
import { cn } from '@/lib/utils';

interface ModeSwitcherProps {
  mode: TaxMode;
  onChange: (mode: TaxMode) => void;
  className?: string;
}

export function ModeSwitcher({ mode, onChange, className }: ModeSwitcherProps) {
  return (
    <div className={cn('inline-flex rounded-xl bg-muted p-1', className)}>
      <button
        onClick={() => onChange('personal')}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'personal'
            ? 'bg-card text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <User className="h-4 w-4" />
        Personal Tax (PAYE)
      </button>
      <button
        onClick={() => onChange('business')}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'business'
            ? 'bg-card text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Building2 className="h-4 w-4" />
        Business Tax (SME / Corporate)
      </button>
    </div>
  );
}
