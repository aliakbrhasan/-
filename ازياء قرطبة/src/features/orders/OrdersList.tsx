import React from 'react';
import { useOrdersList } from './useOrders';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Plus } from 'lucide-react';

interface OrdersListProps {
  onCreateOrder: () => void;
}

export function OrdersList({ onCreateOrder }: OrdersListProps) {
  const { data: orders, isLoading, error } = useOrdersList();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading orders"
        description="There was a problem loading the orders. Please try again."
        icon={<ShoppingCart className="h-12 w-12" />}
        action={
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        }
      />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Get started by creating your first order."
        icon={<ShoppingCart className="h-12 w-12" />}
        action={
          <Button onClick={onCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Button onClick={onCreateOrder}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{order.customer_name}</span>
                <span className="text-lg font-semibold">
                  ${order.total.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Created: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

