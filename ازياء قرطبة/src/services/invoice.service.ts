import { invoicesAdapter } from '@/adapters/invoices.adapter';
import type { Invoice, NewInvoice, InvoiceItem } from '@/db/database.service';

export interface InvoiceFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  paidAmount: number;
  status: string;
  deliveryDate: string;
  notes: string;
  items: {
    itemName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  measurements?: {
    length: number;
    shoulder: number;
    waist: number;
    chest: number;
  };
  designDetails?: {
    fabricType: string[];
    fabricSource: string[];
    collarType: string[];
    chestStyle: string[];
    sleeveEnd: string[];
  };
  fabricImageUrl?: string;
}

export class InvoiceService {
  // Get all invoices
  static async getInvoices(): Promise<Invoice[]> {
    try {
      return await invoicesAdapter.getInvoices();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Create new invoice
  static async createInvoice(formData: InvoiceFormData): Promise<Invoice> {
    try {
      const newInvoice: NewInvoice = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
        total: formData.total,
        paid_amount: formData.paidAmount,
        status: formData.status,
        due_date: formData.deliveryDate,
        notes: formData.notes,
        items: formData.items.map(item => ({
          item_name: item.itemName,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice
        })),
        fabric_image_url: formData.fabricImageUrl
      };

      return await invoicesAdapter.createInvoice(newInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Update invoice
  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    try {
      return await invoicesAdapter.updateInvoice(id, updates);
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Delete invoice
  static async deleteInvoice(id: string): Promise<void> {
    try {
      await invoicesAdapter.deleteInvoice(id);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Mark invoice as paid
  static async markAsPaid(id: string): Promise<Invoice> {
    try {
      return await this.updateInvoice(id, { 
        status: 'مدفوع',
        paid_amount: 0 // This will be set to the total amount
      });
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  // Calculate total from items
  static calculateTotal(items: InvoiceFormData['items']): number {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }

  // Validate invoice form data
  static validateInvoiceData(data: InvoiceFormData): string[] {
    const errors: string[] = [];

    if (!data.customerName.trim()) {
      errors.push('اسم العميل مطلوب');
    }

    if (!data.customerPhone.trim()) {
      errors.push('رقم الهاتف مطلوب');
    }

    if (data.items.length === 0) {
      errors.push('يجب إضافة عنصر واحد على الأقل');
    }

    data.items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        errors.push(`اسم العنصر ${index + 1} مطلوب`);
      }
      if (item.quantity <= 0) {
        errors.push(`كمية العنصر ${index + 1} يجب أن تكون أكبر من صفر`);
      }
      if (item.unitPrice <= 0) {
        errors.push(`سعر العنصر ${index + 1} يجب أن يكون أكبر من صفر`);
      }
    });

    if (data.total <= 0) {
      errors.push('المجموع يجب أن يكون أكبر من صفر');
    }

    if (data.paidAmount < 0) {
      errors.push('المبلغ المدفوع لا يمكن أن يكون سالباً');
    }

    if (data.paidAmount > data.total) {
      errors.push('المبلغ المدفوع لا يمكن أن يكون أكبر من المجموع');
    }

    return errors;
  }

  // Get invoice status badge color
  static getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'مدفوع':
        return 'bg-green-100 text-green-800';
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800';
      case 'جزئي':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Format currency
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format date
  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}


