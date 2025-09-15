import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';

import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Calendar as CalendarIcon,
  Edit,
  Trash2
} from 'lucide-react';


export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const orders = [
    {
      id: 1,
      customerName: 'أحمد محمد',
      phone: '07701234567',
      type: 'دشداشة ستايل كويتي',
      status: 'جديد',
      createdDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      total: 250,
      paid: 100,
      remaining: 150
    },
    {
      id: 2,
      customerName: 'صالح علي',
      phone: '07807654321',
      type: 'دشداشة',
      status: 'قيد التنفيذ',
      createdDate: '2024-01-14',
      deliveryDate: '2024-01-22',
      total: 180,
      paid: 180,
      remaining: 0
    },
    {
      id: 3,
      customerName: 'محمد خالد',
      phone: '07909876543',
      type: 'دشداشة',
      status: 'جاهز',
      createdDate: '2024-01-10',
      deliveryDate: '2024-01-20',
      total: 420,
      paid: 300,
      remaining: 120
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
      case 'جاهز': return 'bg-green-100 text-green-800';
      case 'مسلم': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.includes(searchTerm) ||
    order.phone.includes(searchTerm) ||
    order.type.includes(searchTerm)
  );

  const NewOrderDialog = () => (
    <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F6E9CA] border-[#C69A72]">
        <DialogHeader>
          <DialogTitle className="text-[#13312A] arabic-text">إضافة طلب جديد</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل تفاصيل الطلب الجديد وقياسات الزبون
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6">
          {/* Customer Info */}
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

          {/* Measurements */}
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

          {/* Style Details */}
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

          {/* Payment & Dates */}
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
                <Button variant="outline" className="w-full justify-start text-right bg-white border-[#C69A72]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toLocaleDateString('ar-SA') : 'اختر التاريخ'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Image */}
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
            <Button variant="outline" onClick={() => setIsNewOrderOpen(false)} className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]">
              إلغاء
            </Button>
            <Button className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]">
              حفظ الطلب
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
        <h1 className="text-2xl text-[#13312A] arabic-text">إدارة الطلبات</h1>
        <Button onClick={() => setIsNewOrderOpen(true)} className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target">
          <Plus className="w-4 h-4 ml-2" />
          <span className="arabic-text">طلب جديد</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border-[#C69A72]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#155446] w-4 h-4" />
              <Input
                placeholder="بحث عن الزبائن، الهاتف، أو نوع الطلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white border-[#C69A72] text-right"
              />
            </div>
            <Button variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target">
              <Filter className="w-4 h-4 ml-2" />
              <span className="arabic-text">تصفية</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-white border-[#C69A72] hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-[#13312A] arabic-text">{order.customerName}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <p className="text-[#155446] arabic-text">الهاتف: {order.phone}</p>
                    <p className="text-[#155446] arabic-text">النوع: {order.type}</p>
                    <p className="text-[#155446] arabic-text">التسليم: {order.deliveryDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-left">
                    <p className="text-lg text-[#13312A]">{order.total} دينار عراقي</p>
                    <p className="text-sm text-[#155446] arabic-text">
                      متبقي: {order.remaining} دينار عراقي
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 touch-target">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewOrderDialog />
    </div>
  );
}