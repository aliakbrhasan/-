import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Printer, 
  Share2, 
  Download, 
  FileImage, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Ruler, 
  Scissors, 
  CreditCard,
  MessageCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatDate, PrintableInvoiceData, PrintableInvoice } from './PrintableInvoice';
import { openPrintWindow } from './print/PrintUtils';

interface InvoiceDetailsPageProps {
  invoice: PrintableInvoiceData & {
    status: string;
    fabricImage: string;
    measurements?: {
      length?: number;
      shoulder?: number;
      waist?: number;
      chest?: number;
    };
    designDetails?: {
      fabricType?: string[];
      fabricSource?: string[];
      collarType?: string[];
      chestStyle?: string[];
      sleeveEnd?: string[];
    };
  };
  onBack: () => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoiceDetailsPage({ invoice, onBack, onMarkAsPaid }: InvoiceDetailsPageProps) {
  const remaining = Math.max(invoice.total - invoice.paid, 0);
  const isPaid = invoice.status === 'مدفوع';
  const isPartiallyPaid = invoice.status === 'جزئي';
  const canMarkAsPaid = !isPaid && (invoice.status === 'معلق' || isPartiallyPaid);

  const handlePrint = () => {
    openPrintWindow(`فاتورة ${invoice.id}`, <PrintableInvoice invoice={invoice} />);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `فاتورة ${invoice.id}`,
          text: `فاتورة ${invoice.customerName} - ${formatCurrency(invoice.total)}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `فاتورة ${invoice.id}\nالزبون: ${invoice.customerName}\nالمبلغ: ${formatCurrency(invoice.total)}`;
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
                  {invoice.customerName}
                </h1>
                <p className="text-sm text-[#155446] arabic-text">
                  رقم الفاتورة: {invoice.id}
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
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-[#C69A72] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <h2 className="text-2xl font-bold text-[#13312A] arabic-text">ملخص الفاتورة</h2>
                <p className="text-[#155446] arabic-text">رقم الفاتورة: {invoice.id}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Badge className={`${getStatusColor(invoice.status)} text-lg px-4 py-2`}>
                  {invoice.status}
                </Badge>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#13312A]">{formatCurrency(invoice.total)}</p>
                  <p className="text-lg text-[#155446] arabic-text">المبلغ الكلي</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card className="bg-white border-[#C69A72] shadow-sm">
                <CardHeader className="p-6 bg-[#F6E9CA]/30">
                  <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                    <User className="h-6 w-6 text-[#155446]" />
                    بيانات الزبون
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#155446]" />
                    <div>
                      <p className="text-sm text-[#155446] arabic-text">الاسم</p>
                      <p className="text-xl font-semibold text-[#13312A] arabic-text">{invoice.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#155446]" />
                    <div>
                      <p className="text-sm text-[#155446] arabic-text">الهاتف</p>
                      <p className="text-xl font-semibold text-[#13312A]">{invoice.phone}</p>
                    </div>
                  </div>
                  {invoice.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#155446]" />
                      <div>
                        <p className="text-sm text-[#155446] arabic-text">العنوان</p>
                        <p className="text-xl font-semibold text-[#13312A] arabic-text">{invoice.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Measurements */}
              {invoice.measurements && (
                <Card className="bg-white border-[#C69A72] shadow-sm">
                  <CardHeader className="p-6 bg-[#F6E9CA]/30">
                    <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                      <Ruler className="h-6 w-6 text-[#155446]" />
                      القياسات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      {invoice.measurements.length && (
                        <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                          <div className="text-[#155446] arabic-text text-sm font-medium mb-2">الطول</div>
                          <div className="text-[#13312A] text-2xl font-bold">{invoice.measurements.length} سم</div>
                        </div>
                      )}
                      {invoice.measurements.shoulder && (
                        <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                          <div className="text-[#155446] arabic-text text-sm font-medium mb-2">الكتف</div>
                          <div className="text-[#13312A] text-2xl font-bold">{invoice.measurements.shoulder} سم</div>
                        </div>
                      )}
                      {invoice.measurements.waist && (
                        <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                          <div className="text-[#155446] arabic-text text-sm font-medium mb-2">الخصر</div>
                          <div className="text-[#13312A] text-2xl font-bold">{invoice.measurements.waist} سم</div>
                        </div>
                      )}
                      {invoice.measurements.chest && (
                        <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                          <div className="text-[#155446] arabic-text text-sm font-medium mb-2">الصدر</div>
                          <div className="text-[#13312A] text-2xl font-bold">{invoice.measurements.chest} سم</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Design Details */}
              {invoice.designDetails && (
                <Card className="bg-white border-[#C69A72] shadow-sm">
                  <CardHeader className="p-6 bg-[#F6E9CA]/30">
                    <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                      <Scissors className="h-6 w-6 text-[#155446]" />
                      تفاصيل التصميم
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    {invoice.designDetails.fabricType && invoice.designDetails.fabricType.length > 0 && (
                      <div>
                        <div className="text-[#155446] arabic-text text-sm font-medium mb-2">نوع القماش</div>
                        <div className="flex flex-wrap gap-2">
                          {invoice.designDetails.fabricType.map((type, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72]">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {invoice.designDetails.fabricSource && invoice.designDetails.fabricSource.length > 0 && (
                      <div>
                        <div className="text-[#155446] arabic-text text-sm font-medium mb-2">مصدر القماش</div>
                        <div className="flex flex-wrap gap-2">
                          {invoice.designDetails.fabricSource.map((source, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72]">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {invoice.designDetails.collarType && invoice.designDetails.collarType.length > 0 && (
                      <div>
                        <div className="text-[#155446] arabic-text text-sm font-medium mb-2">نوع الياقة</div>
                        <div className="flex flex-wrap gap-2">
                          {invoice.designDetails.collarType.map((type, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72]">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {invoice.designDetails.chestStyle && invoice.designDetails.chestStyle.length > 0 && (
                      <div>
                        <div className="text-[#155446] arabic-text text-sm font-medium mb-2">أسلوب الصدر</div>
                        <div className="flex flex-wrap gap-2">
                          {invoice.designDetails.chestStyle.map((style, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72]">
                              {style}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {invoice.designDetails.sleeveEnd && invoice.designDetails.sleeveEnd.length > 0 && (
                      <div>
                        <div className="text-[#155446] arabic-text text-sm font-medium mb-2">نهاية الكم</div>
                        <div className="flex flex-wrap gap-2">
                          {invoice.designDetails.sleeveEnd.map((end, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72]">
                              {end}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Financial Information */}
              <Card className="bg-white border-[#C69A72] shadow-sm">
                <CardHeader className="p-6 bg-[#F6E9CA]/30">
                  <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-[#155446]" />
                    المعلومات المالية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                      <div className="text-[#155446] arabic-text text-sm font-medium mb-2">المبلغ الكلي</div>
                      <div className="text-[#13312A] text-3xl font-bold">{formatCurrency(invoice.total)}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-700 arabic-text text-sm font-medium mb-2">المبلغ المدفوع</div>
                      <div className="text-green-800 text-3xl font-bold">{formatCurrency(invoice.paid)}</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-orange-700 arabic-text text-sm font-medium mb-2">المبلغ المتبقي</div>
                      <div className="text-orange-800 text-3xl font-bold">{formatCurrency(remaining)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card className="bg-white border-[#C69A72] shadow-sm">
                <CardHeader className="p-6 bg-[#F6E9CA]/30">
                  <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-[#155446]" />
                    التواريخ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                      <div className="text-[#155446] arabic-text text-sm font-medium mb-2">تاريخ الاستلام</div>
                      <div className="text-[#13312A] text-xl font-semibold">{formatDate(invoice.receivedDate)}</div>
                    </div>
                    <div className="text-center p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                      <div className="text-[#155446] arabic-text text-sm font-medium mb-2">تاريخ التسليم</div>
                      <div className="text-[#13312A] text-xl font-semibold">{formatDate(invoice.deliveryDate)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {invoice.notes && (
                <Card className="bg-white border-[#C69A72] shadow-sm">
                  <CardHeader className="p-6 bg-[#F6E9CA]/30">
                    <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-[#155446]" />
                      الملاحظات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                      <p className="text-[#13312A] arabic-text text-base leading-relaxed">
                        {invoice.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fabric Image */}
              {invoice.fabricImage && (
                <Card className="bg-white border-[#C69A72] shadow-sm">
                  <CardHeader className="p-6 bg-[#F6E9CA]/30">
                    <CardTitle className="text-[#13312A] arabic-text text-xl flex items-center gap-2">
                      <FileImage className="h-6 w-6 text-[#155446]" />
                      صورة القماش
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex justify-center">
                      <img
                        src={invoice.fabricImage}
                        alt="صورة القماش"
                        className="max-w-full h-auto max-h-80 rounded-lg border border-[#C69A72]/30 shadow-md"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
