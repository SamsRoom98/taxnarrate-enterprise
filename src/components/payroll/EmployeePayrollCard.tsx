import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CreditCard, Lock, CheckSquare, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeCard } from './EmployeeCard';
import { AddEmployeeModal } from './AddEmployeeModal';
import { PayrollPaymentModal } from './PayrollPaymentModal';
import { Employee, formatCurrency } from '@/types/employee';
import { useTax } from '@/contexts/TaxContext';
import { usePayment } from '@/contexts/PaymentContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EmployeePayrollCardProps {
  className?: string;
}

const STORAGE_KEY = 'taxnarrate_employees';

function loadEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load employees:', e);
  }
  return [];
}

function saveEmployees(employees: Employee[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed to save employees:', e);
  }
}

export function EmployeePayrollCard({ className }: EmployeePayrollCardProps) {
  const { userProfile } = useTax();
  const { openSubscriptionModal } = usePayment();
  
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'bulk' | 'individual'>('bulk');

  const isLiteMode = userProfile.mode === 'lite';
  const isBusinessMode = userProfile.taxMode === 'business';
  
  // Only show for business accounts
  if (!isBusinessMode) return null;

  const selectedEmployees = employees.filter((e) => e.selected);
  const totalMonthlyTax = employees.reduce((sum, e) => sum + e.monthlyTax, 0);
  const selectedMonthlyTax = selectedEmployees.reduce((sum, e) => sum + e.monthlyTax, 0);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const handleAddEmployee = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  const handleSelectEmployee = (id: string, selected: boolean) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected } : e))
    );
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast.success('Employee removed');
  };

  const handleSelectAll = () => {
    const allSelected = employees.every((e) => e.selected);
    setEmployees((prev) => prev.map((e) => ({ ...e, selected: !allSelected })));
  };

  const handleBulkPayment = () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    setPaymentMode('bulk');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Deselect all after payment
    setEmployees((prev) => prev.map((e) => ({ ...e, selected: false })));
    toast.success('PAYE remittance completed successfully');
  };

  // Locked state for Lite mode
  if (isLiteMode) {
    return (
      <Card variant="locked" className={cn('relative', className)}>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Employee Payroll</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Register employees and remit PAYE in bulk or individually
          </p>
          <span className="text-xs text-warning font-medium mb-4">Secure Mode Required</span>
          <Button size="sm" onClick={() => openSubscriptionModal('secure')}>
            Unlock Feature
          </Button>
        </div>
        <CardHeader className="blur-locked">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Payroll
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-locked">
          <div className="h-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="elevated" className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Payroll
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Register employees and remit PAYE to NRS
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {employees.length === 0 ? (
            <div className="text-center py-8 rounded-lg border border-dashed">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground mb-1">No Employees Registered</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add employees to start processing PAYE remittance
              </p>
              <Button variant="outline" onClick={() => setShowAddModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMonthlyTax)}</p>
                  <p className="text-xs text-muted-foreground">Monthly PAYE</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{selectedEmployees.length}</p>
                  <p className="text-xs text-muted-foreground">Selected</p>
                </div>
              </div>

              {/* Employee List */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All ({employees.length})</TabsTrigger>
                  <TabsTrigger value="selected" className="flex-1">
                    Selected ({selectedEmployees.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                      {employees.every((e) => e.selected) ? (
                        <CheckSquare className="h-4 w-4 mr-2" />
                      ) : (
                        <Square className="h-4 w-4 mr-2" />
                      )}
                      {employees.every((e) => e.selected) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {employees.map((employee) => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSelect={handleSelectEmployee}
                        onRemove={handleRemoveEmployee}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="selected" className="mt-4 space-y-3">
                  {selectedEmployees.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No employees selected
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedEmployees.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          employee={employee}
                          onSelect={handleSelectEmployee}
                          onRemove={handleRemoveEmployee}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Payment Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleBulkPayment}
                  disabled={selectedEmployees.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Selected ({formatCurrency(selectedMonthlyTax)})
                </Button>
              </div>

              {/* Demo Disclaimer */}
              <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
                <p className="text-xs text-warning text-center">
                  🚧 DEMO MODE: Employee data stored locally. Real NRS integration pending.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddEmployeeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddEmployee}
      />

      <PayrollPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        employees={employees}
        paymentMode={paymentMode}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
