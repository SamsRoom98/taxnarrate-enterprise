import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Employee, calculateEmployeeTax, generateEmployeeId, formatCurrency } from '@/types/employee';
import { toast } from 'sonner';

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (employee: Employee) => void;
}

export function AddEmployeeModal({ open, onOpenChange, onAdd }: AddEmployeeModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tin, setTin] = useState('');
  const [monthlyGross, setMonthlyGross] = useState('');

  const parsedGross = parseInt(monthlyGross.replace(/[^0-9]/g, '')) || 0;
  const taxCalc = calculateEmployeeTax(parsedGross);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !tin || !monthlyGross) {
      toast.error('Please fill in all fields');
      return;
    }

    const employee: Employee = {
      id: generateEmployeeId(),
      name,
      email,
      tin,
      monthlyGross: parsedGross,
      monthlyTax: taxCalc.monthlyTax,
      annualTax: taxCalc.annualTax,
      selected: false,
      status: 'active',
      dateAdded: new Date().toISOString(),
    };

    onAdd(employee);
    toast.success('Employee added successfully');
    
    // Reset form
    setName('');
    setEmail('');
    setTin('');
    setMonthlyGross('');
    onOpenChange(false);
  };

  const formatDisplayAmount = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-NG').format(num);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Employee
          </DialogTitle>
          <DialogDescription>
            Register a new employee for PAYE remittance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
            <Input
              id="tin"
              placeholder="TIN-XXXXXXXXX"
              value={tin}
              onChange={(e) => setTin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gross">Monthly Gross Salary (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <Input
                id="gross"
                placeholder="0"
                value={formatDisplayAmount(monthlyGross)}
                onChange={(e) => setMonthlyGross(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tax Preview */}
          {parsedGross > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm font-medium text-foreground">Calculated PAYE</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Tax:</span>
                <span className="font-medium text-foreground">{formatCurrency(taxCalc.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Annual Tax:</span>
                <span className="font-medium text-foreground">{formatCurrency(taxCalc.annualTax)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
