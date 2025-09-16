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

interface CustomersPageProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
}

export function CustomersPage({ customers, onCustomerSelect }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState('all');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

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
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handlePrintCustomers}
            className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target"
          >
            <Printer className="w-4 h-4 ml-2" />
            <span className="arabic-text">طباعة القائمة</span>
          </Button>
          <Button onClick={() => setIsNewCustomerOpen(true)} className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target">
            <Plus className="w-4 h-4 ml-2" />
            <span className="arabic-text">زبون جديد</span>
          </Button>
        </div>
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
              className="bg-white border-[#C69A72] hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C69A72]"
            >
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
                      <p className="text-2xl text-[#13312A]">{ordersCount}</p>
                      <p className="text-sm text-[#155446] arabic-text">طلب</p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#C69A72] text-[#13312A] hover:bg-[#C69A72] touch-target"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                      }}
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      <span className="arabic-text">تعديل</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NewCustomerDialog />
    </div>
  );
}