import React, { useState } from 'react';
import { useCreateOrder } from './useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

interface CreateOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrderForm({ isOpen, onClose }: CreateOrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [total, setTotal] = useState('');
  const createOrder = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !total) {
      toast.error('Please fill in all fields');
      return;
    }

    const totalValue = parseFloat(total);
    if (isNaN(totalValue) || totalValue <= 0) {
      toast.error('Please enter a valid total amount');
      return;
    }

    try {
      await createOrder.mutateAsync({
        customer_name: customerName.trim(),
        total: totalValue,
      });
      
      toast.success('Order created successfully!');
      setCustomerName('');
      setTotal('');
      onClose();
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Order"
      description="Add a new order to the system"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="total">Total Amount</Label>
          <Input
            id="total"
            type="number"
            step="0.01"
            min="0"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createOrder.isPending}>
            {createOrder.isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

