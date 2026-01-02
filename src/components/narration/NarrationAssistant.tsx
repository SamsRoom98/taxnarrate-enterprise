import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { NarrationCard } from './NarrationCard';
import { NarrationConfirmationModal } from './NarrationConfirmationModal';
import { 
  NARRATION_OPTIONS, 
  TRANSACTION_TYPES, 
  NarrationOption, 
  TransactionType,
  NarrationLog 
} from '@/types/narration';
import { useTax } from '@/contexts/TaxContext';
import { 
  Brain, 
  ChevronDown, 
  Lock, 
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NarrationAssistantProps {
  className?: string;
}

export const NarrationAssistant: React.FC<NarrationAssistantProps> = ({ className }) => {
  const { userProfile, isFeatureLocked } = useTax();
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType | ''>('');
  const [selectedNarration, setSelectedNarration] = useState<NarrationOption | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedLogs, setConfirmedLogs] = useState<NarrationLog[]>([]);

  // Feature is locked in Lite mode
  const isLocked = isFeatureLocked('secure');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const formatDisplayAmount = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-NG').format(parseInt(value));
  };

  const handleSelectNarration = (option: NarrationOption) => {
    if (!amount || !transactionType) {
      toast.error('Please enter amount and select transaction type first');
      return;
    }
    setSelectedNarration(option);
    setShowConfirmation(true);
  };

  const handleConfirm = (log: NarrationLog) => {
    setConfirmedLogs(prev => [...prev, log]);
    toast.success('Narration confirmed and logged', {
      description: `${log.narrationName} - ₦${formatDisplayAmount(log.amount.toString())}`,
    });
    // Reset form
    setAmount('');
    setTransactionType('');
    setSelectedNarration(null);
  };

  const handleVoicePlay = (narration: NarrationOption, language: string) => {
    if (language !== 'english' && userProfile.mode !== 'secure-plus') {
      toast.error('Non-English narration requires Secure+ mode');
      return;
    }
    // Voice playback would be implemented here
    toast.info(`Playing: ${narration.name}`, {
      description: `Language: ${language}`,
    });
  };

  const showNarrationOptions = amount && transactionType;

  if (isLocked) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-semibold text-foreground mb-1">Secure Mode Required</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to Secure mode to access the Narration Assistant
            </p>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Narration & Tax Impact</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={cn("overflow-hidden", className)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Narration & Tax Impact</CardTitle>
                    <CardDescription>
                      Understand transaction narrations and their tax implications
                    </CardDescription>
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )} 
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Step 1: Amount Entry */}
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Step 1</Badge>
                  <span className="text-sm font-medium">Enter Transaction Details</span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₦
                      </span>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="0"
                        value={formatDisplayAmount(amount)}
                        onChange={handleAmountChange}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select 
                      value={transactionType} 
                      onValueChange={(v) => setTransactionType(v as TransactionType)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Step 2: Narration Options */}
              {showNarrationOptions && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Step 2</Badge>
                    <span className="text-sm font-medium">Select Narration Type</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {NARRATION_OPTIONS.map((option) => (
                      <div key={option.id} className="relative">
                        <NarrationCard
                          option={option}
                          onSelect={handleSelectNarration}
                          isSelected={selectedNarration?.id === option.id}
                        />
                        
                        {/* Voice Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoicePlay(option, 'english');
                            }}
                            title="Play in English"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                          {userProfile.mode === 'secure-plus' ? (
                            <Badge 
                              variant="outline" 
                              className="text-[10px] px-1.5 py-0 h-6 bg-premium/10 text-premium border-premium/20"
                            >
                              +3 languages
                            </Badge>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className="text-[10px] px-1.5 py-0 h-6 gap-0.5"
                            >
                              <Lock className="h-2.5 w-2.5" />
                              More
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmed Narrations Log */}
              {confirmedLogs.length > 0 && (
                <div className="space-y-3 p-4 rounded-lg border bg-success/5 border-success/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      Confirmed Narrations ({confirmedLogs.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {confirmedLogs.slice(-3).map((log, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between text-sm p-2 rounded bg-background"
                      >
                        <span>{log.narrationName}</span>
                        <span className="text-muted-foreground">
                          ₦{new Intl.NumberFormat('en-NG').format(log.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Note */}
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> We explain the meaning. The user owns the decision.
                  TaxNarrate does not provide legal or tax advice.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Confirmation Modal */}
      <NarrationConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        narration={selectedNarration}
        amount={amount ? parseInt(amount) : 0}
        transactionType={transactionType as TransactionType}
        onConfirm={handleConfirm}
      />
    </>
  );
};
