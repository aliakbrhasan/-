import React from 'react';
import { Home, FileText, Receipt, Users, Menu, Settings, User, LogOut, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Layout({ children, currentPage, onNavigate, isLoggedIn, onLogout }: LayoutProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'الصفحة الرئيسية', icon: Home },
    { id: 'invoices', label: 'الفواتير', icon: Receipt },
    { id: 'customers', label: 'الزبائن', icon: Users },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
    { id: 'financial', label: 'المالية', icon: DollarSign },
  ];
  const activePage = currentPage === 'customerDetails' ? 'customers' : currentPage;

  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-[#13312A] border-t border-[#155446] z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 touch-target ${
                activePage === item.id
                  ? 'text-[#F6E9CA] bg-[#155446]'
                  : 'text-[#C69A72] hover:text-[#F6E9CA] hover:bg-[#155446]'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs arabic-text">{item.label}</span>
            </Button>
          );
        })}
        
        <Sheet>
          <SheetTrigger className="inline-flex flex-col items-center gap-1 p-2 touch-target text-[#C69A72] hover:text-[#F6E9CA] hover:bg-[#155446] rounded-md transition-colors">
            <Menu size={20} />
            <span className="text-xs arabic-text">المزيد</span>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#13312A] border-[#155446] w-80">
            <SheetHeader>
              <SheetTitle className="text-[#F6E9CA] arabic-text">القائمة</SheetTitle>
              <SheetDescription className="text-[#C69A72] arabic-text">
                الخيارات والإعدادات الإضافية
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('reports')}
                className="flex items-center gap-3 justify-start text-[#F6E9CA] hover:bg-[#155446] p-4 touch-target"
              >
                <FileText size={20} />
                <span className="arabic-text">التقارير</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('users')}
                className="flex items-center gap-3 justify-start text-[#F6E9CA] hover:bg-[#155446] p-4 touch-target"
              >
                <Settings size={20} />
                <span className="arabic-text">إدارة المستخدمين</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-3 justify-start text-[#F6E9CA] hover:bg-[#155446] p-4 touch-target"
              >
                <User size={20} />
                <span className="arabic-text">الملف الشخصي</span>
              </Button>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="flex items-center gap-3 justify-start text-[#F6E9CA] hover:bg-destructive p-4 touch-target"
              >
                <LogOut size={20} />
                <span className="arabic-text">تسجيل الخروج</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  const DesktopNavigation = () => (
    <header className="bg-[#13312A] border-b border-[#155446] hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl text-[#F6E9CA] arabic-text">نظام إدارة التفصيل</h1>
            <nav className="flex gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 touch-target ${
                      activePage === item.id
                        ? 'text-[#F6E9CA] bg-[#155446]'
                        : 'text-[#C69A72] hover:text-[#F6E9CA] hover:bg-[#155446]'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="arabic-text">{item.label}</span>
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                onClick={() => onNavigate('reports')}
              className={`flex items-center gap-2 px-4 py-2 touch-target ${
                activePage === 'reports'
                  ? 'text-[#F6E9CA] bg-[#155446]'
                  : 'text-[#C69A72] hover:text-[#F6E9CA] hover:bg-[#155446]'
              }`}
              >
                <FileText size={18} />
                <span className="arabic-text">التقارير</span>
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onNavigate('users')}
              className="text-[#C69A72] hover:text-[#F6E9CA] hover:bg-[#155446] p-2 touch-target"
            >
              <Settings size={18} />
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-[#C69A72] hover:text-[#F6E9CA] hover:bg-destructive p-2 touch-target"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-[#F6E9CA]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6E9CA]">
      <DesktopNavigation />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}