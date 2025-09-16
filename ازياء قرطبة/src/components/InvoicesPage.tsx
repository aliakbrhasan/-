import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'معلق': return 'bg-red-100 text-red-800';
      case 'جزئي': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handlePrintInvoices = () => {
    const totalAmount = sortedInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalPaid = sortedInvoices.reduce((sum, invoice) => sum + invoice.paid, 0);
    const totalRemaining = sortedInvoices.reduce((sum, invoice) => sum + Math.max(invoice.total - invoice.paid, 0), 0);
    const statusCounts = sortedInvoices.reduce<Record<string, number>>((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {});
    const now = new Date();

    openPrintWindow('قائمة الفواتير', (
      <>
        <header className="print-header">
          <h1 className="print-title">سجل الفواتير</h1>
          <p className="print-subtitle">قائمة تفصيلية بالفواتير المسجلة في نظام أزياء قرطبة</p>
          <div className="print-meta">
            <span>تاريخ الطباعة: {formatPrintDateTime(now)}</span>
            <span>عدد الفواتير: {sortedInvoices.length}</span>
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
                <span className="metric-label">فواتير {status}</span>
                <span className="metric-value">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section">
          <h2 className="section-title">جدول الفواتير</h2>
          <p className="section-description">يتضمن الجدول التفاصيل الأساسية لكل فاتورة بما في ذلك حالة السداد ومواعيد التسليم.</p>
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
                {sortedInvoices.map((invoice) => {
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
                          {invoice.status}
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
          <p className="section-description">تم تجهيز هذه البطاقات لتعرض بيانات الزبون والملاحظات المرتبطة بكل فاتورة.</p>
          <div className="detail-cards">
            {sortedInvoices.map((invoice) => {
              const remaining = Math.max(invoice.total - invoice.paid, 0);
              return (
                <article className="detail-card" key={`${invoice.id}-details`}>
                  <div className="detail-card-header">
                    <h3 className="detail-title">{invoice.customerName}</h3>
                    <span className="status-pill" style={getStatusPrintStyle(invoice.status)}>
                      {invoice.status}
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
            onClick={handlePrintInvoices}
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
                      {invoice.status}
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
        {sortedInvoices.map((invoice) => (
          <Card key={invoice.id} className="bg-white border-[#C69A72]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg text-[#13312A] arabic-text mb-1">{invoice.customerName}</h3>
                  <p className="text-sm text-[#155446]">{invoice.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ImageWithFallback
                    src={invoice.fabricImage}
                    alt="صورة القماش"
                    className="w-12 h-12 rounded-lg object-cover border border-[#C69A72]"
                  />
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <p className="text-[#155446] arabic-text">الهاتف: {invoice.phone}</p>
                <p className="text-[#155446] arabic-text">المبلغ: {formatCurrency(invoice.total)}</p>
                <p className="text-[#155446] arabic-text">الاستلام: {formatDate(invoice.receivedDate)}</p>
                <p className="text-[#155446] arabic-text">التسليم: {formatDate(invoice.deliveryDate)}</p>
              </div>

              <div className="flex gap-2 overflow-x-auto">
                <Button size="sm" variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target whitespace-nowrap">
                  <Edit className="w-4 h-4 ml-1" />
                  <span className="arabic-text">تعديل</span>
                </Button>
                <Button size="sm" variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target whitespace-nowrap">
                  <Copy className="w-4 h-4 ml-1" />
                  <span className="arabic-text">تكرار</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleExportPDF(invoice)}
                  className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target whitespace-nowrap"
                >
                  <Download className="w-4 h-4 ml-1" />
                  <span className="arabic-text">PDF</span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleShareWhatsApp(invoice)}
                  className="bg-green-600 hover:bg-green-700 text-white touch-target whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 ml-1" />
                  <span className="arabic-text">واتساب</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
