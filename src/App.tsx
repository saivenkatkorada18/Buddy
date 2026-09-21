import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { ListItemModal } from './components/dashboard/ListItemModal';
import { RazorpayCheckoutModal } from './components/payment/RazorpayCheckoutModal';

// Views
import { WelcomeGateView } from './views/WelcomeGateView';
import { LandingView } from './views/LandingView';
import { ExploreView } from './views/ExploreView';
import { ItemDetailView } from './views/ItemDetailView';
import { HowItWorksView } from './views/HowItWorksView';
import { TrustSafetyView } from './views/TrustSafetyView';
import { DashboardView } from './views/DashboardView';
import { AdminDatabaseView } from './views/AdminDatabaseView';
import { NotFoundView } from './views/NotFoundView';

const AppContent: React.FC = () => {
  const {
    currentView,
    toasts,
    removeToast,
    isGateOpen,
    resolveGate,
    isPaymentModalOpen,
    closePaymentModal,
    paymentModalOptions,
    isListItemModalOpen,
    setListItemModalOpen,
  } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'explore':
        return <ExploreView />;
      case 'item':
      case 'item-detail':
        return <ItemDetailView />;
      case 'how-it-works':
        return <HowItWorksView />;
      case 'trust-safety':
        return <TrustSafetyView />;
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
      case 'admin-database':
        return <AdminDatabaseView />;
      case 'not-found':
      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      {/* Welcome Gate Guard */}
      {isGateOpen && (
        <WelcomeGateView onResolved={resolveGate} />
      )}

      <Navbar />

      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <ListItemModal
        isOpen={isListItemModalOpen}
        onClose={() => setListItemModalOpen(false)}
      />
      <RazorpayCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        initialOptions={paymentModalOptions}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4 sm:px-0 sm:right-6 sm:bottom-6">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
