import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, X, Plus, Pencil, Trash2, Check, ChevronDown } from 'lucide-react';
import { InvoiceService, InvoiceFormData } from '@/services/invoice.service';
import { useInvoices } from '@/hooks/useInvoices';
import { ImageUpload } from './ui/ImageUpload';
import { ImageService } from '@/services/image.service';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from './ui/utils';

interface NewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated?: () => void;
}

interface FabricOption {
  id: string;
  label: string;
}


export function NewInvoiceDialogWithDB({ isOpen, onOpenChange, onInvoiceCreated }: NewInvoiceDialogProps) {
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
    items: [{
      itemName: 'خدمة خياطة',
      description: 'خدمة خياطة مخصصة',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }],
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
      sleeveEnd: [],
      bunijaType: ''
    }
  });

  // Image state
  const [fabricImage, setFabricImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Design options state
  const [fabricOptions, setFabricOptions] = useState<FabricOption[]>([
    { id: 'cotton', label: 'قطن' },
    { id: 'silk', label: 'حرير' },
    { id: 'wool', label: 'صوف' },
    { id: 'linen', label: 'كتان' },
    { id: 'denim', label: 'دنة' },
    { id: 'chiffon', label: 'شيفون' },
  ]);
  const [selectedFabricOptions, setSelectedFabricOptions] = useState<string[]>([]);
  const [isFabricPopoverOpen, setIsFabricPopoverOpen] = useState(false);
  const [isFabricManagerOpen, setIsFabricManagerOpen] = useState(false);
  const [fabricOptionsDraft, setFabricOptionsDraft] = useState<FabricOption[]>([]);
  const [fabricManagerError, setFabricManagerError] = useState('');
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [quickAddValue, setQuickAddValue] = useState('');
  const [quickAddError, setQuickAddError] = useState('');

  // Fabric source options
  const [fabricSourceOptions, setFabricSourceOptions] = useState<FabricOption[]>([
    { id: 'outside', label: 'خارج المحل' },
    { id: 'inside', label: 'داخل المحل' },
  ]);
  const [selectedFabricSources, setSelectedFabricSources] = useState<string[]>([]);
  const [isSourcePopoverOpen, setIsSourcePopoverOpen] = useState(false);
  const [isSourceManagerOpen, setIsSourceManagerOpen] = useState(false);
  const [sourceOptionsDraft, setSourceOptionsDraft] = useState<FabricOption[]>([]);
  const [sourceManagerError, setSourceManagerError] = useState('');
  const [isSourceQuickAddOpen, setIsSourceQuickAddOpen] = useState(false);
  const [sourceQuickAddValue, setSourceQuickAddValue] = useState('');
  const [sourceQuickAddError, setSourceQuickAddError] = useState('');

  // Collar options
  const [collarOptions, setCollarOptions] = useState<FabricOption[]>([
    { id: 'regular', label: 'عادية' },
    { id: 'mandarin', label: 'صينية' },
    { id: 'formal', label: 'رسمية' },
    { id: 'open', label: 'مفتوحة' },
  ]);
  const [selectedCollarOptions, setSelectedCollarOptions] = useState<string[]>([]);
  const [isCollarPopoverOpen, setIsCollarPopoverOpen] = useState(false);
  const [isCollarManagerOpen, setIsCollarManagerOpen] = useState(false);
  const [collarOptionsDraft, setCollarOptionsDraft] = useState<FabricOption[]>([]);
  const [collarManagerError, setCollarManagerError] = useState('');
  const [isCollarQuickAddOpen, setIsCollarQuickAddOpen] = useState(false);
  const [collarQuickAddValue, setCollarQuickAddValue] = useState('');
  const [collarQuickAddError, setCollarQuickAddError] = useState('');

  // Chest style options
  const [chestStyleOptions, setChestStyleOptions] = useState<FabricOption[]>([
    { id: 'single', label: 'صدر واحد' },
    { id: 'double', label: 'صدر مزدوج' },
    { id: 'open', label: 'صدر مفتوح' },
  ]);
  const [selectedChestStyleOptions, setSelectedChestStyleOptions] = useState<string[]>([]);
  const [isChestStylePopoverOpen, setIsChestStylePopoverOpen] = useState(false);
  const [isChestStyleManagerOpen, setIsChestStyleManagerOpen] = useState(false);
  const [chestStyleOptionsDraft, setChestStyleOptionsDraft] = useState<FabricOption[]>([]);
  const [chestStyleManagerError, setChestStyleManagerError] = useState('');
  const [isChestStyleQuickAddOpen, setIsChestStyleQuickAddOpen] = useState(false);
  const [chestStyleQuickAddValue, setChestStyleQuickAddValue] = useState('');
  const [chestStyleQuickAddError, setChestStyleQuickAddError] = useState('');

  // Sleeve end options
  const [sleeveEndOptions, setSleeveEndOptions] = useState<FabricOption[]>([
    { id: 'cuff', label: 'كم بحاشية' },
    { id: 'plain', label: 'كم عادي' },
    { id: 'short', label: 'كم قصير' },
    { id: 'long', label: 'كم طويل' },
  ]);
  const [selectedSleeveEndOptions, setSelectedSleeveEndOptions] = useState<string[]>([]);
  const [isSleeveEndPopoverOpen, setIsSleeveEndPopoverOpen] = useState(false);
  const [isSleeveEndManagerOpen, setIsSleeveEndManagerOpen] = useState(false);
  const [sleeveEndOptionsDraft, setSleeveEndOptionsDraft] = useState<FabricOption[]>([]);
  const [sleeveEndManagerError, setSleeveEndManagerError] = useState('');
  const [isSleeveEndQuickAddOpen, setIsSleeveEndQuickAddOpen] = useState(false);
  const [sleeveEndQuickAddValue, setSleeveEndQuickAddValue] = useState('');
  const [sleeveEndQuickAddError, setSleeveEndQuickAddError] = useState('');

  // Bunija options
  const [bunijaOptions, setBunijaOptions] = useState<FabricOption[]>([
    { id: 'single', label: 'بنايج' },
    { id: 'half', label: 'نصف بنيجة' },
    { id: 'double', label: 'بنيجتين' },
  ]);
  const [selectedBunijaOptions, setSelectedBunijaOptions] = useState<string[]>([]);
  const [isBunijaPopoverOpen, setIsBunijaPopoverOpen] = useState(false);
  const [isBunijaManagerOpen, setIsBunijaManagerOpen] = useState(false);
  const [bunijaOptionsDraft, setBunijaOptionsDraft] = useState<FabricOption[]>([]);
  const [bunijaManagerError, setBunijaManagerError] = useState('');
  const [isBunijaQuickAddOpen, setIsBunijaQuickAddOpen] = useState(false);
  const [bunijaQuickAddValue, setBunijaQuickAddValue] = useState('');
  const [bunijaQuickAddError, setBunijaQuickAddError] = useState('');

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
        items: [{
          itemName: 'خدمة خياطة',
          description: 'خدمة خياطة مخصصة',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        }],
        measurements: {
          length: 0,
          shoulder: 0,
          waist: 0,
          chest: 0
        },
        designDetails: {
          fabricType: fabricOptions.filter(opt => selectedFabricOptions.includes(opt.id)).map(opt => opt.label),
          fabricSource: fabricSourceOptions.filter(opt => selectedFabricSources.includes(opt.id)).map(opt => opt.label),
          collarType: collarOptions.filter(opt => selectedCollarOptions.includes(opt.id)).map(opt => opt.label),
          chestStyle: chestStyleOptions.filter(opt => selectedChestStyleOptions.includes(opt.id)).map(opt => opt.label),
          sleeveEnd: sleeveEndOptions.filter(opt => selectedSleeveEndOptions.includes(opt.id)).map(opt => opt.label),
          bunijaType: bunijaOptions.filter(opt => selectedBunijaOptions.includes(opt.id)).map(opt => opt.label).join(', ')
        }
      });
      setFabricImage(null);
      setUploadedImages([]);
      setSubmitError(null);
      
      // Reset design options
      setSelectedFabricOptions([]);
      setSelectedFabricSources([]);
      setSelectedCollarOptions([]);
      setSelectedChestStyleOptions([]);
      setSelectedSleeveEndOptions([]);
      setSelectedBunijaOptions([]);
      setIsFabricPopoverOpen(false);
      setIsSourcePopoverOpen(false);
      setIsCollarPopoverOpen(false);
      setIsChestStylePopoverOpen(false);
      setIsSleeveEndPopoverOpen(false);
      setIsBunijaPopoverOpen(false);
      setIsSourceManagerOpen(false);
      setIsBunijaManagerOpen(false);
      setIsSourceQuickAddOpen(false);
      setIsBunijaQuickAddOpen(false);
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
      
      // Upload fabric image if any
      if (fabricImage && uploadedImages.length > 0) {
        try {
            const fabricFile = uploadedImages.find(f => f.name.includes('fabric'));
            if (fabricFile) {
              await ImageService.uploadImage(fabricFile, 'invoice', createdInvoice.id, {
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.8,
                createThumbnail: true
              });
          }
        } catch (imageError) {
          console.warn('Failed to upload fabric image:', imageError);
          // Don't fail the entire operation if image upload fails
        }
      }
      
      // Close dialog
      onOpenChange(false);
      
      // Notify parent component that invoice was created
      if (onInvoiceCreated) {
        onInvoiceCreated();
      }
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      setSubmitError(error instanceof Error ? error.message : 'حدث خطأ في إنشاء الفاتورة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for fabric options
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

  const toggleFabricSource = (sourceId: string) => {
    setSelectedFabricSources((previous) =>
      previous.includes(sourceId)
        ? previous.filter((item) => item !== sourceId)
        : [...previous, sourceId],
    );
  };

  const toggleCollarOption = (optionId: string) => {
    setSelectedCollarOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId],
    );
  };

  const toggleChestStyleOption = (optionId: string) => {
    setSelectedChestStyleOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId],
    );
  };

  const toggleSleeveEndOption = (optionId: string) => {
    setSelectedSleeveEndOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId],
    );
  };

  const toggleBunijaOption = (optionId: string) => {
    setSelectedBunijaOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId],
    );
  };

  // Manager functions for fabric options
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

  // Helper functions for collar options
  const openCollarManager = (open: boolean) => {
    setIsCollarManagerOpen(open);
    if (open) {
      setCollarOptionsDraft(collarOptions.map((o) => ({ ...o })));
      setCollarManagerError('');
    }
  };

  const submitCollarOptions: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const cleaned = collarOptionsDraft.map((o) => ({ ...o, label: o.label.trim() })).filter((o) => o.label !== '');
    const labels = cleaned.map((o) => o.label);
    if (new Set(labels).size !== labels.length) {
      setCollarManagerError('الرجاء عدم تكرار أسماء الأنواع.');
      return;
    }
    setCollarOptions(cleaned);
    setSelectedCollarOptions((prev) => prev.filter((id) => cleaned.some((o) => o.id === id)));
    setIsCollarManagerOpen(false);
  };

  const collarDraftLabelChange = (id: string, label: string) => {
    setCollarOptionsDraft((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const collarDraftDelete = (id: string) => {
    setCollarOptionsDraft((prev) => prev.filter((o) => o.id !== id));
  };

  const collarDraftAdd = () => {
    const id = `collar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCollarOptionsDraft((prev) => [...prev, { id, label: 'خيار جديد' }]);
  };

  const openCollarQuickAdd = (open: boolean) => {
    setIsCollarQuickAddOpen(open);
    if (!open) {
      setCollarQuickAddValue('');
      setCollarQuickAddError('');
    }
  };

  const submitCollarQuickAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = collarQuickAddValue.trim();
    if (!value) {
      setCollarQuickAddError('الرجاء إدخال اسم الخيار.');
      return;
    }
    if (collarOptions.some((o) => o.label === value)) {
      setCollarQuickAddError('هذا الخيار موجود بالفعل.');
      return;
    }
    const option = { id: `collar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: value };
    setCollarOptions((prev) => [...prev, option]);
    setSelectedCollarOptions((prev) => [...prev, option.id]);
    openCollarQuickAdd(false);
  };

  // Helper functions for chest style options
  const openChestStyleManager = (open: boolean) => {
    setIsChestStyleManagerOpen(open);
    if (open) {
      setChestStyleOptionsDraft(chestStyleOptions.map((o) => ({ ...o })));
      setChestStyleManagerError('');
    }
  };

  const submitChestStyleOptions: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const cleaned = chestStyleOptionsDraft.map((o) => ({ ...o, label: o.label.trim() })).filter((o) => o.label !== '');
    const labels = cleaned.map((o) => o.label);
    if (new Set(labels).size !== labels.length) {
      setChestStyleManagerError('الرجاء عدم تكرار أسماء الأنواع.');
      return;
    }
    setChestStyleOptions(cleaned);
    setSelectedChestStyleOptions((prev) => prev.filter((id) => cleaned.some((o) => o.id === id)));
    setIsChestStyleManagerOpen(false);
  };

  const chestStyleDraftLabelChange = (id: string, label: string) => {
    setChestStyleOptionsDraft((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const chestStyleDraftDelete = (id: string) => {
    setChestStyleOptionsDraft((prev) => prev.filter((o) => o.id !== id));
  };

  const chestStyleDraftAdd = () => {
    const id = `chest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setChestStyleOptionsDraft((prev) => [...prev, { id, label: 'خيار جديد' }]);
  };

  const openChestStyleQuickAdd = (open: boolean) => {
    setIsChestStyleQuickAddOpen(open);
    if (!open) {
      setChestStyleQuickAddValue('');
      setChestStyleQuickAddError('');
    }
  };

  const submitChestStyleQuickAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = chestStyleQuickAddValue.trim();
    if (!value) {
      setChestStyleQuickAddError('الرجاء إدخال اسم الخيار.');
      return;
    }
    if (chestStyleOptions.some((o) => o.label === value)) {
      setChestStyleQuickAddError('هذا الخيار موجود بالفعل.');
      return;
    }
    const option = { id: `chest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: value };
    setChestStyleOptions((prev) => [...prev, option]);
    setSelectedChestStyleOptions((prev) => [...prev, option.id]);
    openChestStyleQuickAdd(false);
  };

  // Helper functions for sleeve end options
  const openSleeveEndManager = (open: boolean) => {
    setIsSleeveEndManagerOpen(open);
    if (open) {
      setSleeveEndOptionsDraft(sleeveEndOptions.map((o) => ({ ...o })));
      setSleeveEndManagerError('');
    }
  };

  const submitSleeveEndOptions: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const cleaned = sleeveEndOptionsDraft.map((o) => ({ ...o, label: o.label.trim() })).filter((o) => o.label !== '');
    const labels = cleaned.map((o) => o.label);
    if (new Set(labels).size !== labels.length) {
      setSleeveEndManagerError('الرجاء عدم تكرار أسماء الأنواع.');
      return;
    }
    setSleeveEndOptions(cleaned);
    setSelectedSleeveEndOptions((prev) => prev.filter((id) => cleaned.some((o) => o.id === id)));
    setIsSleeveEndManagerOpen(false);
  };

  const sleeveEndDraftLabelChange = (id: string, label: string) => {
    setSleeveEndOptionsDraft((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const sleeveEndDraftDelete = (id: string) => {
    setSleeveEndOptionsDraft((prev) => prev.filter((o) => o.id !== id));
  };

  const sleeveEndDraftAdd = () => {
    const id = `sleeve-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSleeveEndOptionsDraft((prev) => [...prev, { id, label: 'خيار جديد' }]);
  };

  const openSleeveEndQuickAdd = (open: boolean) => {
    setIsSleeveEndQuickAddOpen(open);
    if (!open) {
      setSleeveEndQuickAddValue('');
      setSleeveEndQuickAddError('');
    }
  };

  const submitSleeveEndQuickAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = sleeveEndQuickAddValue.trim();
    if (!value) {
      setSleeveEndQuickAddError('الرجاء إدخال اسم الخيار.');
      return;
    }
    if (sleeveEndOptions.some((o) => o.label === value)) {
      setSleeveEndQuickAddError('هذا الخيار موجود بالفعل.');
      return;
    }
    const option = { id: `sleeve-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: value };
    setSleeveEndOptions((prev) => [...prev, option]);
    setSelectedSleeveEndOptions((prev) => [...prev, option.id]);
    openSleeveEndQuickAdd(false);
  };

  // Helper functions for fabric source options
  const openSourceManager = (open: boolean) => {
    setIsSourceManagerOpen(open);
    if (open) {
      setSourceOptionsDraft(fabricSourceOptions.map((o) => ({ ...o })));
      setSourceManagerError('');
    }
  };

  const submitSourceOptions: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const cleaned = sourceOptionsDraft.map((o) => ({ ...o, label: o.label.trim() })).filter((o) => o.label !== '');
    const labels = cleaned.map((o) => o.label);
    if (new Set(labels).size !== labels.length) {
      setSourceManagerError('الرجاء عدم تكرار أسماء المصادر.');
      return;
    }
    setFabricSourceOptions(cleaned);
    setSelectedFabricSources((prev) => prev.filter((id) => cleaned.some((o) => o.id === id)));
    setIsSourceManagerOpen(false);
  };

  const sourceDraftLabelChange = (id: string, label: string) => {
    setSourceOptionsDraft((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const sourceDraftDelete = (id: string) => {
    setSourceOptionsDraft((prev) => prev.filter((o) => o.id !== id));
  };

  const sourceDraftAdd = () => {
    const id = `source-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSourceOptionsDraft((prev) => [...prev, { id, label: 'مصدر جديد' }]);
  };

  const openSourceQuickAdd = (open: boolean) => {
    setIsSourceQuickAddOpen(open);
    if (!open) {
      setSourceQuickAddValue('');
      setSourceQuickAddError('');
    }
  };

  const submitSourceQuickAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = sourceQuickAddValue.trim();
    if (!value) {
      setSourceQuickAddError('الرجاء إدخال اسم المصدر.');
      return;
    }
    if (fabricSourceOptions.some((o) => o.label === value)) {
      setSourceQuickAddError('هذا المصدر موجود بالفعل.');
      return;
    }
    const option = { id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: value };
    setFabricSourceOptions((prev) => [...prev, option]);
    setSelectedFabricSources((prev) => [...prev, option.id]);
    openSourceQuickAdd(false);
  };

  // Helper functions for bunija options
  const openBunijaManager = (open: boolean) => {
    setIsBunijaManagerOpen(open);
    if (open) {
      setBunijaOptionsDraft(bunijaOptions.map((o) => ({ ...o })));
      setBunijaManagerError('');
    }
  };

  const submitBunijaOptions: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const cleaned = bunijaOptionsDraft.map((o) => ({ ...o, label: o.label.trim() })).filter((o) => o.label !== '');
    const labels = cleaned.map((o) => o.label);
    if (new Set(labels).size !== labels.length) {
      setBunijaManagerError('الرجاء عدم تكرار أسماء الأنواع.');
      return;
    }
    setBunijaOptions(cleaned);
    setSelectedBunijaOptions((prev) => prev.filter((id) => cleaned.some((o) => o.id === id)));
    setIsBunijaManagerOpen(false);
  };

  const bunijaDraftLabelChange = (id: string, label: string) => {
    setBunijaOptionsDraft((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const bunijaDraftDelete = (id: string) => {
    setBunijaOptionsDraft((prev) => prev.filter((o) => o.id !== id));
  };

  const bunijaDraftAdd = () => {
    const id = `bunija-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setBunijaOptionsDraft((prev) => [...prev, { id, label: 'نوع جديد' }]);
  };

  const openBunijaQuickAdd = (open: boolean) => {
    setIsBunijaQuickAddOpen(open);
    if (!open) {
      setBunijaQuickAddValue('');
      setBunijaQuickAddError('');
    }
  };

  const submitBunijaQuickAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = bunijaQuickAddValue.trim();
    if (!value) {
      setBunijaQuickAddError('الرجاء إدخال اسم النوع.');
      return;
    }
    if (bunijaOptions.some((o) => o.label === value)) {
      setBunijaQuickAddError('هذا النوع موجود بالفعل.');
      return;
    }
    const option = { id: `bunija-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: value };
    setBunijaOptions((prev) => [...prev, option]);
    setSelectedBunijaOptions((prev) => [...prev, option.id]);
    openBunijaQuickAdd(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#F6E9CA] border-[#C69A72] flex flex-col rounded-xl shadow-2xl">
        <DialogHeader className="flex-shrink-0 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute left-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-[#13312A] arabic-text">إنشاء فاتورة جديدة</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل بيانات الزبون والطلب لإصدار الفاتورة
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA] hover:scrollbar-thumb-[#B88A5A]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
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
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
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


          {/* Payment Information */}
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
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

          {/* Design Details Section */}
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
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
                <Popover open={isSourcePopoverOpen} onOpenChange={setIsSourcePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                        selectedFabricSources.length === 0 && 'text-muted-foreground',
                      )}
                    >
                      <span className="flex-1 text-right truncate">
                        {selectedFabricSources.length > 0
                          ? fabricSourceOptions
                              .filter((o) => selectedFabricSources.includes(o.id))
                              .map((o) => o.label)
                              .join('، ')
                          : 'اختر مصدر القماش'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                    <Command className="arabic-text text-right">
                      <CommandInput placeholder="ابحث عن مصدر القماش..." className="text-right" />
                      <CommandList className="text-right">
                        <CommandEmpty>لا توجد مصادر مطابقة</CommandEmpty>
                        <CommandItem
                          value="add-new"
                          onSelect={() => {
                            setIsSourcePopoverOpen(false);
                            openSourceQuickAdd(true);
                          }}
                          className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة مصدر جديد</span>
                        </CommandItem>
                        <CommandSeparator className="bg-[#C69A72]/50" />
                        {fabricSourceOptions.map((option) => {
                          const isSelected = selectedFabricSources.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.label}
                              onSelect={() => toggleFabricSource(option.id)}
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
                            setIsSourcePopoverOpen(false);
                            openSourceManager(true);
                          }}
                          className="w-full flex-row-reverse justify-center text-[#155446]"
                        >
                          <Pencil className="h-4 w-4" />
                          تعديل المصادر
                        </Button>
              </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">نوع الياقة</Label>
                <Popover open={isCollarPopoverOpen} onOpenChange={setIsCollarPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                        selectedCollarOptions.length === 0 && 'text-muted-foreground',
                      )}
                    >
                      <span className="flex-1 text-right truncate">
                        {selectedCollarOptions.length > 0
                          ? collarOptions
                              .filter((o) => selectedCollarOptions.includes(o.id))
                              .map((o) => o.label)
                              .join('، ')
                          : 'اختر نوع الياقة'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                    <Command className="arabic-text text-right">
                      <CommandInput placeholder="ابحث عن نوع الياقة..." className="text-right" />
                      <CommandList className="text-right">
                        <CommandEmpty>لا توجد أنواع مطابقة</CommandEmpty>
                        <CommandItem
                          value="add-new"
                          onSelect={() => {
                            setIsCollarPopoverOpen(false);
                            openCollarQuickAdd(true);
                          }}
                          className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة نوع جديد</span>
                        </CommandItem>
                        <CommandSeparator className="bg-[#C69A72]/50" />
                        {collarOptions.map((option) => {
                          const isSelected = selectedCollarOptions.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.label}
                              onSelect={() => toggleCollarOption(option.id)}
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
                            setIsCollarPopoverOpen(false);
                            openCollarManager(true);
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
                <Label className="text-[#13312A] arabic-text">أسلوب الصدر</Label>
                <Popover open={isChestStylePopoverOpen} onOpenChange={setIsChestStylePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                        selectedChestStyleOptions.length === 0 && 'text-muted-foreground',
                      )}
                    >
                      <span className="flex-1 text-right truncate">
                        {selectedChestStyleOptions.length > 0
                          ? chestStyleOptions
                              .filter((o) => selectedChestStyleOptions.includes(o.id))
                              .map((o) => o.label)
                              .join('، ')
                          : 'اختر أسلوب الصدر'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                    <Command className="arabic-text text-right">
                      <CommandInput placeholder="ابحث عن أسلوب الصدر..." className="text-right" />
                      <CommandList className="text-right">
                        <CommandEmpty>لا توجد أنماط مطابقة</CommandEmpty>
                        <CommandItem
                          value="add-new"
                          onSelect={() => {
                            setIsChestStylePopoverOpen(false);
                            openChestStyleQuickAdd(true);
                          }}
                          className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة نمط جديد</span>
                        </CommandItem>
                        <CommandSeparator className="bg-[#C69A72]/50" />
                        {chestStyleOptions.map((option) => {
                          const isSelected = selectedChestStyleOptions.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.label}
                              onSelect={() => toggleChestStyleOption(option.id)}
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
                            setIsChestStylePopoverOpen(false);
                            openChestStyleManager(true);
                          }}
                          className="w-full flex-row-reverse justify-center text-[#155446]"
                        >
                          <Pencil className="h-4 w-4" />
                          تعديل الأنماط
                        </Button>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">نهاية الكم</Label>
                <Popover open={isSleeveEndPopoverOpen} onOpenChange={setIsSleeveEndPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                        selectedSleeveEndOptions.length === 0 && 'text-muted-foreground',
                      )}
                    >
                      <span className="flex-1 text-right truncate">
                        {selectedSleeveEndOptions.length > 0
                          ? sleeveEndOptions
                              .filter((o) => selectedSleeveEndOptions.includes(o.id))
                              .map((o) => o.label)
                              .join('، ')
                          : 'اختر نهاية الكم'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                    <Command className="arabic-text text-right">
                      <CommandInput placeholder="ابحث عن نهاية الكم..." className="text-right" />
                      <CommandList className="text-right">
                        <CommandEmpty>لا توجد أنماط مطابقة</CommandEmpty>
                        <CommandItem
                          value="add-new"
                          onSelect={() => {
                            setIsSleeveEndPopoverOpen(false);
                            openSleeveEndQuickAdd(true);
                          }}
                          className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة نمط جديد</span>
                        </CommandItem>
                        <CommandSeparator className="bg-[#C69A72]/50" />
                        {sleeveEndOptions.map((option) => {
                          const isSelected = selectedSleeveEndOptions.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.label}
                              onSelect={() => toggleSleeveEndOption(option.id)}
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
                            setIsSleeveEndPopoverOpen(false);
                            openSleeveEndManager(true);
                          }}
                          className="w-full flex-row-reverse justify-center text-[#155446]"
                        >
                          <Pencil className="h-4 w-4" />
                          تعديل الأنماط
                        </Button>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">نوع البنيجة</Label>
                <Popover open={isBunijaPopoverOpen} onOpenChange={setIsBunijaPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-white border-[#C69A72] text-[#155446] arabic-text',
                        selectedBunijaOptions.length === 0 && 'text-muted-foreground',
                      )}
                    >
                      <span className="flex-1 text-right truncate">
                        {selectedBunijaOptions.length > 0
                          ? bunijaOptions
                              .filter((o) => selectedBunijaOptions.includes(o.id))
                              .map((o) => o.label)
                              .join('، ')
                          : 'اختر نوع البنيجة'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-[#F6E9CA] border-[#C69A72]">
                    <Command className="arabic-text text-right">
                      <CommandInput placeholder="ابحث عن نوع البنيجة..." className="text-right" />
                      <CommandList className="text-right">
                        <CommandEmpty>لا توجد أنواع مطابقة</CommandEmpty>
                        <CommandItem
                          value="add-new"
                          onSelect={() => {
                            setIsBunijaPopoverOpen(false);
                            openBunijaQuickAdd(true);
                          }}
                          className="flex flex-row-reverse items-center justify-end gap-2 text-[#155446]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة نوع جديد</span>
                        </CommandItem>
                        <CommandSeparator className="bg-[#C69A72]/50" />
                        {bunijaOptions.map((option) => {
                          const isSelected = selectedBunijaOptions.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.label}
                              onSelect={() => toggleBunijaOption(option.id)}
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
                            setIsBunijaPopoverOpen(false);
                            openBunijaManager(true);
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
            </CardContent>
          </Card>

          {/* Fabric Image Upload Section */}
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">صورة القماش</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-white border-[#C69A72] rounded-lg shadow-sm">
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
          </form>
        </div>

        {/* Dialog Footer - Fixed at bottom */}
        <DialogFooter className="flex-shrink-0 flex gap-2 pt-4 border-t border-[#C69A72]/20 bg-[#F6E9CA]">
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
            onClick={handleSubmit}
              className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
            </Button>
          </DialogFooter>
      </DialogContent>

      {/* Fabric Manager Dialog - Compact */}
      <Dialog open={isFabricManagerOpen} onOpenChange={handleFabricManagerOpenChange}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنواع القماش</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف أنواع القماش
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFabricOptionsSubmit} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {fabricOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => handleDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {fabricOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد أنواع حالياً، أضف نوعاً جديداً للبدء.
                </p>
              )}
            </div>
            {fabricManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{fabricManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة نوع
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFabricManagerOpen(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
        </form>
      </DialogContent>
      </Dialog>

      {/* Quick Add Dialog - Compact */}
      <Dialog open={isQuickAddDialogOpen} onOpenChange={handleQuickAddDialogOpenChange}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نوع قماش جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف نوعاً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickAddSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-fabric-option">
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
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم النوع الجديد"
              />
              {quickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{quickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAddDialogOpenChange(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Collar Manager Dialog - Compact */}
      <Dialog open={isCollarManagerOpen} onOpenChange={openCollarManager}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنواع الياقة</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف أنواع الياقة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCollarOptions} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {collarOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => collarDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => collarDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {collarOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد أنواع حالياً، أضف نوعاً جديداً للبدء.
                </p>
              )}
            </div>
            {collarManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{collarManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={collarDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة نوع
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openCollarManager(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Collar Quick Add Dialog - Compact */}
      <Dialog open={isCollarQuickAddOpen} onOpenChange={openCollarQuickAdd}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نوع ياقة جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف نوعاً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCollarQuickAdd} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-collar-option">
                اسم النوع
              </Label>
              <Input
                id="new-collar-option"
                value={collarQuickAddValue}
                onChange={(event) => {
                  setCollarQuickAddValue(event.target.value);
                  if (collarQuickAddError) {
                    setCollarQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم النوع الجديد"
              />
              {collarQuickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{collarQuickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => openCollarQuickAdd(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chest Style Manager Dialog - Compact */}
      <Dialog open={isChestStyleManagerOpen} onOpenChange={openChestStyleManager}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنماط الصدر</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف أنماط الصدر
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitChestStyleOptions} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {chestStyleOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => chestStyleDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => chestStyleDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {chestStyleOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد أنماط حالياً، أضف نمطاً جديداً للبدء.
                </p>
              )}
            </div>
            {chestStyleManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{chestStyleManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={chestStyleDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة نمط
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openChestStyleManager(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chest Style Quick Add Dialog - Compact */}
      <Dialog open={isChestStyleQuickAddOpen} onOpenChange={openChestStyleQuickAdd}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نمط صدر جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف نمطاً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitChestStyleQuickAdd} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-chest-option">
                اسم النمط
              </Label>
              <Input
                id="new-chest-option"
                value={chestStyleQuickAddValue}
                onChange={(event) => {
                  setChestStyleQuickAddValue(event.target.value);
                  if (chestStyleQuickAddError) {
                    setChestStyleQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم النمط الجديد"
              />
              {chestStyleQuickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{chestStyleQuickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => openChestStyleQuickAdd(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sleeve End Manager Dialog - Compact */}
      <Dialog open={isSleeveEndManagerOpen} onOpenChange={openSleeveEndManager}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنماط نهاية الكم</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف أنماط نهاية الكم
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSleeveEndOptions} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {sleeveEndOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => sleeveEndDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => sleeveEndDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {sleeveEndOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد أنماط حالياً، أضف نمطاً جديداً للبدء.
                </p>
              )}
            </div>
            {sleeveEndManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{sleeveEndManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={sleeveEndDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة نمط
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openSleeveEndManager(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sleeve End Quick Add Dialog - Compact */}
      <Dialog open={isSleeveEndQuickAddOpen} onOpenChange={openSleeveEndQuickAdd}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نمط نهاية كم جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف نمطاً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSleeveEndQuickAdd} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-sleeve-option">
                اسم النمط
              </Label>
              <Input
                id="new-sleeve-option"
                value={sleeveEndQuickAddValue}
                onChange={(event) => {
                  setSleeveEndQuickAddValue(event.target.value);
                  if (sleeveEndQuickAddError) {
                    setSleeveEndQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم النمط الجديد"
              />
              {sleeveEndQuickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{sleeveEndQuickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => openSleeveEndQuickAdd(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Source Manager Dialog - Compact */}
      <Dialog open={isSourceManagerOpen} onOpenChange={openSourceManager}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل مصادر القماش</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف مصادر القماش
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSourceOptions} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {sourceOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => sourceDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => sourceDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف المصدر"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {sourceOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد مصادر حالياً، أضف مصدراً جديداً للبدء.
                </p>
              )}
            </div>
            {sourceManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{sourceManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={sourceDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة مصدر
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openSourceManager(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Source Quick Add Dialog - Compact */}
      <Dialog open={isSourceQuickAddOpen} onOpenChange={openSourceQuickAdd}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة مصدر قماش جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف مصدراً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSourceQuickAdd} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-source-option">
                اسم المصدر
              </Label>
              <Input
                id="new-source-option"
                value={sourceQuickAddValue}
                onChange={(event) => {
                  setSourceQuickAddValue(event.target.value);
                  if (sourceQuickAddError) {
                    setSourceQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم المصدر الجديد"
              />
              {sourceQuickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{sourceQuickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => openSourceQuickAdd(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bunija Manager Dialog - Compact */}
      <Dialog open={isBunijaManagerOpen} onOpenChange={openBunijaManager}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-md bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">تعديل أنواع البنيجة</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              قم بإضافة أو تعديل أو حذف أنواع البنيجة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBunijaOptions} className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#C69A72] scrollbar-track-[#F6E9CA]">
              {bunijaOptionsDraft.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(event) => bunijaDraftLabelChange(option.id, event.target.value)}
                    className="flex-1 bg-white border-[#C69A72] text-right text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => bunijaDraftDelete(option.id)}
                    className="text-red-600 hover:bg-red-100 h-8 w-8"
                    aria-label="حذف النوع"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {bunijaOptionsDraft.length === 0 && (
                <p className="text-xs text-[#155446] arabic-text text-center py-4">
                  لا توجد أنواع حالياً، أضف نوعاً جديداً للبدء.
                </p>
              )}
            </div>
            {bunijaManagerError && (
              <p className="text-xs text-red-600 arabic-text text-right">{bunijaManagerError}</p>
            )}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={bunijaDraftAdd}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إضافة نوع
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openBunijaManager(false)}
                  className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bunija Quick Add Dialog - Compact */}
      <Dialog open={isBunijaQuickAddOpen} onOpenChange={openBunijaQuickAdd}>
        <DialogOverlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-sm bg-[#F6E9CA] border-[#C69A72] rounded-xl shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#13312A] arabic-text text-lg">إضافة نوع بنيجة جديد</DialogTitle>
            <DialogDescription className="text-[#155446] arabic-text text-sm">
              أضف نوعاً جديداً للقائمة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBunijaQuickAdd} className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[#13312A] arabic-text text-sm" htmlFor="new-bunija-option">
                اسم النوع
              </Label>
              <Input
                id="new-bunija-option"
                value={bunijaQuickAddValue}
                onChange={(event) => {
                  setBunijaQuickAddValue(event.target.value);
                  if (bunijaQuickAddError) {
                    setBunijaQuickAddError('');
                  }
                }}
                className="bg-white border-[#C69A72] text-right text-sm h-8"
                placeholder="أدخل اسم النوع الجديد"
              />
              {bunijaQuickAddError && (
                <p className="text-xs text-red-600 arabic-text text-right">{bunijaQuickAddError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#C69A72]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => openBunijaQuickAdd(false)}
                className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] text-sm h-8"
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] text-sm h-8">
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}


