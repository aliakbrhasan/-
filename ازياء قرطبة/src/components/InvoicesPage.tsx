import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
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
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

const mobileDateFormatter = new Intl.DateTimeFormat('ar-IQ', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatMobileDate = (value: string) => mobileDateFormatter.format(new Date(value));

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
  onCreateInvoice: () => void;
}

type InvoiceStatus = 'مدفوع' | 'معلق' | 'جزئي' | string;

type Invoice = PrintableInvoiceData & {
  status: InvoiceStatus;
  fabricImage: string;
};

export function InvoicesPage({ onCreateInvoice }: InvoicesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      customerName: 'أحمد محمد',
      phone: '07701234567',
      address: 'بغداد، منطقة الكرخ',
      total: 250,
      paid: 250,
      receivedDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      status: 'مدفوع',
      notes: 'تم الدفع بالكامل مع طلب تجهيز خاص بالياقة.',
      fabricImage: 'https://images.unsplash.com/photo-1642683497706-77a72ea549bb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&fit=crop'
    },
    {
      id: 'INV-002',
      customerName: 'محمد تقي',
      phone: '07807654321',
      address: 'البصرة، حي العشار',
      total: 180,
      paid: 90,
      receivedDate: '2024-01-14',
      deliveryDate: '2024-01-22',
      status: 'معلق',
      notes: 'المتبقي يستلم عند التسليم النهائي بعد المعاينة.',
      fabricImage: 'https://images.unsplash.com/photo-1716541424785-f9746ae08cad?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&h=100&fit=crop'
    },
    {
      id: 'INV-003',
      customerName: 'محمد خالد',
      phone: '07909876543',
      address: 'الموصل، حي الزراعة',
      total: 420,
      paid: 220,
      receivedDate: '2024-01-10',
      deliveryDate: '2024-01-20',
      status: 'جزئي',
      notes: 'إضافة تطريز يدوي في الأكمام.',
      fabricImage: 'https://images.unsplash.com/photo-1564322955387-0d2def79fb5c?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&h=100&fit=crop'
    },
    {
      id: 'INV-004',
      customerName: 'صالح محمد',
      phone: '07512345678',
      address: 'أربيل، حي عينكاوة',
      total: 320,
      paid: 320,
      receivedDate: '2024-01-12',
      deliveryDate: '2024-01-28',
      status: 'مدفوع',
      notes: 'طلب تغليف خاص بالهدية.',
      fabricImage: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=100&h=100&fit=crop'
    }
  ];

  const receivedTimes = invoices.map((invoice) => new Date(invoice.receivedDate).getTime());
  const fallbackYear = new Date().getFullYear().toString();
  const initialFromYear = receivedTimes.length ? new Date(Math.min(...receivedTimes)).getFullYear().toString() : fallbackYear;
  const initialToYear = receivedTimes.length ? new Date(Math.max(...receivedTimes)).getFullYear().toString() : fallbackYear;

  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [fromDateParts, setFromDateParts] = useState<DateParts>(() => ({
    year: initialFromYear,
    month: '',
    day: '',
  }));
  const [toDateParts, setToDateParts] = useState<DateParts>(() => ({
    year: initialToYear,
    month: '',
    day: '',
  }));
  const [printError, setPrintError] = useState<string | null>(null);

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

  const getStatusPrintStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'مدفوع':
        return {
          backgroundColor: 'rgba(21, 84, 70, 0.12)',
          color: '#155446',
          border: '1px solid rgba(21, 84, 70, 0.35)',
        };
      case 'معلق':
        return {
          backgroundColor: 'rgba(190, 49, 68, 0.12)',
          color: '#8f1d2c',
          border: '1px solid rgba(190, 49, 68, 0.35)',
        };
      case 'جزئي':
        return {
          backgroundColor: 'rgba(246, 196, 120, 0.2)',
          color: '#8a5a00',
          border: '1px solid rgba(246, 196, 120, 0.45)',
        };
      default:
        return {
          backgroundColor: 'rgba(198, 154, 114, 0.2)',
          color: '#13312A',
          border: '1px solid rgba(198, 154, 114, 0.4)',
        };
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.includes(searchTerm) ||
    invoice.phone.includes(searchTerm) ||
    invoice.id.includes(searchTerm) ||
    (invoice.address?.includes(searchTerm) ?? false)
  );

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
      case 'customer':
        return a.customerName.localeCompare(b.customerName);
      case 'total':
        return b.total - a.total;
      default:
        return 0;
    }
  });

  const handlePrintInvoices = (rangeStart: Date, rangeEnd: Date) => {
    const invoicesInRange = sortedInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.receivedDate);
      return invoiceDate >= rangeStart && invoiceDate <= rangeEnd;
    });

    const totalAmount = invoicesInRange.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalPaid = invoicesInRange.reduce((sum, invoice) => sum + invoice.paid, 0);
    const totalRemaining = invoicesInRange.reduce((sum, invoice) => sum + Math.max(invoice.total - invoice.paid, 0), 0);
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
                  const remaining = Math.max(invoice.total - invoice.paid, 0);
                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.customerName}</td>
                      <td>{invoice.phone}</td>
                      <td>{formatDate(invoice.receivedDate)}</td>
                      <td>{formatDate(invoice.deliveryDate)}</td>
                      <td>{formatCurrency(invoice.total)}</td>
                      <td>{formatCurrency(invoice.paid)}</td>
                      <td>{formatCurrency(remaining)}</td>
                      <td>
                        <span className="status-pill" style={getStatusPrintStyle(invoice.status)}>
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

        <section className="print-section">
          <h2 className="section-title">تفاصيل الفواتير</h2>
          <p className="section-description">
            تم تجهيز هذه البطاقات لتعرض بيانات الزبون والملاحظات المرتبطة بكل فاتورة.
            {invoicesInRange.length === 0 && ' لا توجد فواتير ضمن الفترة المحددة حالياً.'}
          </p>
          <div className="detail-cards">
            {invoicesInRange.map((invoice) => {
              const remaining = Math.max(invoice.total - invoice.paid, 0);
              return (
                <article className="detail-card" key={`${invoice.id}-details`}>
                  <div className="detail-card-header">
                    <h3 className="detail-title">{invoice.customerName}</h3>
                    <span className="status-pill" style={getStatusPrintStyle(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </div>
                  <div className="detail-grid two-column">
                    <div className="detail-item">
                      <span className="item-label">رقم الفاتورة</span>
                      <span className="item-value">{invoice.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">الهاتف</span>
                      <span className="item-value">{invoice.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">تاريخ الاستلام</span>
                      <span className="item-value">{formatDate(invoice.receivedDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">تاريخ التسليم</span>
                      <span className="item-value">{formatDate(invoice.deliveryDate)}</span>
                    </div>
                  </div>
                  <div className="detail-grid two-column">
                    <div className="detail-item">
                      <span className="item-label">المبلغ الكلي</span>
                      <span className="item-value">{formatCurrency(invoice.total)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">المبلغ الواصل</span>
                      <span className="item-value">{formatCurrency(invoice.paid)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">المبلغ المتبقي</span>
                      <span className="item-value">{formatCurrency(remaining)}</span>
                    </div>
                  </div>
                  {invoice.address && (
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="item-label">العنوان</span>
                        <span className="item-value">{invoice.address}</span>
                      </div>
                    </div>
                  )}
                  {invoice.notes && (
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="item-label">ملاحظات</span>
                        <span className="item-value">{invoice.notes}</span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
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

  const handleExportPDF = (invoice: Invoice) => {
    const receiptWindow = window.open('', '_blank', 'width=900,height=700');

    if (!receiptWindow) {
      return;
    }

    const markup = renderToStaticMarkup(<PrintableInvoice invoice={invoice} />);

    receiptWindow.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charSet="utf-8" />
    <title>فاتورة ${invoice.id}</title>
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

  const handleShareWhatsApp = (invoice: Invoice) => {
    const remaining = Math.max(invoice.total - invoice.paid, 0);
    const message = [
      `فاتورة رقم: ${invoice.id}`,
      `الزبون: ${invoice.customerName}`,
      `المبلغ الكلي: ${formatCurrency(invoice.total)}`,
      `المبلغ الواصل: ${formatCurrency(invoice.paid)}`,
      `المبلغ المتبقي: ${formatCurrency(remaining)}`,
      `تاريخ الاستلام: ${formatDate(invoice.receivedDate)}`,
      `تاريخ التسليم: ${formatDate(invoice.deliveryDate)}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${invoice.phone.replace(/^0/, '964')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveAsImage = (invoiceId: string) => {
    console.log('Saving as image:', invoiceId);
    // Image export logic would go here
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl text-[#13312A] arabic-text">إدارة الفواتير</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={openPrintDialog}
            className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target"
          >
            <Printer className="w-4 h-4 ml-2" />
            <span className="arabic-text">طباعة القائمة</span>
          </Button>
          <Button
            onClick={onCreateInvoice}
            className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target"
          >
            <Plus className="w-4 h-4 ml-2" />
            <span className="arabic-text">فاتورة جديدة</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border-[#C69A72]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#155446] w-4 h-4" />
              <Input
                placeholder="بحث عن الفواتير، الزبائن، أو أرقام الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white border-[#C69A72] text-right"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target"
              >
                <option value="date">فرز حسب التاريخ</option>
                <option value="customer">فرز حسب الزبون</option>
                <option value="total">فرز حسب المبلغ</option>
              </select>
              <Button variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target">
                <Filter className="w-4 h-4 ml-2" />
                <span className="arabic-text">تصفية</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table - Desktop */}
      <Card className="bg-white border-[#C69A72] hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#13312A] hover:bg-[#13312A]">
                <TableHead className="text-[#F6E9CA] arabic-text text-right">رقم الفاتورة</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">الزبون</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">الهاتف</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">المبلغ</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">صورة القماش</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">تاريخ الاستلام</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">تاريخ التسليم</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">الحالة</TableHead>
                <TableHead className="text-[#F6E9CA] arabic-text text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-[#F6E9CA]">
                  <TableCell className="text-[#13312A] arabic-text">{invoice.id}</TableCell>
                  <TableCell className="text-[#13312A] arabic-text">{invoice.customerName}</TableCell>
                  <TableCell className="text-[#13312A]">{invoice.phone}</TableCell>
                  <TableCell className="text-[#13312A]">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    <ImageWithFallback
                      src={invoice.fabricImage}
                      alt="صورة القماش"
                      className="w-12 h-12 rounded-lg object-cover border border-[#C69A72]"
                    />
                  </TableCell>
                  <TableCell className="text-[#13312A]">{formatDate(invoice.receivedDate)}</TableCell>
                  <TableCell className="text-[#13312A]">{formatDate(invoice.deliveryDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 touch-target">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#C69A72]">
                        <DropdownMenuItem className="arabic-text">
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل الفاتورة
                        </DropdownMenuItem>
                        <DropdownMenuItem className="arabic-text">
                          <Copy className="w-4 h-4 ml-2" />
                          تكرار الفاتورة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportPDF(invoice)} className="arabic-text">
                          <Download className="w-4 h-4 ml-2" />
                          تصدير إلى PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareWhatsApp(invoice)} className="arabic-text">
                          <MessageCircle className="w-4 h-4 ml-2" />
                          مشاركة عبر واتساب
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSaveAsImage(invoice.id)} className="arabic-text">
                          <FileImage className="w-4 h-4 ml-2" />
                          حفظ كصورة
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoices Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {sortedInvoices.map((invoice) => {
          const formattedReceivedDate = formatMobileDate(invoice.receivedDate);
          const formattedDeliveryDate = formatMobileDate(invoice.deliveryDate);

          return (
            <Card key={invoice.id} className="bg-white border-[#C69A72] shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-1 text-right">
                    <h3 className="text-lg font-semibold text-[#13312A] arabic-text">{invoice.customerName}</h3>
                    <p className="text-sm text-[#7A6A58] arabic-text">رقم الفاتورة: {invoice.id}</p>
                    <p className="text-sm text-[#155446] arabic-text">الهاتف: {invoice.phone}</p>
                  </div>
                  <ImageWithFallback
                    src={invoice.fabricImage}
                    alt="صورة القماش"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#C69A72] shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-[#13312A] arabic-text">{formatCurrency(invoice.total)}</span>
                  <Badge
                    className={`${getStatusColor(invoice.status)} arabic-text px-3 py-1 text-sm font-medium rounded-full shadow-sm`}
                  >
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm arabic-text">
                  <div className="flex items-center justify-between text-[#155446]">
                    <span className="text-[#7A6A58]">تاريخ الاستلام</span>
                    <span className="font-medium text-[#13312A]">{formattedReceivedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#155446]">
                    <span className="text-[#7A6A58]">تاريخ التسليم</span>
                    <span className="font-medium text-[#13312A]">{formattedDeliveryDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target flex-1 min-w-[8rem]"
                  >
                    <Edit className="w-4 h-4 ml-1" />
                    <span className="arabic-text">تعديل</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleExportPDF(invoice)}
                    className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target flex-1 min-w-[8rem]"
                  >
                    <Download className="w-4 h-4 ml-1" />
                    <span className="arabic-text">PDF</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleShareWhatsApp(invoice)}
                    className="bg-green-600 hover:bg-green-700 text-white touch-target flex-1 min-w-[8rem]"
                  >
                    <MessageCircle className="w-4 h-4 ml-1" />
                    <span className="arabic-text">واتساب</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                    <Label className="text-[#13312A] arabic-text">السنة</Label>
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
                    <Label className="text-[#13312A] arabic-text">الشهر</Label>
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
                    <Label className="text-[#13312A] arabic-text">اليوم</Label>
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
                    <Label className="text-[#13312A] arabic-text">السنة</Label>
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
                    <Label className="text-[#13312A] arabic-text">الشهر</Label>
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
                    <Label className="text-[#13312A] arabic-text">اليوم</Label>
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

    </div>
  );
}
