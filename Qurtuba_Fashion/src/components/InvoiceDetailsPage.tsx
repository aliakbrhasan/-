import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Printer, 
  Share2, 
  Download, 
  FileImage, 
  User, 
  Ruler, 
  Scissors, 
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate, PrintableInvoiceData, PrintableInvoice } from './PrintableInvoice';
import { openPrintWindow } from './print/PrintUtils';
import { useInvoiceDetails } from '@/hooks/useInvoiceDetails';

interface InvoiceDetailsPageProps {
  invoiceId: string;
  onBack: () => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoiceDetailsPage({ invoiceId, onBack, onMarkAsPaid }: InvoiceDetailsPageProps) {
  const { invoiceDetails, isLoading, error } = useInvoiceDetails(invoiceId);

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6E9CA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#155446] mx-auto mb-4" />
          <p className="text-[#13312A] arabic-text">جاري تحميل تفاصيل الفاتورة...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error || !invoiceDetails) {
    return (
      <div className="min-h-screen bg-[#F6E9CA] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 arabic-text text-lg font-semibold mb-2">خطأ في تحميل الفاتورة</h2>
            <p className="text-red-600 arabic-text mb-4">{error || 'الفاتورة غير موجودة'}</p>
            <Button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white">
              العودة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const invoice = invoiceDetails;
  const remaining = Math.max(invoice.total - invoice.paid_amount, 0);
  const isPaid = invoice.status === 'مدفوع';
  const isPartiallyPaid = invoice.status === 'جزئي';
  const canMarkAsPaid = !isPaid && (invoice.status === 'معلق' || isPartiallyPaid);

  // تحويل البيانات للطباعة
  const printableInvoice: PrintableInvoiceData = {
    id: invoice.invoice_number,
    customerName: invoice.customer_name,
    phone: invoice.customer_phone || '',
    address: invoice.customer_address || '',
    total: invoice.total,
    paid: invoice.paid_amount,
    receivedDate: invoice.invoice_date,
    deliveryDate: invoice.due_date || invoice.invoice_date,
    notes: invoice.notes || ''
  };

  const handlePrint = () => {
    openPrintWindow(`فاتورة ${invoice.invoice_number}`, <PrintableInvoice invoice={printableInvoice} />);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `فاتورة ${invoice.invoice_number}`,
          text: `فاتورة ${invoice.customer_name} - ${formatCurrency(invoice.total)}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `فاتورة ${invoice.invoice_number}\nالزبون: ${invoice.customer_name}\nالمبلغ: ${formatCurrency(invoice.total)}`;
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleSaveAsPDF = () => {
    // This would typically use a library like jsPDF or html2pdf
    // For now, we'll use the print functionality
    handlePrint();
  };

  const handleMarkAsPaid = () => {
    if (onMarkAsPaid) {
      onMarkAsPaid(invoice.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'جزئي':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6E9CA]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C69A72]/30 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-[#155446] hover:bg-[#C69A72]/20 flex items-center gap-2 px-3 py-2"
              >
                <ArrowRight className="h-4 w-4" />
                العودة
              </Button>
              <div>
                <h1 className="text-lg font-bold text-[#13312A] arabic-text">
                  {invoice.customer_name}
                </h1>
                <p className="text-sm text-[#155446] arabic-text">
                  رقم الفاتورة: {invoice.invoice_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(invoice.status)} text-sm px-3 py-1`}>
                {invoice.status}
              </Badge>
              {canMarkAsPaid && (
                <Button
                  onClick={handleMarkAsPaid}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  تم الدفع
                </Button>
              )}
            </div>
          </div>
          
          {/* Action Buttons Row */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <Button
              onClick={handlePrint}
              className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] hover:text-white flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Share2 className="h-4 w-4" />
              مشاركة
            </Button>
            <Button
              onClick={handleSaveAsPDF}
              variant="outline"
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] hover:text-white flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Download className="h-4 w-4" />
              حفظ PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          {/* Summary and Customer Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* Invoice Summary */}
             <div className="bg-white rounded-lg border border-[#C69A72] p-4 shadow-sm">
               <div className="space-y-4">
                 {/* Header */}
                 <div className="text-center border-b border-[#C69A72]/20 pb-3">
                   <h2 className="text-xl font-bold text-[#13312A] arabic-text mb-2">ملخص الفاتورة</h2>
                   <div className="flex items-center justify-center gap-3">
                     <span className="text-sm text-[#155446] arabic-text">رقم: {invoice.invoice_number}</span>
                     <Badge className={`${getStatusColor(invoice.status)} text-sm px-3 py-1`}>
                       {invoice.status}
                     </Badge>
                   </div>
                 </div>
                 
                 {/* Financial Info */}
                 <div className="grid grid-cols-3 gap-3">
                   <div className="text-center p-3 bg-[#F6E9CA]/30 rounded-lg">
                     <div className="text-[#155446] text-sm arabic-text font-medium mb-1">المبلغ الكلي</div>
                     <div className="text-[#13312A] text-xl font-bold">{formatCurrency(invoice.total)}</div>
                   </div>
                   <div className="text-center p-3 bg-green-50 rounded-lg">
                     <div className="text-green-700 text-sm arabic-text font-medium mb-1">المدفوع</div>
                     <div className="text-green-800 text-xl font-bold">{formatCurrency(invoice.paid_amount)}</div>
                   </div>
                   <div className="text-center p-3 bg-orange-50 rounded-lg">
                     <div className="text-orange-700 text-sm arabic-text font-medium mb-1">المتبقي</div>
                     <div className="text-orange-800 text-xl font-bold">{formatCurrency(remaining)}</div>
                   </div>
                 </div>
                 
                 {/* Dates */}
                 <div className="grid grid-cols-2 gap-3">
                   <div className="text-center p-3 bg-[#F6E9CA]/20 rounded-lg">
                     <div className="text-[#155446] text-sm arabic-text font-medium mb-1">تاريخ الاستلام</div>
                     <div className="text-[#13312A] text-base font-semibold">{formatDate(invoice.invoice_date)}</div>
                   </div>
                   <div className="text-center p-3 bg-[#F6E9CA]/20 rounded-lg">
                     <div className="text-[#155446] text-sm arabic-text font-medium mb-1">تاريخ التسليم</div>
                     <div className="text-[#13312A] text-base font-semibold">{formatDate(invoice.due_date || invoice.invoice_date)}</div>
                   </div>
                 </div>
               </div>
             </div>

            {/* Customer Information */}
            <Card className="bg-white border-[#C69A72] shadow-sm">
              <CardHeader className="p-4 bg-[#F6E9CA]/30">
                <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                  <User className="h-6 w-6 text-[#155446]" />
                  بيانات الزبون
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-1">الاسم</div>
                    <div className="text-lg font-bold text-[#13312A] arabic-text">{invoice.customer_name}</div>
                  </div>
                  
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-1">الهاتف</div>
                    <div className="text-lg font-bold text-[#13312A]">{invoice.customer_phone || 'غير محدد'}</div>
                  </div>
                  
                  {invoice.customer_address && (
                    <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                      <div className="text-sm text-[#155446] arabic-text font-medium mb-1">العنوان</div>
                      <div className="text-lg font-bold text-[#13312A] arabic-text">{invoice.customer_address}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Design and Measurements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Design Details - Improved */}
            <Card className="bg-white border-[#C69A72] shadow-sm">
              <CardHeader className="p-4 bg-[#F6E9CA]/30">
                <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                  <Scissors className="h-6 w-6 text-[#155446]" />
                  تفاصيل التصميم
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-2">نوع القماش</div>
                    <div className="flex flex-wrap gap-2">
                      {invoice.designDetails?.fabricType && invoice.designDetails.fabricType.length > 0 ? (
                        invoice.designDetails.fabricType.map((type, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-sm px-3 py-1">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 arabic-text">لم يتم التحديد</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-2">مصدر القماش</div>
                    <div className="flex flex-wrap gap-2">
                      {invoice.designDetails?.fabricSource && invoice.designDetails.fabricSource.length > 0 ? (
                        invoice.designDetails.fabricSource.map((source, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-sm px-3 py-1">
                            {source}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 arabic-text">لم يتم التحديد</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-2">نوع الياقة</div>
                    <div className="flex flex-wrap gap-2">
                      {invoice.designDetails?.collarType && invoice.designDetails.collarType.length > 0 ? (
                        invoice.designDetails.collarType.map((type, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-sm px-3 py-1">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 arabic-text">لم يتم التحديد</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-2">أسلوب الصدر</div>
                    <div className="flex flex-wrap gap-2">
                      {invoice.designDetails?.chestStyle && invoice.designDetails.chestStyle.length > 0 ? (
                        invoice.designDetails.chestStyle.map((style, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-sm px-3 py-1">
                            {style}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 arabic-text">لم يتم التحديد</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#F6E9CA]/20 rounded-lg">
                    <div className="text-sm text-[#155446] arabic-text font-medium mb-2">نهاية الكم</div>
                    <div className="flex flex-wrap gap-2">
                      {invoice.designDetails?.sleeveEnd && invoice.designDetails.sleeveEnd.length > 0 ? (
                        invoice.designDetails.sleeveEnd.map((end, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-sm px-3 py-1">
                            {end}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 arabic-text">لم يتم التحديد</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            <Card className="bg-white border-[#C69A72] shadow-sm">
              <CardHeader className="p-4 bg-[#F6E9CA]/30">
                <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                  <Ruler className="h-6 w-6 text-[#155446]" />
                  القياسات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                    <div className="text-[#155446] arabic-text text-sm font-medium mb-1">الطول</div>
                    <div className="text-[#13312A] text-xl font-bold">
                      {invoice.measurements?.length ? `${invoice.measurements.length} سم` : 'لم يتم التحديد'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                    <div className="text-[#155446] arabic-text text-sm font-medium mb-1">الكتف</div>
                    <div className="text-[#13312A] text-xl font-bold">
                      {invoice.measurements?.shoulder ? `${invoice.measurements.shoulder} سم` : 'لم يتم التحديد'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                    <div className="text-[#155446] arabic-text text-sm font-medium mb-1">الخصر</div>
                    <div className="text-[#13312A] text-xl font-bold">
                      {invoice.measurements?.waist ? `${invoice.measurements.waist} سم` : 'لم يتم التحديد'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                    <div className="text-[#155446] arabic-text text-sm font-medium mb-1">الصدر</div>
                    <div className="text-[#13312A] text-xl font-bold">
                      {invoice.measurements?.chest ? `${invoice.measurements.chest} سم` : 'لم يتم التحديد'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Notes - Improved Design */}
            <Card className="bg-white border-[#C69A72] shadow-sm">
              <CardHeader className="p-4 bg-[#F6E9CA]/30">
                <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-[#155446]" />
                  الملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="bg-gradient-to-r from-[#F6E9CA] to-[#F6E9CA]/50 rounded-lg border border-[#C69A72]/30 p-4 min-h-[100px] flex items-center justify-center">
                  <p className="text-[#13312A] arabic-text text-base leading-relaxed font-medium text-center">
                    {invoice.notes || 'لا توجد ملاحظات'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Fabric Image */}
            <Card className="bg-white border-[#C69A72] shadow-sm">
              <CardHeader className="p-4 bg-[#F6E9CA]/30">
                <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                  <FileImage className="h-6 w-6 text-[#155446]" />
                  صورة القماش
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-center min-h-[200px] items-center">
                  {invoice.fabricImageUrl ? (
                    <img
                      src={invoice.fabricImageUrl}
                      alt="صورة القماش"
                      className="max-w-full h-auto max-h-64 rounded-lg border border-[#C69A72]/30 shadow-md"
                    />
                  ) : (
                    <div className="text-center text-gray-500 arabic-text">
                      <FileImage className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                      <p>لا توجد صورة للقماش</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}