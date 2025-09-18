import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
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
  Clock,
  MessageCircle,
  X
} from 'lucide-react';
import { formatCurrency, formatDate, PrintableInvoiceData, PrintableInvoice } from './PrintableInvoice';
import { openPrintWindow } from './print/PrintUtils';

interface InvoiceDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
}

export function InvoiceDetailsDialog({ isOpen, onOpenChange, invoice }: InvoiceDetailsDialogProps) {
  const remaining = Math.max(invoice.total - invoice.paid, 0);

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

  const handleSaveAsImage = () => {
    // This would typically use html2canvas to capture the dialog content
    // For now, we'll use the print functionality
    handlePrint();
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none m-0 p-0 max-w-none max-h-none w-screen h-screen bg-[#F6E9CA] border-0 flex flex-col [&_[data-slot='dialog-close']]:hidden"
        style={{ transform: 'none' }}
      >
        <DialogHeader className="p-4 pb-3 border-b border-[#C69A72]/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-[#13312A] arabic-text text-xl md:text-2xl">
                تفاصيل الفاتورة
              </DialogTitle>
              <DialogDescription className="text-[#155446] arabic-text text-sm md:text-lg">
                رقم الفاتورة: {invoice.id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-[#155446] hover:bg-[#C69A72]/20"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-transparent"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#C69A72 transparent' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-4">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                {/* Customer Information */}
                <Card className="bg-white border-[#C69A72]">
                  <CardHeader className="p-3 md:p-6">
                    <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                      بيانات الزبون
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0 space-y-3 md:space-y-4">
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2 text-[#155446] arabic-text">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm font-medium">الاسم</span>
                      </div>
                      <p className="text-[#13312A] arabic-text text-base md:text-lg font-semibold">
                        {invoice.customerName}
                      </p>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2 text-[#155446] arabic-text">
                        <Phone className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm font-medium">الهاتف</span>
                      </div>
                      <p className="text-[#13312A] text-base md:text-lg font-semibold">
                        {invoice.phone}
                      </p>
                    </div>
                    {invoice.address && (
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center gap-2 text-[#155446] arabic-text">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm font-medium">العنوان</span>
                        </div>
                        <p className="text-[#13312A] arabic-text text-base md:text-lg font-semibold">
                          {invoice.address}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Measurements */}
                {invoice.measurements && (
                  <Card className="bg-white border-[#C69A72]">
                    <CardHeader className="p-3 md:p-6">
                      <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                        <Ruler className="h-4 w-4 md:h-5 md:w-5" />
                        القياسات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 pt-0">
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        {invoice.measurements.length && (
                          <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                            <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1">الطول</div>
                            <div className="text-[#13312A] text-base md:text-xl font-bold">{invoice.measurements.length} سم</div>
                          </div>
                        )}
                        {invoice.measurements.shoulder && (
                          <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                            <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1">الكتف</div>
                            <div className="text-[#13312A] text-base md:text-xl font-bold">{invoice.measurements.shoulder} سم</div>
                          </div>
                        )}
                        {invoice.measurements.waist && (
                          <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                            <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1">الخصر</div>
                            <div className="text-[#13312A] text-base md:text-xl font-bold">{invoice.measurements.waist} سم</div>
                          </div>
                        )}
                        {invoice.measurements.chest && (
                          <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                            <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1">الصدر</div>
                            <div className="text-[#13312A] text-base md:text-xl font-bold">{invoice.measurements.chest} سم</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>

              {/* Right Column */}
              <div className="space-y-4 md:space-y-6">
                {/* Design Details */}
                {invoice.designDetails && (
                  <Card className="bg-white border-[#C69A72]">
                    <CardHeader className="p-3 md:p-6">
                      <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                        <Scissors className="h-4 w-4 md:h-5 md:w-5" />
                        تفاصيل التصميم
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 pt-0 space-y-3 md:space-y-4">
                      {invoice.designDetails.fabricType && invoice.designDetails.fabricType.length > 0 && (
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium">نوع القماش</div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {invoice.designDetails.fabricType.map((type, index) => (
                              <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {invoice.designDetails.fabricSource && invoice.designDetails.fabricSource.length > 0 && (
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium">مصدر القماش</div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {invoice.designDetails.fabricSource.map((source, index) => (
                              <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {invoice.designDetails.collarType && invoice.designDetails.collarType.length > 0 && (
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium">نوع الياقة</div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {invoice.designDetails.collarType.map((type, index) => (
                              <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {invoice.designDetails.chestStyle && invoice.designDetails.chestStyle.length > 0 && (
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium">أسلوب الصدر</div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {invoice.designDetails.chestStyle.map((style, index) => (
                              <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {invoice.designDetails.sleeveEnd && invoice.designDetails.sleeveEnd.length > 0 && (
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium">نهاية الكم</div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {invoice.designDetails.sleeveEnd.map((end, index) => (
                              <Badge key={index} variant="secondary" className="bg-[#F6E9CA] text-[#13312A] border-[#C69A72] text-xs">
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
                <Card className="bg-white border-[#C69A72]">
                  <CardHeader className="p-3 md:p-6">
                    <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                      المعلومات المالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0">
                    <div className="space-y-2 md:space-y-4">
                      <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                        <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1 md:mb-2">المبلغ الكلي</div>
                        <div className="text-[#13312A] text-lg md:text-2xl font-bold">{formatCurrency(invoice.total)}</div>
                      </div>
                      <div className="text-center p-2 md:p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-green-700 arabic-text text-xs md:text-sm font-medium mb-1 md:mb-2">المبلغ المدفوع</div>
                        <div className="text-green-800 text-lg md:text-2xl font-bold">{formatCurrency(invoice.paid)}</div>
                      </div>
                      <div className="text-center p-2 md:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-orange-700 arabic-text text-xs md:text-sm font-medium mb-1 md:mb-2">المبلغ المتبقي</div>
                        <div className="text-orange-800 text-lg md:text-2xl font-bold">{formatCurrency(remaining)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card className="bg-white border-[#C69A72]">
                  <CardHeader className="p-3 md:p-6">
                    <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                      التواريخ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0">
                    <div className="space-y-2 md:space-y-4">
                      <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                        <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1 md:mb-2">تاريخ الاستلام</div>
                        <div className="text-[#13312A] text-sm md:text-lg font-semibold">{formatDate(invoice.receivedDate)}</div>
                      </div>
                      <div className="text-center p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                        <div className="text-[#155446] arabic-text text-xs md:text-sm font-medium mb-1 md:mb-2">تاريخ التسليم</div>
                        <div className="text-[#13312A] text-sm md:text-lg font-semibold">{formatDate(invoice.deliveryDate)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {invoice.notes && (
                  <Card className="bg-white border-[#C69A72]">
                    <CardHeader className="p-3 md:p-6">
                      <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                        الملاحظات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 pt-0">
                      <div className="p-2 md:p-4 bg-[#F6E9CA] rounded-lg border border-[#C69A72]/30">
                        <p className="text-[#13312A] arabic-text text-sm md:text-lg leading-relaxed">
                          {invoice.notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Fabric Image */}
                {invoice.fabricImage && (
                  <Card className="bg-white border-[#C69A72]">
                    <CardHeader className="p-3 md:p-6">
                      <CardTitle className="text-[#13312A] arabic-text text-base md:text-lg flex items-center gap-2">
                        <FileImage className="h-4 w-4 md:h-5 md:w-5" />
                        صورة القماش
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 pt-0">
                      <div className="flex justify-center">
                        <img
                          src={invoice.fabricImage}
                          alt="صورة القماش"
                          className="max-w-full h-auto max-h-48 md:max-h-64 rounded-lg border border-[#C69A72]/30 shadow-md"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div className="flex-shrink-0 bg-[#F6E9CA] border-t border-[#C69A72]/30 p-3 md:p-4" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              <Button
                onClick={handlePrint}
                className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Printer className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">طباعة</span>
                <span className="sm:hidden">طب</span>
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">مشاركة</span>
                <span className="sm:hidden">شارك</span>
              </Button>
              <Button
                onClick={handleSaveAsPDF}
                variant="outline"
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">حفظ PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                onClick={handleSaveAsImage}
                variant="outline"
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <FileImage className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">حفظ صورة</span>
                <span className="sm:hidden">صورة</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
