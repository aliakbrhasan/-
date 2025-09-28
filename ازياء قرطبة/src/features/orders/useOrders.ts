import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAdapter } from '@/adapters/orders.adapter';
import type { NewOrder } from '@/ports/orders';

export function useOrdersList() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersAdapter.list,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersAdapter.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

