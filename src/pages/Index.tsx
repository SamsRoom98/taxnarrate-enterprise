import { TaxProvider, useTax } from '@/contexts/TaxContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';
import { SubscriptionPaymentModal } from '@/components/payment/SubscriptionPaymentModal';
import { TaxPaymentModal } from '@/components/payment/TaxPaymentModal';

function TaxApp() {
  const { userProfile } = useTax();

  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <>
      <Dashboard />
      <SubscriptionPaymentModal />
      <TaxPaymentModal />
    </>
  );
}

const Index = () => {
  return (
    <TaxProvider>
      <PaymentProvider>
        <TaxApp />
      </PaymentProvider>
    </TaxProvider>
  );
};

export default Index;
