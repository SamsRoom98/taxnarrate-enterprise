import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { NarrationOption, RiskLevel, TransactionType, NarrationLog } from '@/types/narration';
import { AlertTriangle, CheckCircle2, Info, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTax } from '@/contexts/TaxContext';

interface NarrationConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  narration: NarrationOption | null;
  amount: number;
  transactionType: TransactionType;
  onConfirm: (log: NarrationLog) => void;
}

const riskConfig: Record<RiskLevel, { 
  label: string; 
  color: string;
  icon: typeof CheckCircle2 
}> = {
  low: { label: 'Low Risk', color: 'text-success', icon: CheckCircle2 },
  medium: { label: 'Medium Risk', color: 'text-warning', icon: Info },
  high: { label: 'High Risk', color: 'text-destructive', icon: AlertTriangle },
};

export const NarrationConfirmationModal: React.FC<NarrationConfirmationModalProps> = ({
  open,
  onOpenChange,
  narration,
  amount,
  transactionType,
  onConfirm,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const { userProfile } = useTax();

  if (!narration) return null;

  const risk = riskConfig[narration.riskLevel];
  const RiskIcon = risk.icon;

  const handleConfirm = () => {
    const log: NarrationLog = {
      narrationId: narration.id,
      narrationName: narration.name,
      amount,
      transactionType,
      riskLevel: narration.riskLevel,
      timestamp: new Date(),
      mode: userProfile.mode === 'secure-plus' ? 'secure-plus' : 'secure',
      acknowledged: true,
    };

    onConfirm(log);
    setAcknowledged(false);
    onOpenChange(false);
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-primary" />
            <DialogTitle>Confirm Narration Selection</DialogTitle>
          </div>
          <DialogDescription>
            Please review and acknowledge your responsibility before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Narration Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Narration</span>
              <span className="font-semibold">{narration.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-semibold">{formatAmount(amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <Badge variant="outline" className={cn("gap-1", risk.color)}>
                <RiskIcon className="h-3 w-3" />
                {risk.label}
              </Badge>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-foreground">Important Disclaimer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are responsible for the narration you select. TaxNarrate provides 
                  educational guidance only and does not make this decision for you. 
                  Any tax, penalties, or legal consequences remain your responsibility.
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="flex items-start space-x-3 p-3 rounded-lg border bg-background">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <Label 
              htmlFor="acknowledge" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I understand and accept that I am solely responsible for this narration 
              selection and any resulting tax or legal implications.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!acknowledged}
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
