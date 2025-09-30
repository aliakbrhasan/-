import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceService } from '@/services/invoice.service';
import {
  Plus,
  Search,
  Filter,
  Download,
  Copy,
  Edit,
  MoreVertical,
  FileImage,
  MessageCircle,
  Printer,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { NewInvoiceDialogWithDB } from './NewInvoiceDialogWithDB';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog';

interface InvoicesPageProps {
  onCreateInvoice?: () => void;
  onViewInvoiceDetails?: (invoiceId: string) => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoicesPageWithDB({ onCreateInvoice, onViewInvoiceDetails, onMarkAsPaid }: InvoicesPageProps) {
  const { invoices, loading, error, markAsPaid: markInvoiceAsPaid } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // Handle mark as paid
  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await markInvoiceAsPaid(invoiceId);
      if (onMarkAsPaid) {
        onMarkAsPaid(invoiceId);
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    }
  };

  // Handle view invoice details
  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
    if (onViewInvoiceDetails) {
      onViewInvoiceDetails(invoice.id);
    }
  };

  // Handle create new invoice
  const handleCreateInvoice = () => {
    setIsNewInvoiceOpen(true);
    if (onCreateInvoice) {
      onCreateInvoice();
    }
  };

  // Handle invoice created callback
  const handleInvoiceCreated = () => {
    // The useInvoices hook will automatically update the cache
    // No need to manually refresh
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'customer':
        return a.customer_name.localeCompare(b.customer_name);
      case 'amount':
        return b.total - a.total;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الفواتير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">خطأ في تحميل الفواتير: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الفواتير</h1>
          <p className="text-gray-600">إدارة فواتير العملاء والطلبات</p>
        </div>
        <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          فاتورة جديدة
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="البحث بالاسم أو رقم الفاتورة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="sort">ترتيب حسب</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">التاريخ</option>
                <option value="customer">اسم العميل</option>
                <option value="amount">المبلغ</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>الفواتير ({sortedInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد فواتير</p>
              <Button onClick={handleCreateInvoice} className="mt-4">
                إنشاء فاتورة جديدة
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>المدفوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customer_name}</div>
                        {invoice.customer_phone && (
                          <div className="text-sm text-gray-500">{invoice.customer_phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {InvoiceService.formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      {InvoiceService.formatCurrency(invoice.paid_amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={InvoiceService.getStatusBadgeColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {InvoiceService.formatDate(invoice.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                            <Eye className="w-4 h-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" />
                            طباعة
                          </DropdownMenuItem>
                          {invoice.status !== 'مدفوع' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              وضع علامة مدفوع
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Invoice Dialog */}
      <NewInvoiceDialogWithDB 
        isOpen={isNewInvoiceOpen} 
        onOpenChange={setIsNewInvoiceOpen}
        onInvoiceCreated={handleInvoiceCreated}
      />

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <InvoiceDetailsDialog
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}


