import React from 'react';
import { User, Trash2, Edit2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Employee, formatCurrency } from '@/types/employee';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  onSelect: (id: string, selected: boolean) => void;
  onRemove: (id: string) => void;
  selectable?: boolean;
}

export function EmployeeCard({ employee, onSelect, onRemove, selectable = true }: EmployeeCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border bg-card transition-all',
        employee.selected && 'border-primary bg-primary/5'
      )}
    >
      {selectable && (
        <Checkbox
          checked={employee.selected}
          onCheckedChange={(checked) => onSelect(employee.id, checked === true)}
        />
      )}
      
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <User className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{employee.name}</p>
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
            {employee.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
        <p className="text-xs text-muted-foreground">TIN: {employee.tin}</p>
      </div>
      
      <div className="text-right shrink-0">
        <p className="text-sm text-muted-foreground">Monthly PAYE</p>
        <p className="font-semibold text-foreground">{formatCurrency(employee.monthlyTax)}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(employee.annualTax)}/yr</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(employee.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
