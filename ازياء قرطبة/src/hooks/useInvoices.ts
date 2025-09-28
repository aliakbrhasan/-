import { useState, useEffect } from 'react';
import { InvoiceService, InvoiceFormData } from '@/services/invoice.service';
import type { Invoice } from '@/db/database.service';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load invoices
  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InvoiceService.getInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الفواتير');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create invoice
  const createInvoice = async (formData: InvoiceFormData) => {
    try {
      setError(null);
      
      // Validate form data
      const validationErrors = InvoiceService.validateInvoiceData(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const newInvoice = await InvoiceService.createInvoice(formData);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في إنشاء الفاتورة';
      setError(errorMessage);
      throw err;
    }
  };

  // Update invoice
  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      setError(null);
      const updatedInvoice = await InvoiceService.updateInvoice(id, updates);
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? updatedInvoice : invoice
        )
      );
      return updatedInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحديث الفاتورة';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string) => {
    try {
      setError(null);
      await InvoiceService.deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في حذف الفاتورة';
      setError(errorMessage);
      throw err;
    }
  };

  // Mark as paid
  const markAsPaid = async (id: string) => {
    try {
      setError(null);
      const updatedInvoice = await InvoiceService.markAsPaid(id);
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? updatedInvoice : invoice
        )
      );
      return updatedInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحديث حالة الفاتورة';
      setError(errorMessage);
      throw err;
    }
  };

  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
  };
}


