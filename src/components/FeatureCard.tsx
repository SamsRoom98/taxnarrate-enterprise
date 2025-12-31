import { Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserMode } from '@/types/tax';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  value?: string | React.ReactNode;
  requiredMode: UserMode;
  children?: React.ReactNode;
  className?: string;
  isPremium?: boolean;
}

const modeLabels: Record<UserMode, string> = {
  lite: 'Available Now',
  secure: 'Secure Mode',
  'secure-plus': 'Secure+ Mode',
};

export function FeatureCard({
  title,
  description,
  value,
  requiredMode,
  children,
  className,
  isPremium,
}: FeatureCardProps) {
  const { isFeatureLocked, updateMode } = useTax();
  const isLocked = isFeatureLocked(requiredMode);

  return (
    <Card
      variant={isPremium ? 'premium' : isLocked ? 'locked' : 'elevated'}
      className={cn('relative', className)}
    >
      {isPremium && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-premium to-warning" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              {isPremium && (
                <Badge variant="premium" className="text-[10px]">
                  Premium
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {isLocked && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLocked ? (
          <div className="relative">
            <div className="blur-sm select-none pointer-events-none">
              {value && (
                <div className="text-2xl font-bold text-foreground mb-3">
                  {typeof value === 'string' ? value : '₦ ---,---'}
                </div>
              )}
              {children && <div className="opacity-50">{children}</div>}
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-[2px] rounded-lg">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Available in {modeLabels[requiredMode]}
              </p>
              <Button
                variant="upgrade"
                size="sm"
                onClick={() => updateMode(requiredMode)}
                className="gap-2"
              >
                Upgrade
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {value && (
              <div className="text-2xl font-bold text-foreground mb-3">{value}</div>
            )}
            {children}
          </>
        )}
      </CardContent>
    </Card>
  );
}
