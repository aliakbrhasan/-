import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
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

interface NewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FabricOption {
  id: string;
  label: string;
}

export function NewInvoiceDialog({ isOpen, onOpenChange }: NewInvoiceDialogProps) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [fabricOptions, setFabricOptions] = useState<FabricOption[]>([
    { id: 'cotton', label: 'قطن' },
    { id: 'silk', label: 'حرير' },
    { id: 'wool', label: 'صوف' },
    { id: 'linen', label: 'كتان' },
  ]);
  const [selectedFabricOptions, setSelectedFabricOptions] = useState<string[]>([]);
  const [fabricSource, setFabricSource] = useState('');
  const [isFabricPopoverOpen, setIsFabricPopoverOpen] = useState(false);
  const [isFabricManagerOpen, setIsFabricManagerOpen] = useState(false);
  const [fabricOptionsDraft, setFabricOptionsDraft] = useState<FabricOption[]>([]);
  const [fabricManagerError, setFabricManagerError] = useState('');
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [quickAddValue, setQuickAddValue] = useState('');
  const [quickAddError, setQuickAddError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDeliveryDate('');
      setSelectedFabricOptions([]);
      setFabricSource('');
      setIsFabricPopoverOpen(false);
      setIsFabricManagerOpen(false);
      setIsQuickAddDialogOpen(false);
    }
  }, [isOpen]);

  const selectedFabricLabels = fabricOptions
    .filter((option) => selectedFabricOptions.includes(option.id))
    .map((option) => option.label);

  const toggleFabricOption = (optionId: string) => {
    setSelectedFabricOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId],
    );
  };

  const handleFabricManagerOpenChange = (open: boolean) => {
    setIsFabricManagerOpen(open);
    if (open) {
      setFabricOptionsDraft(fabricOptions.map((option) => ({ ...option })));
      setFabricManagerError('');
    }
  };

  const handleFabricOptionsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedOptions = fabricOptionsDraft
      .map((option) => ({ ...option, label: option.label.trim() }))
      .filter((option) => option.label !== '');

    const labels = cleanedOptions.map((option) => option.label);
    const hasDuplicateLabels = new Set(labels).size !== labels.length;

    if (hasDuplicateLabels) {
      setFabricManagerError('الرجاء عدم تكرار أسماء الأنواع.');
      return;
    }

    setFabricOptions(cleanedOptions);
    setSelectedFabricOptions((previous) =>
      previous.filter((optionId) => cleanedOptions.some((option) => option.id === optionId)),
    );
    setIsFabricManagerOpen(false);
  };

  const handleDraftLabelChange = (optionId: string, newLabel: string) => {
    setFabricOptionsDraft((previous) =>
      previous.map((option) => (option.id === optionId ? { ...option, label: newLabel } : option)),
    );
  };

  const handleDraftDelete = (optionId: string) => {
    setFabricOptionsDraft((previous) => previous.filter((option) => option.id !== optionId));
  };

  const handleDraftAdd = () => {
    const uniqueId = `fabric-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setFabricOptionsDraft((previous) => [...previous, { id: uniqueId, label: 'نوع جديد' }]);
  };

  const handleQuickAddDialogOpenChange = (open: boolean) => {
    setIsQuickAddDialogOpen(open);
    if (!open) {
      setQuickAddValue('');
      setQuickAddError('');
    }
  };

  const handleQuickAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValue = quickAddValue.trim();

    if (!trimmedValue) {
      setQuickAddError('الرجاء إدخال اسم النوع.');
      return;
    }

    if (fabricOptions.some((option) => option.label === trimmedValue)) {
      setQuickAddError('هذا النوع موجود بالفعل.');
      return;
    }

    const newOption: FabricOption = {
      id: `fabric-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: trimmedValue,
    };

    setFabricOptions((previous) => [...previous, newOption]);
    setSelectedFabricOptions((previous) => [...previous, newOption.id]);
    handleQuickAddDialogOpenChange(false);
  };

  return (
    <>
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
                  <Popover open={isFabricPopoverOpen} onOpenChange={setIsFabricPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                          selectedFabricLabels.length === 0 && 'text-muted-foreground',
                        )}
                      >
                        <span className="flex-1 text-right truncate">
                          {selectedFabricLabels.length > 0
                            ? selectedFabricLabels.join('، ')
                            : 'اختر نوع القماش'}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                      <Command className="arabic-text text-right">
                        <CommandInput placeholder="ابحث عن نوع القماش..." className="text-right" />
                        <CommandList className="text-right">
                          <CommandEmpty>لا توجد أنواع مطابقة</CommandEmpty>
                          <CommandItem
                            value="add-new"
                            onSelect={() => {
                              setIsFabricPopoverOpen(false);
                              handleQuickAddDialogOpenChange(true);
                            }}
                            className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                          >
                            <Plus className="h-4 w-4" />
                            <span>إضافة نوع جديد</span>
                          </CommandItem>
                          <CommandSeparator className="bg-[#C69A72]/50" />
                          {fabricOptions.map((option) => {
                            const isSelected = selectedFabricOptions.includes(option.id);
                            return (
                              <CommandItem
                                key={option.id}
                                value={option.label}
                                onSelect={() => toggleFabricOption(option.id)}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="flex-1 text-right">{option.label}</span>
                                <Check
                                  className={cn(
                                    'h-4 w-4 text-[#155446] transition-opacity',
                                    isSelected ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            );
                          })}
                        </CommandList>
                        <div className="border-t border-[#C69A72]/50 px-2 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsFabricPopoverOpen(false);
                              handleFabricManagerOpenChange(true);
                            }}
                            className="w-full flex-row-reverse justify-center text-[#155446]"
                          >
                            <Pencil className="h-4 w-4" />
                            تعديل الأنواع
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-[#13312A] arabic-text">مصدر القماش</Label>
                  <Select value={fabricSource} onValueChange={setFabricSource}>
                    <SelectTrigger className="bg-white border-[#C69A72]">
                      <SelectValue placeholder="اختر مصدر القماش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inside">داخل المحل</SelectItem>
                      <SelectItem value="outside">خارج المحل</SelectItem>
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

      <Dialog open={isFabricManagerOpen} onOpenChange={handleFabricManagerOpenChange}>
        <DialogContent className="max-w-lg bg-[#F6E9CA] border-[#C69A72]">
          <DialogHeader>
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنواع القماش</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text">
              قم بإضافة أو تعديل أو حذف أنواع القماش المتاحة للاختيار.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFabricOptionsSubmit} className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {fabricOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => handleDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fabricOptionsDraft.length === 0 && (
                <p className="text-sm text-[#155446] arabic-text text-center">
                  لا توجد أنواع حالياً، أضف نوعاً جديداً للبدء.
                </p>
              )}
            </div>
            {fabricManagerError && (
              <p className="text-sm text-red-600 arabic-text text-right">{fabricManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
              >
                إضافة نوع
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFabricManagerOpen(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuickAddDialogOpen} onOpenChange={handleQuickAddDialogOpenChange}>
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72]">
          <DialogHeader>
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نوع قماش جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text">
              أضف نوعاً جديداً ليكون متاحاً ضمن قائمة أنواع القماش.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text" htmlFor="new-fabric-option">
                اسم النوع
              </Label>
              <Input
                id="new-fabric-option"
                value={quickAddValue}
                onChange={(event) => {
                  setQuickAddValue(event.target.value);
                  if (quickAddError) {
                    setQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right"
                placeholder="أدخل اسم النوع الجديد"
              />
              {quickAddError && (
                <p className="text-sm text-red-600 arabic-text text-right">{quickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAddDialogOpenChange(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
