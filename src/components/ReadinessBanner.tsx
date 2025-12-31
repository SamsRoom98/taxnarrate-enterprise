import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Calendar } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { cn } from '@/lib/utils';

interface ReadinessBannerProps {
  score: number;
  className?: string;
}

export function ReadinessBanner({ score, className }: ReadinessBannerProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  // Calculate days until January 1, 2026
  const targetDate = new Date('2026-01-01');
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card variant="elevated" className={cn('overflow-hidden', className)}>
      <div className="bg-gradient-to-r from-primary via-accent to-primary p-6 text-primary-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Title & Description */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="bg-success/20 text-success-foreground border-success/30 animate-pulse-soft">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success-foreground"></span>
                </span>
                Live Update
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                <Calendar className="h-3.5 w-3.5" />
                <span>Effective: January 1, 2026</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">2026 Law Readiness Status</h2>
            <p className="text-primary-foreground/80 max-w-md">
              Your compliance readiness score for Nigeria's new tax regulations
            </p>
          </div>

          {/* Right: Score & Countdown */}
          <div className="flex items-center gap-6">
            {/* Days Remaining */}
            <div className="hidden sm:block text-center px-5 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
              <div className="flex items-center gap-2 text-primary-foreground/70 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Days Left</span>
              </div>
              <p className="text-2xl font-bold">
                <AnimatedCounter value={daysRemaining} duration={1500} />
              </p>
            </div>

            {/* Score */}
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter value={score} suffix="%" duration={1500} />
              </p>
              <p className="text-sm text-primary-foreground/80 mt-1">Ready</p>
            </div>

            {/* Circular Progress */}
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90 transform">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-primary-foreground/20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - animatedProgress / 100)}`}
                  className="text-success transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
