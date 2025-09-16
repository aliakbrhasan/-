import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Upload, Calendar as CalendarIcon } from 'lucide-react';

interface NewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewInvoiceDialog({ isOpen, onOpenChange }: NewInvoiceDialogProps) {
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDeliveryDate('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onClick={() => onOpenChange(false)}
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
}
