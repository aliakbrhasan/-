import React, { useState } from 'react';
import { OrdersList, CreateOrderForm } from './index';
import { ElectronDemo } from '../electron/ElectronDemo';

export function OrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <OrdersList onCreateOrder={() => setIsCreateModalOpen(true)} />
      <ElectronDemo />
      <CreateOrderForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
