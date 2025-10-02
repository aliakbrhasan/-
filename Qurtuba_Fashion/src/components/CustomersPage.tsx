import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Plus,
  Search,
  Edit,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Star,
  Printer
} from 'lucide-react';
import { Customer } from '../types/customer';
import { openPrintWindow, formatPrintDateTime } from './print/PrintUtils';
import { formatCurrency, formatDate } from './PrintableInvoice';
import { databaseService } from '../db/database.service';

interface CustomersPageProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
  loading?: boolean;
}

export function CustomersPage({ customers, onCustomerSelect, loading = false }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState('all');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    label: 'جديد'
  });

  // Lightweight date formatter for human-readable dates
  const formatHumanDate = (dateString: string | null) => {
    if (!dateString) return 'لا يوجد طلبات';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'أمس';
      if (diffDays < 7) return `منذ ${diffDays} أيام`;
      if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
      
      // Format as MM-YYYY HH:MM for older dates
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${month}-${year} ${hours}:${minutes}`;
    } catch {
      return 'تاريخ غير صحيح';
    }
  };

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

  const getLabelPrintStyle = (label: string): React.CSSProperties => {
    switch (label) {
      case 'ذهبي':
        return {
          backgroundColor: 'rgba(246, 196, 120, 0.25)',
          color: '#8a5a00',
          border: '1px solid rgba(246, 196, 120, 0.5)',
        };
      case 'وفي':
        return {
          backgroundColor: 'rgba(134, 88, 190, 0.18)',
          color: '#533288',
          border: '1px solid rgba(134, 88, 190, 0.35)',
        };
      case 'منتظم':
        return {
          backgroundColor: 'rgba(21, 84, 70, 0.15)',
          color: '#155446',
          border: '1px solid rgba(21, 84, 70, 0.4)',
        };
      case 'جديد':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          color: '#1d4ed8',
          border: '1px solid rgba(59, 130, 246, 0.35)',
        };
      default:
        return {
          backgroundColor: 'rgba(198, 154, 114, 0.2)',
          color: '#13312A',
          border: '1px solid rgba(198, 154, 114, 0.4)',
        };
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      return;
    }

    try {
      setIsCreating(true);
      const customerData = {
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        label: newCustomer.label,
        totalSpent: 0,
        lastOrder: null,
        measurements: {},
        notes: ''
      };

      await databaseService.createCustomer(customerData);
      
      // Reset form
      setNewCustomer({
        name: '',
        phone: '',
        address: '',
        label: 'جديد'
      });
      setIsNewCustomerOpen(false);
      
      // Refresh the page to show new customer
      window.location.reload();
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.includes(searchTerm) ||
                         customer.phone.includes(searchTerm) ||
                         customer.address.includes(searchTerm);
    const matchesFilter = filterLabel === 'all' || customer.label === filterLabel;
    return matchesSearch && matchesFilter;
  });

  const handlePrintCustomers = () => {
    const totalCustomers = filteredCustomers.length;
    const totalOrders = filteredCustomers.reduce((sum, customer) => sum + customer.orders.length, 0);
    const totalSpent = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageOrders = totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : '0';
    const labelCounts = filteredCustomers.reduce<Record<string, number>>((acc, customer) => {
      acc[customer.label] = (acc[customer.label] || 0) + 1;
      return acc;
    }, {});
    const now = new Date();

    openPrintWindow('قائمة الزبائن', (
      <>
        <header className="print-header">
          <h1 className="print-title">سجل الزبائن</h1>
          <p className="print-subtitle">قائمة ببيانات الزبائن وتفاصيل التعامل معهم داخل مركز أزياء قرطبة</p>
          <div className="print-meta">
            <span>تاريخ الطباعة: {formatPrintDateTime(now)}</span>
            <span>عدد الزبائن: {totalCustomers}</span>
          </div>
        </header>

        <section className="print-section">
          <h2 className="section-title">ملخص سريع</h2>
          <div className="metrics-grid">
            <div className="metric-card accent">
              <span className="metric-label">عدد الزبائن الحالي</span>
              <span className="metric-value">{totalCustomers}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">إجمالي الإنفاق</span>
              <span className="metric-value">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">عدد الطلبات المسجلة</span>
              <span className="metric-value">{totalOrders}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">متوسط الطلبات لكل زبون</span>
              <span className="metric-value">{averageOrders}</span>
            </div>
            {Object.entries(labelCounts).map(([label, count]) => (
              <div className="metric-card" key={label}>
                <span className="metric-label">زبائن {label}</span>
                <span className="metric-value">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section">
          <h2 className="section-title">جدول الزبائن</h2>
          <p className="section-description">يسرد الجدول التفاصيل الأساسية عن كل زبون بما في ذلك معلومات التواصل والتصنيف.</p>
          <div className="print-table-wrapper">
            <table className="print-table">
              <thead>
                <tr>
                  <th>اسم الزبون</th>
                  <th>الهاتف</th>
                  <th>العنوان</th>
                  <th>التصنيف</th>
                  <th>آخر طلب</th>
                  <th>إجمالي الإنفاق</th>
                  <th>عدد الطلبات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <span className="status-pill" style={getLabelPrintStyle(customer.label)}>
                        {customer.label}
                      </span>
                    </td>
                    <td>{formatDate(customer.lastOrder)}</td>
                    <td>{formatCurrency(customer.totalSpent)}</td>
                    <td>{customer.orders.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="print-section">
          <h2 className="section-title">تفاصيل الزبائن</h2>
          <p className="section-description">يقدم هذا القسم عرضاً تفصيلياً لتاريخ كل زبون وقياساته والطلبات التي تمت متابعتها.</p>
          <div className="detail-cards">
            {filteredCustomers.map((customer) => (
              <article className="detail-card" key={`customer-${customer.id}`}>
                <div className="detail-card-header">
                  <h3 className="detail-title">{customer.name}</h3>
                  <span className="status-pill" style={getLabelPrintStyle(customer.label)}>
                    {customer.label}
                  </span>
                </div>
                <div className="detail-grid two-column">
                  <div className="detail-item">
                    <span className="item-label">الهاتف</span>
                    <span className="item-value">{customer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">العنوان</span>
                    <span className="item-value">{customer.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">آخر طلب</span>
                    <span className="item-value">{formatDate(customer.lastOrder)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">إجمالي الإنفاق</span>
                    <span className="item-value">{formatCurrency(customer.totalSpent)}</span>
                  </div>
                </div>

                <div className="detail-subsection">
                  <h4 className="subsection-title">القياسات الأساسية</h4>
                  <div className="detail-grid two-column">
                    <div className="detail-item">
                      <span className="item-label">الطول</span>
                      <span className="item-value">{customer.measurements.height} سم</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">الأكتاف</span>
                      <span className="item-value">{customer.measurements.shoulder} سم</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">الخصر</span>
                      <span className="item-value">{customer.measurements.waist} سم</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">الصدر</span>
                      <span className="item-value">{customer.measurements.chest} سم</span>
                    </div>
                  </div>
                </div>

                <div className="detail-subsection">
                  <h4 className="subsection-title">سجل الطلبات</h4>
                  <ul className="list">
                    {customer.orders.length > 0 ? (
                      customer.orders.map((order) => (
                        <li className="list-item" key={order.id}>
                          <div className="item-label">#{order.id} — {order.type}</div>
                          <div className="item-value">الحالة: {order.status}</div>
                          <div className="item-value">الفترة: {formatDate(order.orderDate)} إلى {formatDate(order.deliveryDate)}</div>
                          <div className="item-value">قيمة الطلب: {formatCurrency(order.total)} | المدفوع: {formatCurrency(order.paid)}</div>
                        </li>
                      ))
                    ) : (
                      <li className="list-item">لا توجد طلبات مسجلة لهذا الزبون.</li>
                    )}
                  </ul>
                </div>

                {customer.notes && (
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="item-label">ملاحظات إضافية</span>
                      <span className="item-value">{customer.notes}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </>
    ));
  };

  const NewCustomerDialog = () => (
    <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
      <DialogContent className="max-w-2xl bg-[#F6E9CA] border-[#C69A72]">
        <DialogHeader>
          <DialogTitle className="text-[#13312A] arabic-text">إضافة زبون جديد</DialogTitle>
          <DialogDescription className="text-[#155446] arabic-text">
            أدخل بيانات الزبون الجديد
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateCustomer(); }}>
          <Card className="bg-white border-[#C69A72]">
            <CardHeader>
              <CardTitle className="text-[#13312A] arabic-text text-lg">البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#13312A] arabic-text">الاسم الكامل</Label>
                <Input 
                  placeholder="أدخل الاسم الكامل" 
                  className="bg-white border-[#C69A72] text-right"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#13312A] arabic-text">رقم الهاتف</Label>
                  <Input 
                    placeholder="077xxxxxxxx" 
                    className="bg-white border-[#C69A72] text-right"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#13312A] arabic-text">تصنيف الزبون</Label>
                  <Select 
                    value={newCustomer.label}
                    onValueChange={(value: string) => setNewCustomer({...newCustomer, label: value})}
                  >
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
                <Input 
                  placeholder="أدخل العنوان الكامل" 
                  className="bg-white border-[#C69A72] text-right"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsNewCustomerOpen(false)} 
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72]"
              disabled={isCreating}
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA]"
              disabled={isCreating}
            >
              {isCreating ? 'جاري الحفظ...' : 'حفظ الزبون'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-[#F6E9CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h1 className="text-3xl font-semibold text-[#13312A] arabic-text">إدارة الزبائن</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handlePrintCustomers}
              className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] hover:border-[#B8886A] h-11 px-6 touch-target focus:ring-2 focus:ring-[#C69A72] focus:ring-offset-2"
            >
              <Printer className="w-4 h-4 ml-2" aria-hidden="true" />
              <span className="arabic-text">طباعة القائمة</span>
            </Button>
            <Button 
              onClick={() => setIsNewCustomerOpen(true)} 
              className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] h-11 px-6 touch-target focus:ring-2 focus:ring-[#155446] focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 ml-2" aria-hidden="true" />
              <span className="arabic-text">زبون جديد</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border border-[#C69A72] rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#155446] w-5 h-5" aria-hidden="true" />
                <Input
                  placeholder="بحث عن الزبائن بالاسم، الهاتف، أو العنوان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 bg-white border-[#C69A72] text-right text-base focus:ring-2 focus:ring-[#155446] focus:border-[#155446] rounded-xl"
                  aria-label="بحث عن الزبائن"
                />
              </div>
              <div className="lg:w-48">
                <select
                  value={filterLabel}
                  onChange={(e) => setFilterLabel(e.target.value)}
                  className="w-full h-12 px-4 py-2 border border-[#C69A72] rounded-xl bg-white text-[#13312A] arabic-text touch-target focus:ring-2 focus:ring-[#155446] focus:border-[#155446] text-base"
                  aria-label="تصفية حسب التصنيف"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {['جديد', 'منتظم', 'وفي', 'ذهبي'].map((label) => {
            const count = customers.filter(c => c.label === label).length;
            return (
              <Card key={label} className="bg-white border border-[#C69A72] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {getLabelIcon(label)}
                    <Badge className={`${getLabelColor(label)} px-3 py-1 text-sm font-medium rounded-full`}>
                      {label}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-[#13312A] mb-1">{count}</p>
                  <p className="text-sm text-[#155446] arabic-text">زبون</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customers List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-[#13312A] arabic-text">جاري تحميل بيانات الزبائن...</div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-[#13312A] arabic-text mb-4">لا توجد زبائن مسجلة</div>
              <Button 
                onClick={() => setIsNewCustomerOpen(true)} 
                className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] h-11 px-6"
              >
                <Plus className="w-4 h-4 ml-2" />
                <span className="arabic-text">إضافة زبون جديد</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => {
                const ordersCount = customer.orders.length;
                return (
                  <Card
                    key={customer.id}
                    onClick={() => onCustomerSelect(customer)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onCustomerSelect(customer);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`عرض تفاصيل ${customer.name}`}
                    className="bg-white border border-[#C69A72] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155446] focus:ring-offset-2"
                  >
                    <CardContent className="p-6">
                      {/* Header with name and badge */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#13312A] arabic-text truncate flex-1">{customer.name}</h3>
                        <Badge className={`${getLabelColor(customer.label)} flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full flex-shrink-0`}>
                          {getLabelIcon(customer.label)}
                          {customer.label}
                        </Badge>
                      </div>

                      {/* Customer details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-[#155446]">
                          <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm truncate" title={customer.phone}>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#155446]">
                          <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm truncate arabic-text" title={customer.address}>{customer.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#155446]">
                          <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm arabic-text">آخر طلب: {formatHumanDate(customer.lastOrder)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#155446]">
                          <CreditCard className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm arabic-text">{customer.totalSpent} دينار عراقي</span>
                        </div>
                      </div>

                      {/* Footer with orders count and edit button */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#C69A72]/20">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#13312A]">{ordersCount}</p>
                          <p className="text-xs text-[#155446] arabic-text">طلب</p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] hover:border-[#B8886A] h-9 px-4 touch-target focus:ring-2 focus:ring-[#C69A72] focus:ring-offset-2"
                          onClick={(event: React.MouseEvent) => {
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                        >
                          <Edit className="w-4 h-4 ml-1" aria-hidden="true" />
                          <span className="arabic-text">تعديل</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <NewCustomerDialog />
    </div>
  );
}