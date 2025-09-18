import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, UserPlus, Shield, Users, Grid3X3, List } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { User } from '../types/user';

const initialUsers: User[] = [
  {
    id: 1,
    code: 'ADM001',
    name: 'أحمد محمد',
    email: 'ahmed@qurtuba.com',
    phone: '07701234567',
    status: 'ادمن',
    role: 'مدير النظام',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  },
  {
    id: 2,
    code: 'EMP001',
    name: 'فاطمة علي',
    email: 'fatima@qurtuba.com',
    phone: '07807654321',
    status: 'موظف',
    role: 'مندوب مبيعات',
    isActive: true,
    createdAt: '2024-01-05',
    lastLogin: '2024-01-14'
  },
  {
    id: 3,
    code: 'ACC001',
    name: 'محمد خالد',
    email: 'mohammed@qurtuba.com',
    phone: '07909876543',
    status: 'محاسب',
    role: 'محاسب رئيسي',
    isActive: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-01-13'
  }
];


interface UsersManagementPageProps {
  onNavigate?: (page: string) => void;
}

export function UsersManagementPage({ onNavigate }: UsersManagementPageProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [newUser, setNewUser] = useState<Partial<User>>({
    code: '',
    name: '',
    email: '',
    phone: '',
    status: 'موظف',
    role: '',
    isActive: true
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.code) {
      const user: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        code: newUser.code,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        status: newUser.status || 'موظف',
        role: newUser.role,
        isActive: newUser.isActive || true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({
        code: '',
        name: '',
        email: '',
        phone: '',
        status: 'موظف',
        role: '',
        isActive: true
      });
      setIsAddUserDialogOpen(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };


  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ادمن':
        return 'destructive';
      case 'موظف':
        return 'default';
      case 'محاسب':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-[#13312A] arabic-text">إدارة المستخدمين</h1>
        </div>
        
        {/* View Mode and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline arabic-text">البطاقات</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline arabic-text">الجدول</span>
            </Button>
          </div>
          <div className="flex gap-2">
          <Button 
            onClick={() => onNavigate?.('roles')}
            variant="outline"
            className="border-[#13312A] text-[#13312A] hover:bg-[#13312A] hover:text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            إدارة الأدوار
          </Button>
          
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#13312A] hover:bg-[#155446] text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md h-[85vh] sm:h-[90vh] max-h-[85vh] sm:max-h-[90vh] p-3 sm:p-6 m-0 rounded-none sm:rounded-lg flex flex-col overscroll-contain">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="arabic-text">إضافة مستخدم جديد</DialogTitle>
                <DialogDescription className="arabic-text">
                  قم بإضافة مستخدم جديد للنظام
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 overflow-y-auto flex-1 min-h-0 max-h-[calc(85vh-100px)] sm:max-h-[calc(90vh-120px)] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 touch-pan-y">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userCode" className="arabic-text">رمز المستخدم</Label>
                    <Input
                      id="userCode"
                      value={newUser.code || ''}
                      onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
                      placeholder="أدخل رمز المستخدم"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userName" className="arabic-text">اسم المستخدم</Label>
                    <Input
                      id="userName"
                      value={newUser.name || ''}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="أدخل اسم المستخدم"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userEmail" className="arabic-text">البريد الإلكتروني</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email || ''}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPhone" className="arabic-text">رقم الهاتف</Label>
                    <Input
                      id="userPhone"
                      value={newUser.phone || ''}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userStatus" className="arabic-text">الحالة</Label>
                    <Select value={newUser.status} onValueChange={(value: any) => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ادمن">ادمن</SelectItem>
                        <SelectItem value="موظف">موظف</SelectItem>
                        <SelectItem value="محاسب">محاسب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="userRole" className="arabic-text">الدور</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                        <SelectItem value="مندوب مبيعات">مندوب مبيعات</SelectItem>
                        <SelectItem value="محاسب رئيسي">محاسب رئيسي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-shrink-0 mt-4">
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddUser}>إضافة</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>

      {/* قائمة المستخدمين */}
      {viewMode === 'cards' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 arabic-text">
              <Users className="w-5 h-5" />
              قائمة المستخدمين
            </CardTitle>
            <CardDescription className="arabic-text">
              إدارة المستخدمين والصلاحيات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-[#13312A] hover:shadow-lg transition-all duration-200">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold arabic-text text-[#13312A]">{user.name}</h3>
                          <Badge variant="outline" className="text-xs w-fit border-[#13312A] text-[#13312A]">{user.code}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 arabic-text mb-1">{user.email}</p>
                        <p className="text-sm text-gray-500 arabic-text">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs px-2 py-1">
                        {user.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1 border-[#13312A] text-[#13312A]">{user.role}</Badge>
                      <Badge variant={user.isActive ? "default" : "secondary"} className={`text-xs px-2 py-1 ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {user.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="flex-1 sm:flex-none border-[#13312A] text-[#13312A] hover:bg-[#13312A] hover:text-white"
                    >
                      <Edit className="w-4 h-4 sm:mr-1" />
                      <span className="sm:hidden arabic-text text-xs">تعديل</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-1" />
                      <span className="sm:hidden arabic-text text-xs">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#13312A] arabic-text flex items-center gap-2">
              <Users className="w-5 h-5" />
              قائمة المستخدمين
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الاسم</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الرمز</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الهاتف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الدور</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">النشاط</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 arabic-text">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900 arabic-text">{user.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="text-xs px-2 py-1 border-[#13312A] text-[#13312A]">
                        {user.code}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 arabic-text">{user.email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 arabic-text">{user.phone}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs px-2 py-1">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="text-xs px-2 py-1 border-[#13312A] text-[#13312A]">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.isActive ? "default" : "secondary"} className={`text-xs px-2 py-1 ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {user.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="border-[#13312A] text-[#13312A] hover:bg-[#13312A] hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة تعديل المستخدم */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="w-full max-w-md h-[100dvh] max-h-[100dvh] p-4 sm:p-6 m-0 rounded-none sm:rounded-lg flex flex-col overscroll-contain">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="arabic-text">تعديل المستخدم</DialogTitle>
              <DialogDescription className="arabic-text">
                قم بتعديل بيانات المستخدم
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1 min-h-0 max-h-[calc(100dvh-200px)] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 touch-pan-y">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editUserCode" className="arabic-text">رمز المستخدم</Label>
                  <Input
                    id="editUserCode"
                    value={editingUser.code}
                    onChange={(e) => setEditingUser({ ...editingUser, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editUserName" className="arabic-text">اسم المستخدم</Label>
                  <Input
                    id="editUserName"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editUserEmail" className="arabic-text">البريد الإلكتروني</Label>
                  <Input
                    id="editUserEmail"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editUserPhone" className="arabic-text">رقم الهاتف</Label>
                  <Input
                    id="editUserPhone"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editUserStatus" className="arabic-text">الحالة</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(value: any) => setEditingUser({ ...editingUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ادمن">ادمن</SelectItem>
                      <SelectItem value="موظف">موظف</SelectItem>
                      <SelectItem value="محاسب">محاسب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editUserRole" className="arabic-text">الدور</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                      <SelectItem value="مندوب مبيعات">مندوب مبيعات</SelectItem>
                      <SelectItem value="محاسب رئيسي">محاسب رئيسي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-shrink-0 mt-4">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveUser}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
