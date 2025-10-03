import { useState, useMemo, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useInvoices } from '@/hooks/useInvoices';
import {
  Plus,
  Search,
  Filter,
  Download,
  Copy,
  Edit,
  MoreVertical,
  FileImage,
  Printer,
  Eye,
  CheckCircle,
  FilterX,
  RefreshCw,
} from 'lucide-react';
import { NewInvoiceDialogWithDB } from './NewInvoiceDialogWithDB';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog';
import {
  PrintableInvoice,
  receiptStyles,
  formatCurrency,
  formatDate,
  PrintableInvoiceData,
} from './PrintableInvoice';
import { openPrintWindow, formatPrintDateTime } from './print/PrintUtils';

type DateParts = {
  year: string;
  month: string;
  day: string;
};

const monthOptions = [
  { value: '1', label: 'كانون الثاني (يناير)' },
  { value: '2', label: 'شباط (فبراير)' },
  { value: '3', label: 'آذار (مارس)' },
  { value: '4', label: 'نيسان (أبريل)' },
  { value: '5', label: 'أيار (مايو)' },
  { value: '6', label: 'حزيران (يونيو)' },
  { value: '7', label: 'تموز (يوليو)' },
  { value: '8', label: 'آب (أغسطس)' },
  { value: '9', label: 'أيلول (سبتمبر)' },
  { value: '10', label: 'تشرين الأول (أكتوبر)' },
  { value: '11', label: 'تشرين الثاني (نوفمبر)' },
  { value: '12', label: 'كانون الأول (ديسمبر)' },
];

const dayOptions = Array.from({ length: 31 }, (_, index) => (index + 1).toString());

const getLastDayOfMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const formatRangeDate = (date: Date) =>
  new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

const buildBoundaryDate = (parts: DateParts, isStart: boolean): Date | null => {
  const year = parseInt(parts.year, 10);

  if (Number.isNaN(year)) {
    return null;
  }

  const month = parts.month ? parseInt(parts.month, 10) : isStart ? 1 : 12;

  if (Number.isNaN(month) || month < 1 || month > 12) {
    return null;
  }

  const lastDay = getLastDayOfMonth(year, month);

  let day: number;

  if (parts.day) {
    const parsedDay = parseInt(parts.day, 10);

    if (Number.isNaN(parsedDay) || parsedDay < 1) {
      return null;
    }

    day = Math.min(parsedDay, lastDay);
  } else {
    day = isStart ? 1 : lastDay;
  }

  const boundary = new Date(year, month - 1, day);

  if (isStart) {
    boundary.setHours(0, 0, 0, 0);
  } else {
    boundary.setHours(23, 59, 59, 999);
  }

  return boundary;
};

interface InvoicesPageProps {
  onCreateInvoice?: () => void;
  onViewInvoiceDetails?: (invoiceId: string) => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoicesPageWithDB({ onCreateInvoice, onViewInvoiceDetails, onMarkAsPaid }: InvoicesPageProps) {
  const { invoices, loading, error, markAsPaid: markInvoiceAsPaid, loadInvoices } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (loadInvoices) {
        loadInvoices();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadInvoices]);

  // Print dialog states
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [fromDateParts, setFromDateParts] = useState<DateParts>(() => ({
    year: new Date().getFullYear().toString(),
    month: '',
    day: '',
  }));
  const [toDateParts, setToDateParts] = useState<DateParts>(() => ({
    year: new Date().getFullYear().toString(),
    month: '',
    day: '',
  }));
  const [printError, setPrintError] = useState<string | null>(null);
  
  // Column width states
  const [columnWidths, setColumnWidths] = useState({
    invoiceNumber: 120,
    customerName: 200,
    phone: 120,
    totalAmount: 120,
    paidAmount: 120,
    remainingAmount: 120,
    receivedDate: 140,
    deliveryDate: 140,
    status: 100,
    actions: 120
  });
  
  // Resize states
  const [isResizing, setIsResizing] = useState<string | null>(null);
 
  // Helper functions

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, column: keyof typeof columnWidths) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentWidth = columnWidths[column];
    
    setIsResizing(column);
    
    // Throttle function for better performance
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps
    
    // Add event listeners for mouse/touch move and end
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;
      
      moveEvent.preventDefault();
      const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const diff = moveClientX - clientX;
      const newWidth = currentWidth + diff;
      
      // Update immediately for smooth experience
      setColumnWidths(prev => ({
        ...prev,
        [column]: Math.max(80, Math.min(400, newWidth))
      }));
    };
    
    const handleEnd = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    // Use passive: false to allow preventDefault
    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  // Resize handle component
  const ResizeHandle = ({ column }: { column: keyof typeof columnWidths }) => (
    <div
      className={`absolute top-0 right-0 w-3 h-full cursor-col-resize transition-all duration-200 group ${
        isResizing === column ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-200'
      }`}
      onMouseDown={(e) => handleResizeStart(e, column)}
      onTouchStart={(e) => handleResizeStart(e, column)}
      style={{ touchAction: 'none' }}
      title="اسحب لتغيير عرض العمود"
    >
      {/* Visual indicator - only visible on hover */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 group-hover:bg-blue-700 transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100" />
      
      {/* Additional visual cues */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-gray-300 group-hover:bg-blue-600 transition-all duration-200" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-gray-300 group-hover:bg-blue-600 transition-all duration-200 rotate-45" />
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'معلق': return 'bg-red-100 text-red-800';
      case 'جزئي': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'معلق':
        return 'غير مدفوع';
      case 'جزئي':
        return 'مدفوع جزئياً';
      default:
        return status;
    }
  };

  const canMarkAsPaid = (invoice: any) => {
    return invoice.status === 'معلق' || invoice.status === 'جزئي';
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await markInvoiceAsPaid(invoiceId);
      // Refresh data immediately after marking as paid
      if (loadInvoices) {
        await loadInvoices();
      }
      if (onMarkAsPaid) {
        onMarkAsPaid(invoiceId);
      }
      // Show success message
      alert('تم تمييز الفاتورة كمدفوعة بنجاح!');
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      // Show error message with more details
      alert(`حدث خطأ في تمييز الفاتورة كمدفوعة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  // Handle view invoice details
  const handleViewDetails = (invoice: any) => {
    // Transform invoice to match InvoiceDetailsDialog expected format
    const transformedInvoice = {
      id: invoice.invoice_number,
      customerName: invoice.customer_name,
      phone: invoice.customer_phone || '',
      address: invoice.customer_address || '',
      total: invoice.total,
      paid: invoice.paid_amount,
      receivedDate: invoice.invoice_date || invoice.created_at || new Date().toISOString(),
      deliveryDate: invoice.due_date || invoice.invoice_date || invoice.created_at || new Date().toISOString(),
      notes: invoice.notes || '',
      status: invoice.status,
      fabricImage: 'https://images.unsplash.com/photo-1642683497706-77a72ea549bb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&fit=crop',
      measurements: {
        length: 180,
        shoulder: 45,
        waist: 90,
        chest: 100
      },
      designDetails: {
        fabricType: ['قطن'],
        fabricSource: ['داخل المحل'],
        collarType: ['عادية'],
        chestStyle: ['صدر واحد'],
        sleeveEnd: ['كم عادي']
      }
    };
    
    setSelectedInvoice(transformedInvoice);
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
  const handleInvoiceCreated = async () => {
    // Refresh data immediately after creating invoice
    if (loadInvoices) {
      await loadInvoices();
    }
  };

  // Print functions
  const openPrintDialog = () => {
    setPrintError(null);
    setIsPrintDialogOpen(true);
  };

  const handlePrintDialogOpenChange = (open: boolean) => {
    setIsPrintDialogOpen(open);
    if (!open) {
      setPrintError(null);
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    const receiptWindow = window.open('', '_blank', 'width=900,height=700');

    if (!receiptWindow) {
      return;
    }

    // Transform invoice to PrintableInvoiceData format
    const printableInvoice: PrintableInvoiceData = {
      id: invoice.invoice_number,
      customerName: invoice.customer_name,
      phone: invoice.customer_phone || '',
      address: invoice.customer_address || '',
      total: invoice.total,
      paid: invoice.paid_amount,
      receivedDate: invoice.invoice_date || invoice.created_at || new Date().toISOString(),
      deliveryDate: invoice.due_date || invoice.invoice_date || invoice.created_at || new Date().toISOString(),
      notes: invoice.notes || ''
    };

    const markup = renderToStaticMarkup(<PrintableInvoice invoice={printableInvoice} />);

    receiptWindow.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charSet="utf-8" />
    <title>فاتورة ${invoice.invoice_number}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>${receiptStyles}</style>
  </head>
  <body>
    ${markup}
    <script>
      window.onload = () => {
        window.focus();
        setTimeout(() => window.print(), 300);
      };
    <\/script>
  </body>
</html>`);
    receiptWindow.document.close();
    receiptWindow.focus();
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      // Search filter
      const matchesSearch = invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.customer_phone?.includes(searchTerm) ?? false) ||
        (invoice.customer_address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const invoiceDate = new Date(invoice.invoice_date || invoice.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today':
            matchesDate = daysDiff === 0;
            break;
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          case 'quarter':
            matchesDate = daysDiff <= 90;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort filtered results
    return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'date':
          return new Date(b.invoice_date || b.created_at).getTime() - new Date(a.invoice_date || a.created_at).getTime();
      case 'customer':
        return a.customer_name.localeCompare(b.customer_name);
      case 'amount':
        return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
  }, [invoices, searchTerm, statusFilter, dateFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedInvoices.length;
    const paid = filteredAndSortedInvoices.filter(inv => inv.status === 'مدفوع').length;
    const pending = filteredAndSortedInvoices.filter(inv => inv.status === 'معلق').length;
    const partial = filteredAndSortedInvoices.filter(inv => inv.status === 'جزئي').length;
    const totalAmount = filteredAndSortedInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidAmount = filteredAndSortedInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
    
    return { total, paid, pending, partial, totalAmount, paidAmount };
  }, [filteredAndSortedInvoices]);

  // Print report functions
  const handlePrintInvoices = (rangeStart: Date, rangeEnd: Date) => {
    const invoicesInRange = filteredAndSortedInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoice_date || invoice.created_at);
      return invoiceDate >= rangeStart && invoiceDate <= rangeEnd;
    });

    const totalAmount = invoicesInRange.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalPaid = invoicesInRange.reduce((sum, invoice) => sum + invoice.paid_amount, 0);
    const totalRemaining = invoicesInRange.reduce((sum, invoice) => sum + Math.max(invoice.total - invoice.paid_amount, 0), 0);
    const statusCounts = invoicesInRange.reduce<Record<string, number>>((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {});
    const now = new Date();
    const rangeLabel = `${formatRangeDate(rangeStart)} إلى ${formatRangeDate(rangeEnd)}`;

    openPrintWindow('قائمة الفواتير', (
      <>
        <header className="print-header">
          <h1 className="print-title">سجل الفواتير</h1>
          <p className="print-subtitle">قائمة تفصيلية بالفواتير المسجلة في نظام أزياء قرطبة</p>
          <div className="print-meta">
            <span>تاريخ الطباعة: {formatPrintDateTime(now)}</span>
            <span>عدد الفواتير: {invoicesInRange.length}</span>
            <span>الفترة المختارة: {rangeLabel}</span>
          </div>
        </header>

        <section className="print-section">
          <h2 className="section-title">ملخص الأرقام</h2>
          <div className="metrics-grid">
            <div className="metric-card accent">
              <span className="metric-label">إجمالي قيمة الفواتير</span>
              <span className="metric-value">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">المبالغ المستلمة</span>
              <span className="metric-value">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">المبالغ المتبقية</span>
              <span className="metric-value">{formatCurrency(totalRemaining)}</span>
            </div>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div className="metric-card" key={status}>
                <span className="metric-label">فواتير {getStatusLabel(status)}</span>
                <span className="metric-value">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section">
          <h2 className="section-title">جدول الفواتير</h2>
          <p className="section-description">
            يتضمن الجدول التفاصيل الأساسية لكل فاتورة بما في ذلك حالة السداد ومواعيد التسليم.
            {invoicesInRange.length === 0 && ' لا توجد فواتير ضمن الفترة المحددة حالياً.'}
          </p>
          <div className="print-table-wrapper">
            <table className="print-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>الزبون</th>
                  <th>الهاتف</th>
                  <th>تاريخ الاستلام</th>
                  <th>تاريخ التسليم</th>
                  <th>المبلغ الكلي</th>
                  <th>المبلغ الواصل</th>
                  <th>المتبقي</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {invoicesInRange.map((invoice) => {
                  const remaining = Math.max(invoice.total - invoice.paid_amount, 0);
                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.invoice_number}</td>
                      <td>{invoice.customer_name}</td>
                      <td>{invoice.customer_phone || ''}</td>
                      <td>{formatDate(invoice.invoice_date || invoice.created_at)}</td>
                      <td>{formatDate(invoice.due_date || invoice.invoice_date || invoice.created_at)}</td>
                      <td>{formatCurrency(invoice.total)}</td>
                      <td>{formatCurrency(invoice.paid_amount)}</td>
                      <td>{formatCurrency(remaining)}</td>
                      <td>
                        <span className="status-pill" style={{
                          backgroundColor: invoice.status === 'مدفوع' ? 'rgba(21, 84, 70, 0.12)' : 
                                         invoice.status === 'معلق' ? 'rgba(190, 49, 68, 0.12)' : 
                                         'rgba(246, 196, 120, 0.2)',
                          color: invoice.status === 'مدفوع' ? '#155446' : 
                                 invoice.status === 'معلق' ? '#8f1d2c' : '#8a5a00',
                          border: invoice.status === 'مدفوع' ? '1px solid rgba(21, 84, 70, 0.35)' : 
                                  invoice.status === 'معلق' ? '1px solid rgba(190, 49, 68, 0.35)' : 
                                  '1px solid rgba(246, 196, 120, 0.45)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </>
    ));
  };

  const handleConfirmPrintRange = () => {
    setPrintError(null);

    const startDate = buildBoundaryDate(fromDateParts, true);
    const endDate = buildBoundaryDate(toDateParts, false);

    if (!startDate || !endDate) {
      setPrintError('يرجى تحديد سنة صالحة لكل من تاريخ البداية والنهاية.');
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      setPrintError('تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية.');
      return;
    }

    setIsPrintDialogOpen(false);
    handlePrintInvoices(startDate, endDate);
  };

  // Date change handlers
  const handleFromYearChange = (value: string) => {
    setFromDateParts((prev) => ({
      ...prev,
      year: value,
    }));
    setPrintError(null);
  };

  const handleToYearChange = (value: string) => {
    setToDateParts((prev) => ({
      ...prev,
      year: value,
    }));
    setPrintError(null);
  };

  const handleFromMonthChange = (value: string) => {
    setFromDateParts((prev) => ({
      ...prev,
      month: value,
      day: '',
    }));
    setPrintError(null);
  };

  const handleToMonthChange = (value: string) => {
    setToDateParts((prev) => ({
      ...prev,
      month: value,
      day: '',
    }));
    setPrintError(null);
  };

  const handleFromDayChange = (value: string) => {
    setFromDateParts((prev) => ({
      ...prev,
      day: value,
    }));
    setPrintError(null);
  };

  const handleToDayChange = (value: string) => {
    setToDateParts((prev) => ({
      ...prev,
      day: value,
    }));
    setPrintError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6E9CA] to-[#FDFBF7]">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155446] mx-auto mb-4"></div>
            <div className="text-[#13312A] arabic-text text-lg">جاري تحميل الفواتير...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6E9CA] to-[#FDFBF7]">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <div className="text-red-600 arabic-text text-lg mb-4">خطأ في تحميل الفواتير: {error}</div>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
            إعادة المحاولة
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6E9CA] to-[#FDFBF7]">
      <div className="container mx-auto p-4 space-y-6">
        {/* Enhanced Header (Title and Buttons) */}
        <div className="bg-white rounded-xl shadow-lg border border-[#C69A72]/20 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#13312A] arabic-text mb-1">إدارة الفواتير</h1>
              <p className="text-sm text-[#155446] arabic-text">إدارة شاملة لفواتير العملاء والطلبات</p>
        </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                className="bg-[#13312A] hover:bg-[#155446] text-[#F6E9CA] px-4 py-2 text-sm rounded-md flex items-center gap-2 arabic-text"
                onClick={handleCreateInvoice}
              >
                <Plus className="w-4 h-4" />
          فاتورة جديدة
        </Button>
              <Button
                className="bg-[#C69A72] hover:bg-[#A87B5A] text-[#13312A] px-4 py-2 text-sm rounded-md flex items-center gap-2 arabic-text"
                onClick={openPrintDialog}
              >
                <Printer className="w-4 h-4" />
                طباعة القائمة
              </Button>
              <Button
                className="bg-[#13312A] hover:bg-[#155446] text-[#F6E9CA] px-4 py-2 text-sm rounded-md flex items-center gap-2 arabic-text"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
      </div>

        {/* Statistics Cards - Now in a separate section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white text-[#13312A] p-3 rounded-lg text-center border border-[#C69A72]/20 shadow-sm">
            <div className="text-xl font-bold">{stats.total}</div>
            <div className="text-xs text-[#155446] arabic-text">إجمالي الفواتير</div>
          </div>
          <div className="bg-white text-[#13312A] p-3 rounded-lg text-center border border-[#C69A72]/20 shadow-sm">
            <div className="text-xl font-bold">{stats.paid}</div>
            <div className="text-xs text-[#155446] arabic-text">الفواتير المدفوعة</div>
          </div>
          <div className="bg-white text-[#13312A] p-3 rounded-lg text-center border border-[#C69A72]/20 shadow-sm">
            <div className="text-xl font-bold">{stats.pending}</div>
            <div className="text-xs text-[#155446] arabic-text">الفواتير المعلقة</div>
          </div>
          <div className="bg-white text-[#13312A] p-3 rounded-lg text-center border border-[#C69A72]/20 shadow-sm">
            <div className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-xs text-[#155446] arabic-text">إجمالي المبلغ</div>
          </div>
        </div>

        {/* Search and Basic Filters */}
        <Card className="bg-white rounded-xl shadow-lg border border-[#C69A72]/20">
        <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#155446] w-5 h-5" />
                <Input
                  placeholder="بحث عن الفواتير، الزبائن، أو أرقام الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 pl-4 py-3 bg-white border-2 border-[#C69A72]/30 rounded-xl text-right text-lg focus:border-[#155446] focus:ring-2 focus:ring-[#155446]/20 transition-all duration-300"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-2 border-[#C69A72]/30 rounded-xl">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ</SelectItem>
                    <SelectItem value="customer">اسم الزبون</SelectItem>
                    <SelectItem value="amount">المبلغ</SelectItem>
                    <SelectItem value="status">الحالة</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                    setSortBy('date');
                  }}
                  className="border-2 border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2 px-4 py-3 rounded-xl"
                >
                  <FilterX className="w-4 h-4" />
                  <span className="arabic-text">مسح الفلاتر</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="bg-white rounded-xl shadow-lg border border-[#C69A72]/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#13312A] arabic-text mb-4">تصفية متقدمة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-black arabic-text font-semibold mb-2 block">حالة الفاتورة</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-2 border-[#C69A72]/30 rounded-xl">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="مدفوع">مدفوع</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                      <SelectItem value="جزئي">جزئي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-black arabic-text font-semibold mb-2 block">الفترة الزمنية</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="border-2 border-[#C69A72]/30 rounded-xl">
                      <SelectValue placeholder="اختر الفترة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفترات</SelectItem>
                      <SelectItem value="today">اليوم</SelectItem>
                      <SelectItem value="week">آخر أسبوع</SelectItem>
                      <SelectItem value="month">آخر شهر</SelectItem>
                      <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-[#155446] hover:bg-[#13312A] text-white flex items-center gap-2 px-4 py-3 rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="arabic-text">تطبيق الفلاتر</span>
                  </Button>
            </div>
          </div>
        </CardContent>
      </Card>
        )}

      {/* Invoices Table */}
        {filteredAndSortedInvoices.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-lg border border-[#C69A72]/20">
            <CardContent className="p-16 text-center">
              <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#13312A] arabic-text mb-2">لا توجد فواتير</h3>
              <p className="text-[#155446] arabic-text mb-6">لم يتم العثور على فواتير تطابق معايير البحث</p>
              <Button
                onClick={handleCreateInvoice}
                className="bg-[#155446] hover:bg-[#13312A] text-white px-8 py-3 text-lg rounded-xl"
              >
                <Plus className="w-5 h-5 ml-2" />
                إنشاء فاتورة جديدة
              </Button>
            </CardContent>
          </Card>
          ) : (
          <Card className="bg-white rounded-xl shadow-lg border border-[#C69A72]/20 overflow-hidden">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#13312A] to-[#155446] hover:bg-gradient-to-r hover:from-[#13312A] hover:to-[#155446]">
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.invoiceNumber}px` }}
                       >
                         <div className="pr-2">
                           رقم الفاتورة
                         </div>
                         <ResizeHandle column="invoiceNumber" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.customerName}px` }}
                       >
                         <div className="pr-2">
                           الزبون
                         </div>
                         <ResizeHandle column="customerName" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.phone}px` }}
                       >
                         <div className="pr-2">
                           الهاتف
                         </div>
                         <ResizeHandle column="phone" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.totalAmount}px` }}
                       >
                         <div className="pr-2">
                           المبلغ الكلي
                         </div>
                         <ResizeHandle column="totalAmount" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.paidAmount}px` }}
                       >
                         <div className="pr-2">
                           المدفوع
                         </div>
                         <ResizeHandle column="paidAmount" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.remainingAmount}px` }}
                       >
                         <div className="pr-2">
                           المتبقي
                         </div>
                         <ResizeHandle column="remainingAmount" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.receivedDate}px` }}
                       >
                         <div className="pr-2">
                           تاريخ الاستلام
                         </div>
                         <ResizeHandle column="receivedDate" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.deliveryDate}px` }}
                       >
                         <div className="pr-2">
                           تاريخ التسليم
                         </div>
                         <ResizeHandle column="deliveryDate" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none group"
                         style={{ width: `${columnWidths.status}px` }}
                       >
                         <div className="pr-2">
                           الحالة
                         </div>
                         <ResizeHandle column="status" />
                       </TableHead>
                       <TableHead 
                         className="text-black arabic-text text-right font-bold text-base relative select-none"
                         style={{ width: `${columnWidths.actions}px` }}
                       >
                         الإجراءات
                       </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredAndSortedInvoices.map((invoice) => {
                    const remaining = Math.max(invoice.total - invoice.paid_amount, 0);
                    return (
                      <TableRow 
                        key={invoice.id} 
                        className="hover:bg-gradient-to-r hover:from-[#F6E9CA]/50 hover:to-[#FDFBF7] cursor-pointer transition-all duration-300 border-b border-[#C69A72]/20 hover:shadow-md hover:scale-[1.01]"
                        onClick={() => handleViewDetails(invoice)}
                      >
                         <TableCell 
                           className="text-black arabic-text font-semibold text-lg"
                           style={{ width: `${columnWidths.invoiceNumber}px` }}
                         >
                      {invoice.invoice_number}
                    </TableCell>
                         <TableCell 
                           className="text-black arabic-text font-medium"
                           style={{ width: `${columnWidths.customerName}px` }}
                         >
                           {invoice.customer_name}
                         </TableCell>
                         <TableCell 
                           className="text-black font-mono"
                           style={{ width: `${columnWidths.phone}px` }}
                         >
                           {invoice.customer_phone || '-'}
                         </TableCell>
                         <TableCell 
                           className="text-black font-bold text-lg"
                           style={{ width: `${columnWidths.totalAmount}px` }}
                         >
                           {formatCurrency(invoice.total)}
                         </TableCell>
                         <TableCell 
                           className="text-green-600 font-semibold"
                           style={{ width: `${columnWidths.paidAmount}px` }}
                         >
                           {formatCurrency(invoice.paid_amount)}
                         </TableCell>
                         <TableCell 
                           className="text-orange-600 font-semibold"
                           style={{ width: `${columnWidths.remainingAmount}px` }}
                         >
                           {formatCurrency(remaining)}
                    </TableCell>
                         <TableCell 
                           className="text-black"
                           style={{ width: `${columnWidths.receivedDate}px` }}
                         >
                           {formatDate(invoice.invoice_date || invoice.created_at)}
                    </TableCell>
                         <TableCell 
                           className="text-black"
                           style={{ width: `${columnWidths.deliveryDate}px` }}
                         >
                           {formatDate(invoice.due_date || invoice.invoice_date || invoice.created_at)}
                    </TableCell>
                    <TableCell 
                      style={{ width: `${columnWidths.status}px` }}
                    >
                          <Badge className={`${getStatusColor(invoice.status)} px-3 py-1 text-sm font-semibold rounded-full`}>
                            {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                         <TableCell 
                           onClick={(e) => e.stopPropagation()}
                           style={{ width: `${columnWidths.actions}px` }}
                         >
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintInvoice(invoice)}
                              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] hover:text-white rounded-lg transition-all duration-200 hover:scale-105"
                              aria-label={`طباعة فاتورة ${invoice.customer_name}`}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            
                            {canMarkAsPaid(invoice) && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 transition-all duration-200 hover:scale-105"
                                aria-label={`تم الدفع لفاتورة ${invoice.customer_name}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            
                      <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3">
                            <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border-[#C69A72] rounded-xl shadow-lg">
                                <DropdownMenuItem onClick={() => handleViewDetails(invoice)} className="arabic-text">
                                  <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                                <DropdownMenuItem className="arabic-text">
                                  <Edit className="w-4 h-4 ml-2" />
                                  تعديل الفاتورة
                          </DropdownMenuItem>
                                <DropdownMenuItem className="arabic-text">
                                  <Copy className="w-4 h-4 ml-2" />
                                  تكرار الفاتورة
                          </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePrintInvoice(invoice)} className="arabic-text">
                                  <Download className="w-4 h-4 ml-2" />
                                  تصدير إلى PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </div>
                    </TableCell>
                  </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            </div>
          </Card>
        )}

        {/* Print Dialog */}
        <Dialog open={isPrintDialogOpen} onOpenChange={handlePrintDialogOpenChange}>
          <DialogContent className="max-w-3xl bg-[#F6E9CA] border-[#C69A72]">
            <DialogHeader>
              <DialogTitle className="text-[#13312A] arabic-text">تحديد فترة الطباعة</DialogTitle>
              <DialogDescription className="text-[#155446] arabic-text">
                اختر تاريخ البداية والنهاية قبل طباعة قائمة الفواتير، ويمكنك توسيع الفترة أو تقليصها حسب الحاجة.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-[#C69A72] bg-[#FDFBF7] p-4">
                  <h3 className="text-lg font-semibold text-[#13312A] arabic-text">بداية الفترة (من)</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">السنة</Label>
                      <Input
                        type="number"
                        min={2000}
                        max={2100}
                        value={fromDateParts.year}
                        onChange={(e) => handleFromYearChange(e.target.value)}
                        placeholder="مثال: 2024"
                        className="border-[#C69A72] text-right arabic-text touch-target"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">الشهر</Label>
                      <select
                        value={fromDateParts.month}
                        onChange={(e) => handleFromMonthChange(e.target.value)}
                        className="px-3 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target focus:border-[#155446] focus:ring-1 focus:ring-[#155446]"
                      >
                        <option value="">من بداية السنة</option>
                        {monthOptions.map((month) => (
                          <option key={`from-month-${month.value}`} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">اليوم</Label>
                      <select
                        value={fromDateParts.day}
                        onChange={(e) => handleFromDayChange(e.target.value)}
                        disabled={!fromDateParts.month}
                        className="px-3 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target focus:border-[#155446] focus:ring-1 focus:ring-[#155446] disabled:cursor-not-allowed disabled:bg-[#E2D4BD] disabled:text-[#7A6A58]"
                      >
                        <option value="">من بداية الشهر</option>
                        {dayOptions.map((day) => (
                          <option key={`from-day-${day}`} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-[#C69A72] bg-[#FDFBF7] p-4">
                  <h3 className="text-lg font-semibold text-[#13312A] arabic-text">نهاية الفترة (إلى)</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">السنة</Label>
                      <Input
                        type="number"
                        min={2000}
                        max={2100}
                        value={toDateParts.year}
                        onChange={(e) => handleToYearChange(e.target.value)}
                        placeholder="مثال: 2024"
                        className="border-[#C69A72] text-right arabic-text touch-target"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">الشهر</Label>
                      <select
                        value={toDateParts.month}
                        onChange={(e) => handleToMonthChange(e.target.value)}
                        className="px-3 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target focus:border-[#155446] focus:ring-1 focus:ring-[#155446]"
                      >
                        <option value="">حتى نهاية السنة</option>
                        {monthOptions.map((month) => (
                          <option key={`to-month-${month.value}`} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-black arabic-text">اليوم</Label>
                      <select
                        value={toDateParts.day}
                        onChange={(e) => handleToDayChange(e.target.value)}
                        disabled={!toDateParts.month}
                        className="px-3 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target focus:border-[#155446] focus:ring-1 focus:ring-[#155446] disabled:cursor-not-allowed disabled:bg-[#E2D4BD] disabled:text-[#7A6A58]"
                      >
                        <option value="">حتى نهاية الشهر</option>
                        {dayOptions.map((day) => (
                          <option key={`to-day-${day}`} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#155446] arabic-text">
                ترك حقل الشهر أو اليوم فارغاً يعني طباعة الفترة الكاملة للسنة أو الشهر المحدد. سيتم استخدام تاريخ الاستلام لكل فاتورة لتحديد مدى الطباعة.
              </p>

              {printError && (
                <p className="text-sm text-red-600 arabic-text">{printError}</p>
              )}
            </div>

            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePrintDialogOpenChange(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleConfirmPrintRange}
                className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target"
              >
                بدء الطباعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
    </div>
  );
}


