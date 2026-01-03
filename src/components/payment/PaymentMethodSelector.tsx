import React from 'react';
import { CreditCard, Building2, Phone, Check, Lock } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';
import { cn } from '@/lib/utils';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  securePlusOnly?: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  showDebit?: boolean;
  isSecurePlus?: boolean;
  className?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  showDebit = false,
  isSecurePlus = false,
  className,
}: PaymentMethodSelectorProps) {
  const methods: PaymentMethodOption[] = [
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Visa, Mastercard, Verve',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 'transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      id: 'ussd',
      name: 'USSD',
      description: 'Pay with *123# code',
      icon: <Phone className="h-5 w-5" />,
    },
  ];

  if (showDebit) {
    methods.push({
      id: 'debit',
      name: 'Direct Debit',
      description: 'Secure+ only',
      icon: <Lock className="h-5 w-5" />,
      securePlusOnly: true,
      disabled: !isSecurePlus,
    });
  }

  return (
    <div className={cn('space-y-3', className)}>
      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        const isDisabled = method.disabled;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => !isDisabled && onSelect(method.id)}
            disabled={isDisabled}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-muted-foreground/30',
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {method.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{method.name}</p>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
            {isSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
            {method.securePlusOnly && !isSecurePlus && (
              <span className="text-xs text-warning font-medium">Secure+ Only</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
