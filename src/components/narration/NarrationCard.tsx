import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NarrationOption, RiskLevel } from '@/types/narration';
import { AlertTriangle, CheckCircle2, Info, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NarrationCardProps {
  option: NarrationOption;
  onSelect: (option: NarrationOption) => void;
  isSelected?: boolean;
}

const riskConfig: Record<RiskLevel, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: typeof CheckCircle2 
}> = {
  low: { 
    label: 'Low Risk', 
    color: 'text-success', 
    bgColor: 'bg-success/10 border-success/20',
    icon: CheckCircle2 
  },
  medium: { 
    label: 'Medium Risk', 
    color: 'text-warning', 
    bgColor: 'bg-warning/10 border-warning/20',
    icon: Info 
  },
  high: { 
    label: 'High Risk', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10 border-destructive/20',
    icon: AlertTriangle 
  },
};

export const NarrationCard: React.FC<NarrationCardProps> = ({
  option,
  onSelect,
  isSelected = false,
}) => {
  const risk = riskConfig[option.riskLevel];
  const RiskIcon = risk.icon;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        "border"
      )}
      onClick={() => onSelect(option)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground">{option.name}</h4>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("shrink-0", risk.bgColor, risk.color)}
          >
            <RiskIcon className="h-3 w-3 mr-1" />
            {risk.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Explanation */}
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {option.explanation}
          </p>
        </div>

        {/* Tax Implications */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Tax Implications
          </p>
          <div className="flex flex-wrap gap-2">
            {option.taxImplications.map((impl, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-secondary"
              >
                {impl.applicable ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                )}
                <span className="font-medium">{impl.type}</span>
                <span className="text-muted-foreground">– {impl.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Penalty Warning */}
        {option.penaltyWarning && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-warning-foreground">
              {option.penaltyWarning}
            </p>
          </div>
        )}

        {/* Documentation Required */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Documentation Required
          </p>
          <div className="flex flex-wrap gap-1.5">
            {option.documentationRequired.map((doc, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-background border"
              >
                <FileText className="h-3 w-3" />
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Select Button */}
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
        >
          {isSelected ? 'Selected' : 'Select This Narration'}
        </Button>
      </CardContent>
    </Card>
  );
};
