import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { OrdersPage } from './components/OrdersPage';
import { InvoicesPage } from './components/InvoicesPage';
import { CustomersPage } from './components/CustomersPage';
import { ReportsPage } from './components/ReportsPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'orders':
        return <OrdersPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Layout
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        >
          {renderCurrentPage()}
        </Layout>
      )}
      <Toaster position="top-center" />
    </div>
  );
}