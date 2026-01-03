import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PaymentState, 
  PaymentMethod, 
  PaymentPlan,
  SubscriptionReceipt,
  TaxReceipt,
  PaymentHistoryItem,
  TaxBreakdown,
  generateTransactionRef,
  generateNRSReceiptNo,
  formatDate,
} from '@/types/payment';
import { UserMode, AccountType } from '@/types/tax';

interface PaymentContextType {
  paymentState: PaymentState;
  
  // Subscription actions
  openSubscriptionModal: (targetMode: Exclude<UserMode, 'lite'>) => void;
  closeSubscriptionModal: () => void;
  setSubscriptionMethod: (method: PaymentMethod) => void;
  processSubscriptionPayment: (amount: number, accountType: AccountType) => Promise<SubscriptionReceipt>;
  resetSubscriptionState: () => void;
  
  // Tax payment actions
  openTaxPaymentModal: (amount: number, breakdown: TaxBreakdown) => void;
  closeTaxPaymentModal: () => void;
  setTaxPaymentPlan: (plan: PaymentPlan) => void;
  setTaxPaymentMethod: (method: PaymentMethod) => void;
  setTaxConsent: (consent: boolean) => void;
  processTaxPayment: (taxType: 'PAYE' | 'CIT', taxpayerName: string) => Promise<TaxReceipt>;
  resetTaxPaymentState: () => void;
  
  // History
  getPaymentHistory: () => PaymentHistoryItem[];
}

const initialPaymentState: PaymentState = {
  showSubscriptionModal: false,
  targetMode: 'secure',
  subscriptionMethod: 'card',
  subscriptionProcessing: false,
  subscriptionSuccess: false,
  subscriptionReceipt: null,
  
  showTaxPaymentModal: false,
  taxAmount: 0,
  taxPaymentPlan: 'full',
  taxPaymentMethod: 'card',
  taxProcessing: false,
  taxSuccess: false,
  taxConsentGiven: false,
  taxReceipt: null,
  taxBreakdown: null,
  
  paymentHistory: [],
  taxPaidFor2026: false,
};

const STORAGE_KEY = 'taxnarrate_payment_state';

function loadPersistedState(): Partial<PaymentState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        paymentHistory: parsed.paymentHistory || [],
        taxPaidFor2026: parsed.taxPaidFor2026 || false,
      };
    }
  } catch (e) {
    console.error('Failed to load payment state:', e);
  }
  return {};
}

function persistState(state: PaymentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      paymentHistory: state.paymentHistory,
      taxPaidFor2026: state.taxPaidFor2026,
    }));
  } catch (e) {
    console.error('Failed to persist payment state:', e);
  }
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentState, setPaymentState] = useState<PaymentState>(() => ({
    ...initialPaymentState,
    ...loadPersistedState(),
  }));

  // Persist state changes
  useEffect(() => {
    persistState(paymentState);
  }, [paymentState.paymentHistory, paymentState.taxPaidFor2026]);

  // Subscription actions
  const openSubscriptionModal = (targetMode: Exclude<UserMode, 'lite'>) => {
    setPaymentState(prev => ({
      ...prev,
      showSubscriptionModal: true,
      targetMode,
      subscriptionMethod: 'card',
      subscriptionProcessing: false,
      subscriptionSuccess: false,
      subscriptionReceipt: null,
    }));
  };

  const closeSubscriptionModal = () => {
    setPaymentState(prev => ({
      ...prev,
      showSubscriptionModal: false,
    }));
  };

  const setSubscriptionMethod = (method: PaymentMethod) => {
    setPaymentState(prev => ({ ...prev, subscriptionMethod: method }));
  };

  const processSubscriptionPayment = async (
    amount: number,
    accountType: AccountType
  ): Promise<SubscriptionReceipt> => {
    setPaymentState(prev => ({ ...prev, subscriptionProcessing: true }));

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const receipt: SubscriptionReceipt = {
      transactionRef: generateTransactionRef(),
      date: formatDate(new Date()),
      amount,
      mode: paymentState.targetMode,
      method: paymentState.subscriptionMethod,
      userType: accountType === 'individual' ? 'individual' : 'business',
    };

    const historyItem: PaymentHistoryItem = {
      id: receipt.transactionRef,
      type: 'subscription',
      amount,
      date: receipt.date,
      status: 'paid',
      receipt,
    };

    setPaymentState(prev => ({
      ...prev,
      subscriptionProcessing: false,
      subscriptionSuccess: true,
      subscriptionReceipt: receipt,
      paymentHistory: [historyItem, ...prev.paymentHistory],
    }));

    return receipt;
  };

  const resetSubscriptionState = () => {
    setPaymentState(prev => ({
      ...prev,
      showSubscriptionModal: false,
      subscriptionProcessing: false,
      subscriptionSuccess: false,
      subscriptionReceipt: null,
    }));
  };

  // Tax payment actions
  const openTaxPaymentModal = (amount: number, breakdown: TaxBreakdown) => {
    setPaymentState(prev => ({
      ...prev,
      showTaxPaymentModal: true,
      taxAmount: amount,
      taxBreakdown: breakdown,
      taxPaymentPlan: 'full',
      taxPaymentMethod: 'card',
      taxProcessing: false,
      taxSuccess: false,
      taxConsentGiven: false,
      taxReceipt: null,
    }));
  };

  const closeTaxPaymentModal = () => {
    setPaymentState(prev => ({
      ...prev,
      showTaxPaymentModal: false,
    }));
  };

  const setTaxPaymentPlan = (plan: PaymentPlan) => {
    setPaymentState(prev => ({ ...prev, taxPaymentPlan: plan }));
  };

  const setTaxPaymentMethod = (method: PaymentMethod) => {
    setPaymentState(prev => ({ ...prev, taxPaymentMethod: method }));
  };

  const setTaxConsent = (consent: boolean) => {
    setPaymentState(prev => ({ ...prev, taxConsentGiven: consent }));
  };

  const processTaxPayment = async (
    taxType: 'PAYE' | 'CIT',
    taxpayerName: string
  ): Promise<TaxReceipt> => {
    setPaymentState(prev => ({ ...prev, taxProcessing: true }));

    // Simulate NRS gateway connection
    await new Promise(resolve => setTimeout(resolve, 1000)); // Connecting...
    await new Promise(resolve => setTimeout(resolve, 1000)); // Verifying TIN...
    await new Promise(resolve => setTimeout(resolve, 2000)); // Processing...

    const receipt: TaxReceipt = {
      nrsReceiptNo: generateNRSReceiptNo(),
      tin: 'TIN-' + Math.random().toString().substr(2, 9),
      taxYear: 2026,
      taxType,
      amount: paymentState.taxAmount,
      date: formatDate(new Date()),
      method: paymentState.taxPaymentMethod,
      status: 'paid',
      taxpayerName,
    };

    const historyItem: PaymentHistoryItem = {
      id: receipt.nrsReceiptNo,
      type: 'tax',
      amount: receipt.amount,
      date: receipt.date,
      status: 'paid',
      receipt,
    };

    setPaymentState(prev => ({
      ...prev,
      taxProcessing: false,
      taxSuccess: true,
      taxReceipt: receipt,
      taxPaidFor2026: true,
      paymentHistory: [historyItem, ...prev.paymentHistory],
    }));

    return receipt;
  };

  const resetTaxPaymentState = () => {
    setPaymentState(prev => ({
      ...prev,
      showTaxPaymentModal: false,
      taxProcessing: false,
      taxSuccess: false,
      taxReceipt: null,
      taxConsentGiven: false,
    }));
  };

  const getPaymentHistory = () => paymentState.paymentHistory;

  return (
    <PaymentContext.Provider
      value={{
        paymentState,
        openSubscriptionModal,
        closeSubscriptionModal,
        setSubscriptionMethod,
        processSubscriptionPayment,
        resetSubscriptionState,
        openTaxPaymentModal,
        closeTaxPaymentModal,
        setTaxPaymentPlan,
        setTaxPaymentMethod,
        setTaxConsent,
        processTaxPayment,
        resetTaxPaymentState,
        getPaymentHistory,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
