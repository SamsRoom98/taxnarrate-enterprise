import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'premium';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    trendPositive: 'text-success',
    trendNegative: 'text-destructive',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    trendPositive: 'text-success',
    trendNegative: 'text-destructive',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    trendPositive: 'text-success',
    trendNegative: 'text-destructive',
  },
  premium: {
    iconBg: 'bg-premium/10',
    iconColor: 'text-premium',
    trendPositive: 'text-success',
    trendNegative: 'text-destructive',
  },
};

export function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card variant="elevated" className={cn('overflow-hidden', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="text-2xl font-bold text-foreground">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
            </div>
            {trend && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? styles.trendPositive : styles.trendNegative
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', styles.iconBg)}>
            <Icon className={cn('h-5 w-5', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
