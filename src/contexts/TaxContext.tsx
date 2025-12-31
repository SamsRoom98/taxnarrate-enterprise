import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserMode, AccountType, TaxMode, UserProfile, ComplianceStatus } from '@/types/tax';

interface TaxContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  complianceStatus: ComplianceStatus;
  setComplianceStatus: React.Dispatch<React.SetStateAction<ComplianceStatus>>;
  updateMode: (mode: UserMode) => void;
  updateAccountType: (type: AccountType) => void;
  updateTaxMode: (mode: TaxMode) => void;
  completeOnboarding: () => void;
  isFeatureLocked: (requiredMode: UserMode) => boolean;
}

const defaultProfile: UserProfile = {
  accountType: 'individual',
  mode: 'lite',
  taxMode: 'personal',
  isVerified: false,
  hasCompletedOnboarding: false,
};

const defaultCompliance: ComplianceStatus = {
  nrsTaxId: false,
  eInvoicing: false,
  payeStatus: 'pending',
  overallScore: 35,
};

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export function TaxProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus>(defaultCompliance);

  const updateMode = (mode: UserMode) => {
    setUserProfile(prev => ({ ...prev, mode }));
    if (mode !== 'lite') {
      setComplianceStatus(prev => ({
        ...prev,
        nrsTaxId: true,
        overallScore: mode === 'secure-plus' ? 95 : 75,
        payeStatus: 'ready',
      }));
    }
  };

  const updateAccountType = (type: AccountType) => {
    setUserProfile(prev => ({
      ...prev,
      accountType: type,
      taxMode: type === 'individual' ? 'personal' : 'business',
    }));
  };

  const updateTaxMode = (mode: TaxMode) => {
    setUserProfile(prev => ({ ...prev, taxMode: mode }));
  };

  const completeOnboarding = () => {
    setUserProfile(prev => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const isFeatureLocked = (requiredMode: UserMode): boolean => {
    const modeHierarchy: Record<UserMode, number> = {
      'lite': 0,
      'secure': 1,
      'secure-plus': 2,
    };
    return modeHierarchy[userProfile.mode] < modeHierarchy[requiredMode];
  };

  return (
    <TaxContext.Provider
      value={{
        userProfile,
        setUserProfile,
        complianceStatus,
        setComplianceStatus,
        updateMode,
        updateAccountType,
        updateTaxMode,
        completeOnboarding,
        isFeatureLocked,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
}
