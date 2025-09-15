import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Star
} from 'lucide-react';

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState('all');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  const customers = [
    {
      id: 1,
      name: 'أحمد محمد العراقي',
      phone: '07701234567',
      address: 'بغداد، منطقة الكرخ',
      totalSpent: 1250,
      lastOrder: '2024-01-15',
      label: 'ذهبي',
      ordersCount: 8
    },
    {
      id: 2,
      name: 'صالح علي الأحمد',
      phone: '07807654321',
      address: 'البصرة، حي العشار',
      totalSpent: 680,
      lastOrder: '2024-01-14',
      label: 'وفي',
      ordersCount: 4
    },
    {
      id: 3,
      name: 'محمد خالد ',
      phone: '07909876543',
      address: 'الموصل، حي الزراعة',
      totalSpent: 420,
      lastOrder: '2024-01-10',
      label: 'منتظم',
      ordersCount: 2
    },
    {
      id: 4,
      name: 'علي حسن ',
      phone: '07512345678',
      address: 'أربيل، حي أنكاوا',
      totalSpent: 150,
      lastOrder: '2024-01-12',
      label: 'جديد',
      ordersCount: 1
    },
    {
      id: 5,
      name: 'عبدالله أحمد ',
      phone: '07605678901',
      address: 'النجف، حي الاسرة',
      totalSpent: 890,
      lastOrder: '2024-01-08',
      label: 'وفي',
      ordersCount: 5
    }
  ];

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'منتظم': return 'bg-green-100 text-green-800';
      case 'وفي': return 'bg-purple-100 text-purple-800';
      case 'ذهبي': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case 'ذهبي': return <Star className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.includes(searchTerm) ||
                         customer.phone.includes(searchTerm) ||
                         customer.address.includes(searchTerm);
    const matchesFilter = filterLabel === 'all' || customer.label === filterLabel;
    return matchesSearch && matchesFilter;
  });

  const NewCustomerDialog = () => (
    <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
      <DialogContent className="max-w-2xl bg-[#F6E9CA] border-[#C69A72]">
        <DialogHeader>
          <DialogTitle className="text-[#13312A] arabic-text">إضافة زبون جديد</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل بيانات الزبون الجديد
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6">
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#13312A] arabic-text">الاسم الكامل</Label>
                <Input placeholder="أدخل الاسم الكامل" className="bg-white border-[#C69A72] text-right" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#13312A] arabic-text">رقم الهاتف</Label>
                  <Input placeholder="077xxxxxxxx" className="bg-white border-[#C69A72] text-right" />
                </div>
                <div>
                  <Label className="text-[#13312A] arabic-text">تصنيف الزبون</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-[#C69A72]">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جديد">جديد</SelectItem>
                      <SelectItem value="منتظم">منتظم</SelectItem>
                      <SelectItem value="وفي">وفي</SelectItem>
                      <SelectItem value="ذهبي">ذهبي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-[#13312A] arabic-text">العنوان</Label>
                <Input placeholder="أدخل العنوان الكامل" className="bg-white border-[#C69A72] text-right" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)} className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]">
              إلغاء
            </Button>
            <Button className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]">
              حفظ الزبون
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
        <h1 className="text-2xl text-[#13312A] arabic-text">إدارة الزبائن</h1>
        <Button onClick={() => setIsNewCustomerOpen(true)} className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target">
          <Plus className="w-4 h-4 ml-2" />
          <span className="arabic-text">زبون جديد</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border-[#C69A72]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#155446] w-4 h-4" />
              <Input
                placeholder="بحث عن الزبائن بالاسم، الهاتف، أو العنوان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white border-[#C69A72] text-right"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
                className="px-4 py-2 border border-[#C69A72] rounded-md bg-white text-[#13312A] arabic-text touch-target"
              >
                <option value="all">جميع التصنيفات</option>
                <option value="جديد">جديد</option>
                <option value="منتظم">منتظم</option>
                <option value="وفي">وفي</option>
                <option value="ذهبي">ذهبي</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['جديد', 'منتظم', 'وفي', 'ذهبي'].map((label) => {
          const count = customers.filter(c => c.label === label).length;
          return (
            <Card key={label} className="bg-white border-[#C69A72]">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getLabelIcon(label)}
                  <Badge className={getLabelColor(label)}>
                    {label}
                  </Badge>
                </div>
                <p className="text-2xl text-[#13312A]">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-white border-[#C69A72] hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg text-[#13312A] arabic-text">{customer.name}</h3>
                    <Badge className={`${getLabelColor(customer.label)} flex items-center gap-1`}>
                      {getLabelIcon(customer.label)}
                      {customer.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#155446]">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#155446]">
                      <MapPin className="w-4 h-4" />
                      <span className="arabic-text">{customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#155446]">
                      <CreditCard className="w-4 h-4" />
                      <span className="arabic-text">{customer.totalSpent} دينار عراقي</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#155446]">
                      <Calendar className="w-4 h-4" />
                      <span className="arabic-text">آخر طلب: {customer.lastOrder}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl text-[#13312A]">{customer.ordersCount}</p>
                    <p className="text-sm text-[#155446] arabic-text">طلب</p>
                  </div>
                  
                  <Button size="sm" variant="outline" className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target">
                    <Edit className="w-4 h-4 ml-1" />
                    <span className="arabic-text">تعديل</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewCustomerDialog />
    </div>
  );
}