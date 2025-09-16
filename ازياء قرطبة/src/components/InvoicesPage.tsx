import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  Upload,
  Calendar as CalendarIcon
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  const invoices = [
    {
      id: 'INV-001',
      customerName: 'أحمد محمد',
      phone: '07701234567',
      total: 250,
      createdDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      status: 'مدفوع',
      fabricImage: 'https://images.unsplash.com/photo-1642683497706-77a72ea549bb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&fit=crop'
    },
    {
      id: 'INV-002',
      customerName: 'محمد تقي',
      phone: '07807654321',
      total: 180,
      createdDate: '2024-01-14',
      deliveryDate: '2024-01-22',
      status: 'معلق',
      fabricImage: 'https://images.unsplash.com/photo-1716541424785-f9746ae08cad?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&h=100&fit=crop'
    },
    {
      id: 'INV-003',
      customerName: 'محمد خالد',
      phone: '07909876543',
      total: 420,
      createdDate: '2024-01-10',
      deliveryDate: '2024-01-20',
      status: 'جزئي',
      fabricImage: 'https://images.unsplash.com/photo-1564322955387-0d2def79fb5c?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=100&h=100&fit=crop'
    },
    {
      id: 'INV-004',
      customerName: 'صالح محمد',
      phone: '07512345678',
      total: 320,
      createdDate: '2024-01-12',
      deliveryDate: '2024-01-28',
      status: 'مدفوع',
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

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.includes(searchTerm) ||
    invoice.phone.includes(searchTerm) ||
    invoice.id.includes(searchTerm)
  );

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'customer':
        return a.customerName.localeCompare(b.customerName);
      case 'total':
        return b.total - a.total;
      default:
        return 0;
    }
  });

  const handleExportPDF = (invoiceId: string) => {
    console.log('Exporting PDF for:', invoiceId);
    // PDF export logic would go here
  };

  const handleShareWhatsApp = (invoice: any) => {
    const message = `فاتورة رقم: ${invoice.id}\nالزبون: ${invoice.customerName}\nالمبلغ: ${invoice.total} دينار عراقي`;
    const whatsappUrl = `https://wa.me/${invoice.phone.replace(/^0/, '964')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveAsImage = (invoiceId: string) => {
    console.log('Saving as image:', invoiceId);
    // Image export logic would go here
  };

  const NewInvoiceDialog = () => (
    <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F6E9CA] border-[#C69A72]">
        <DialogHeader>
          <DialogTitle className="text-[#13312A] arabic-text">إنشاء فاتورة جديدة</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل بيانات الزبون والطلب لإصدار الفاتورة
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6">
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">بيانات الزبون</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">اسم الزبون</Label>
                <Input placeholder="أدخل اسم الزبون" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">رقم الهاتف</Label>
                <Input placeholder="077xxxxxxxx" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-[#13312A] arabic-text">العنوان</Label>
                <Input placeholder="أدخل العنوان" className="bg-white border-[#C69A72] text-right" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">القياسات</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">الطول</Label>
                <Input placeholder="سم" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الكتف</Label>
                <Input placeholder="سم" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الخصر</Label>
                <Input placeholder="سم" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الصدر</Label>
                <Input placeholder="سم" className="bg-white border-[#C69A72] text-right" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">تفاصيل التصميم</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">نوع القماش</Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#C69A72]">
                    <SelectValue placeholder="اختر نوع القماش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton">قطن</SelectItem>
                    <SelectItem value="silk">حرير</SelectItem>
                    <SelectItem value="wool">صوف</SelectItem>
                    <SelectItem value="linen">كتان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">نوع الياقة</Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#C69A72]">
                    <SelectValue placeholder="اختر نوع الياقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">عادية</SelectItem>
                    <SelectItem value="mandarin">صينية</SelectItem>
                    <SelectItem value="formal">رسمية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">أسلوب الصدر</Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#C69A72]">
                    <SelectValue placeholder="اختر أسلوب الصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">صدر واحد</SelectItem>
                    <SelectItem value="double">صدر مزدوج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">نهاية الكم</Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#C69A72]">
                    <SelectValue placeholder="اختر نهاية الكم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cuff">كم بحاشية</SelectItem>
                    <SelectItem value="plain">كم عادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">المبالغ والتواريخ</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">المبلغ الكلي</Label>
                <Input placeholder="دينار عراقي" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">المدفوع</Label>
                <Input placeholder="دينار عراقي" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">تاريخ التسليم</Label>
                <div className="relative">
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#155446] w-4 h-4" />
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    className="pr-10 bg-white border-[#C69A72] text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">ملاحظات وصور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#13312A] arabic-text">ملاحظات إضافية</Label>
                <Textarea placeholder="أضف أي ملاحظات خاصة..." className="bg-white border-[#C69A72] text-right min-h-20" />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">صورة القماش</Label>
                <div className="border-2 border-dashed border-[#C69A72] rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-[#155446] mb-2" />
                  <p className="text-[#155446] arabic-text">اضغط لرفع صورة القماش</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewInvoiceOpen(false)}
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
            >
              إلغاء
            </Button>
            <Button className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]">
              حفظ الفاتورة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl text-[#13312A] arabic-text">إدارة الفواتير</h1>
        <Button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target"
        >
          <Plus className="w-4 h-4 ml-2" />
          <span className="arabic-text">فاتورة جديدة</span>
        </Button>
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
                <TableHead className="text-[#F6E9CA] arabic-text text-right">تاريخ الإنشاء</TableHead>
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
                  <TableCell className="text-[#13312A]">{invoice.total} دينار عراقي</TableCell>
                  <TableCell>
                    <ImageWithFallback
                      src={invoice.fabricImage}
                      alt="صورة القماش"
                      className="w-12 h-12 rounded-lg object-cover border border-[#C69A72]"
                    />
                  </TableCell>
                  <TableCell className="text-[#13312A]">{invoice.createdDate}</TableCell>
                  <TableCell className="text-[#13312A]">{invoice.deliveryDate}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleExportPDF(invoice.id)} className="arabic-text">
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
                <p className="text-[#155446] arabic-text">المبلغ: {invoice.total} دينار عراقي</p>
                <p className="text-[#155446] arabic-text">الإنشاء: {invoice.createdDate}</p>
                <p className="text-[#155446] arabic-text">التسليم: {invoice.deliveryDate}</p>
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
                  onClick={() => handleExportPDF(invoice.id)}
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

      <NewInvoiceDialog />
    </div>
  );
}
