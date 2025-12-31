import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HeaderNavLinkProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export function HeaderNavLink({ icon: Icon, label, active, onClick, badge }: HeaderNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold min-w-[18px] text-center',
            active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-success/20 text-success'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
