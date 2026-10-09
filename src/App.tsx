/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SmsModal } from './components/SmsModal';
import { PublicTracker } from './components/PublicTracker';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerAuth } from './pages/FarmerAuth';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { QueueStatusPage } from './pages/QueueStatusPage';
import { ProcurementTrackingPage } from './pages/ProcurementTrackingPage';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CropPricesPage } from './pages/CropPricesPage';

function MainLayout() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} onOpenQuickSearch={() => setIsTrackerOpen(true)} />;
      case 'prices':
        return <CropPricesPage setCurrentPage={setCurrentPage} />;
      case 'farmer-auth':
        return <FarmerAuth setCurrentPage={setCurrentPage} />;
      case 'farmer-dashboard':
        return <FarmerDashboard setCurrentPage={setCurrentPage} />;
      case 'book-slot':
        return <SlotBookingPage setCurrentPage={setCurrentPage} />;
      case 'live-queue':
        return <QueueStatusPage setCurrentPage={setCurrentPage} />;
      case 'procurement':
        return <ProcurementTrackingPage setCurrentPage={setCurrentPage} />;
      case 'payments':
        return <PaymentTrackingPage setCurrentPage={setCurrentPage} />;
      case 'notifications':
        return <NotificationsPage setCurrentPage={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} onOpenQuickSearch={() => setIsTrackerOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Offline banner check for low-connectivity mandi environments */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center">
          ⚠️ Low / Offline Connectivity Mode: Offline queuing cache enabled. Data will sync when network is restored.
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onOpenQuickSearch={() => setIsTrackerOpen(true)}
      />

      {/* Page Content View */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Public Quick Token & Booking Search Modal */}
      <PublicTracker 
        isOpen={isTrackerOpen} 
        onClose={() => setIsTrackerOpen(false)} 
        onNavigateToBooking={() => {
          setIsTrackerOpen(false);
          setCurrentPage('live-queue');
        }}
      />

      {/* Simulated SMS Notification Alert Popup */}
      <SmsModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
