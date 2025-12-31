import { Lock, Unlock, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserMode } from '@/types/tax';
import { cn } from '@/lib/utils';

interface ModeBadgeProps {
  mode: UserMode;
  className?: string;
}

const modeConfig: Record<UserMode, { icon: typeof Lock; label: string; variant: 'lite' | 'secure' | 'secure-plus' }> = {
  lite: {
    icon: Unlock,
    label: 'Lite',
    variant: 'lite',
  },
  secure: {
    icon: Lock,
    label: 'Secure',
    variant: 'secure',
  },
  'secure-plus': {
    icon: ShieldCheck,
    label: 'Secure+',
    variant: 'secure-plus',
  },
};

export function ModeBadge({ mode, className }: ModeBadgeProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn('gap-1.5 px-3 py-1.5 text-sm', className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
