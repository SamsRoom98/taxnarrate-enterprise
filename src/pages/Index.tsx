import { TaxProvider, useTax } from '@/contexts/TaxContext';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';

function TaxApp() {
  const { userProfile } = useTax();

  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <Dashboard />;
}

const Index = () => {
  return (
    <TaxProvider>
      <TaxApp />
    </TaxProvider>
  );
};

export default Index;
