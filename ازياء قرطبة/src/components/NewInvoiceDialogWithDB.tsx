import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Upload, Calendar as CalendarIcon, Check, ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from './ui/utils';
import { InvoiceService, InvoiceFormData } from '@/services/invoice.service';
import { useInvoices } from '@/hooks/useInvoices';
import { ImageUpload } from './ui/ImageUpload';
import { ImageService } from '@/services/image.service';

interface NewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FabricOption {
  id: string;
  label: string;
}

export function NewInvoiceDialogWithDB({ isOpen, onOpenChange }: NewInvoiceDialogProps) {
  const { createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    total: 0,
    paidAmount: 0,
    status: 'معلق',
    deliveryDate: '',
    notes: '',
    items: [],
    measurements: {
      length: 0,
      shoulder: 0,
      waist: 0,
      chest: 0
    },
    designDetails: {
      fabricType: [],
      fabricSource: [],
      collarType: [],
      chestStyle: [],
      sleeveEnd: []
    }
  });

  // Image state
  const [fabricImage, setFabricImage] = useState<string | null>(null);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [sampleImage, setSampleImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        total: 0,
        paidAmount: 0,
        status: 'معلق',
        deliveryDate: '',
        notes: '',
        items: [],
        measurements: {
          length: 0,
          shoulder: 0,
          waist: 0,
          chest: 0
        },
        designDetails: {
          fabricType: [],
          fabricSource: [],
          collarType: [],
          chestStyle: [],
          sleeveEnd: []
        }
      });
      setFabricImage(null);
      setDesignImage(null);
      setSampleImage(null);
      setUploadedImages([]);
      setSubmitError(null);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate form data
      const validationErrors = InvoiceService.validateInvoiceData(formData);
      if (validationErrors.length > 0) {
        setSubmitError(validationErrors.join('\n'));
        return;
      }

      // Create invoice
      const createdInvoice = await createInvoice(formData);
      
      // Upload images if any
      if (uploadedImages.length > 0) {
        try {
          // Upload fabric image
          if (fabricImage) {
            const fabricFile = uploadedImages.find(f => f.name.includes('fabric'));
            if (fabricFile) {
              await ImageService.uploadImage(fabricFile, 'invoice', createdInvoice.id, {
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.8,
                createThumbnail: true
              });
            }
          }

          // Upload design image
          if (designImage) {
            const designFile = uploadedImages.find(f => f.name.includes('design'));
            if (designFile) {
              await ImageService.uploadImage(designFile, 'invoice', createdInvoice.id, {
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.8,
                createThumbnail: true
              });
            }
          }

          // Upload sample image
          if (sampleImage) {
            const sampleFile = uploadedImages.find(f => f.name.includes('sample'));
            if (sampleFile) {
              await ImageService.uploadImage(sampleFile, 'invoice', createdInvoice.id, {
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.8,
                createThumbnail: true
              });
            }
          }
        } catch (imageError) {
          console.warn('Failed to upload some images:', imageError);
          // Don't fail the entire operation if image upload fails
        }
      }
      
      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      setSubmitError(error instanceof Error ? error.message : 'حدث خطأ في إنشاء الفاتورة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        itemName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }]
    }));
  };

  // Remove item
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Update item
  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Calculate total
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.items]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F6E9CA] border-[#C69A72]">
        <DialogHeader>
          <DialogTitle className="text-[#13312A] arabic-text">إنشاء فاتورة جديدة</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل بيانات الزبون والطلب لإصدار الفاتورة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">بيانات الزبون</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">اسم الزبون *</Label>
                <Input 
                  placeholder="أدخل اسم الزبون" 
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">رقم الهاتف *</Label>
                <Input 
                  placeholder="077xxxxxxxx" 
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-[#13312A] arabic-text">العنوان</Label>
                <Input 
                  placeholder="أدخل العنوان" 
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">القياسات</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">الطول (سم)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.measurements?.length || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements!, length: Number(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">العرض (سم)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.measurements?.shoulder || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements!, shoulder: Number(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الخصر (سم)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.measurements?.waist || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements!, waist: Number(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الصدر (سم)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.measurements?.chest || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements!, chest: Number(e.target.value) }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">عناصر الفاتورة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-[#C69A72] rounded-lg">
                  <div className="md:col-span-2">
                    <Label className="text-[#13312A] arabic-text">اسم العنصر</Label>
                    <Input 
                      placeholder="اسم العنصر"
                      className="bg-white border-[#C69A72] text-right"
                      value={item.itemName}
                      onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-[#13312A] arabic-text">الكمية</Label>
                    <Input 
                      type="number"
                      placeholder="1"
                      className="bg-white border-[#C69A72] text-right"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = Number(e.target.value);
                        updateItem(index, 'quantity', quantity);
                        updateItem(index, 'totalPrice', quantity * item.unitPrice);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-[#13312A] arabic-text">السعر</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      className="bg-white border-[#C69A72] text-right"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const unitPrice = Number(e.target.value);
                        updateItem(index, 'unitPrice', unitPrice);
                        updateItem(index, 'totalPrice', item.quantity * unitPrice);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-[#13312A] arabic-text">المجموع</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      className="bg-white border-[#C69A72] text-right"
                      value={item.totalPrice}
                      readOnly
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button"
                variant="outline" 
                onClick={addItem}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة عنصر
              </Button>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">معلومات الدفع</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-[#13312A] arabic-text">المجموع</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.total}
                  readOnly
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">المدفوع</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">الحالة</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-white border-[#C69A72] text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="جزئي">جزئي</SelectItem>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">صور الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fabric Image */}
              <div>
                <Label className="text-[#13312A] arabic-text">صورة القماش</Label>
                <p className="text-xs text-gray-500 mb-2">اختر صورة القماش المستخدم في الطلب</p>
                <ImageUpload
                  onImageChange={(imageData, file) => {
                    setFabricImage(imageData);
                    if (file) {
                      setUploadedImages(prev => [...prev.filter(f => f.name !== 'fabric'), file]);
                    }
                  }}
                  currentImage={fabricImage}
                  maxSize={2}
                  maxWidth={800}
                  maxHeight={600}
                  quality={0.8}
                />
              </div>

              {/* Design Image */}
              <div>
                <Label className="text-[#13312A] arabic-text">صورة التصميم</Label>
                <p className="text-xs text-gray-500 mb-2">اختر صورة التصميم المطلوب</p>
                <ImageUpload
                  onImageChange={(imageData, file) => {
                    setDesignImage(imageData);
                    if (file) {
                      setUploadedImages(prev => [...prev.filter(f => f.name !== 'design'), file]);
                    }
                  }}
                  currentImage={designImage}
                  maxSize={2}
                  maxWidth={800}
                  maxHeight={600}
                  quality={0.8}
                />
              </div>

              {/* Sample Image */}
              <div>
                <Label className="text-[#13312A] arabic-text">صورة العينة</Label>
                <p className="text-xs text-gray-500 mb-2">اختر صورة العينة أو المثال</p>
                <ImageUpload
                  onImageChange={(imageData, file) => {
                    setSampleImage(imageData);
                    if (file) {
                      setUploadedImages(prev => [...prev.filter(f => f.name !== 'sample'), file]);
                    }
                  }}
                  currentImage={sampleImage}
                  maxSize={2}
                  maxWidth={800}
                  maxHeight={600}
                  quality={0.8}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#13312A] arabic-text">تاريخ التسليم</Label>
                <Input 
                  type="date"
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">ملاحظات</Label>
                <Textarea 
                  placeholder="أي ملاحظات إضافية..."
                  className="bg-white border-[#C69A72] text-right"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {/* Dialog Footer */}
          <DialogFooter className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


