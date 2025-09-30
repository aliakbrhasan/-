import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Bell, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from './dashboard/StatCard';
import { QuickActions } from './dashboard/QuickActions';
import { RecentActivities } from './dashboard/RecentActivities';
import { NotificationCenter } from './dashboard/NotificationCenter';
import { DashboardGrids } from './dashboard/ResponsiveGrid';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onCreateInvoice: () => void;
}

export function Dashboard({ onNavigate, onCreateInvoice }: DashboardProps) {
  const { stats, isLoading, error } = useDashboardStats();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 arabic-text mb-2">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-red-600 arabic-text mb-4">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#13312A] arabic-text mb-2">
            {getGreeting()}، أهلاً وسهلاً
          </h1>
          <p className="text-[#155446] arabic-text">
            نظرة عامة على العمل اليوم - {new Date().toLocaleDateString('ar-IQ')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="w-4 h-4 ml-2" />
            <span className="arabic-text">الإشعارات</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <DashboardGrids.Stats>
        <StatCard
          title="إجمالي الفواتير"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.totalInvoices}
          icon={TrendingUp}
          color="bg-[#155446]"
          subtitle="جميع الفواتير"
        />
        <StatCard
          title="إجمالي الزبائن"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.totalCustomers}
          icon={TrendingUp}
          color="bg-[#C69A72]"
          subtitle="زبائن مسجلون"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          color="bg-[#13312A]"
          subtitle="جميع المدفوعات"
        />
        <StatCard
          title="فواتير اليوم"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.todayInvoices}
          icon={TrendingUp}
          color="bg-[#155446]"
          subtitle="فواتير جديدة اليوم"
        />
      </DashboardGrids.Stats>

      {/* Revenue Breakdown */}
      <DashboardGrids.Revenue>
        <StatCard
          title="إيرادات اليوم"
          value={isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats.dailyRevenue)}
          icon={TrendingUp}
          color="bg-green-600"
          subtitle="إيرادات اليوم"
        />
        <StatCard
          title="إيرادات الأسبوع"
          value={isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats.weeklyRevenue)}
          icon={TrendingUp}
          color="bg-blue-600"
          subtitle="آخر 7 أيام"
        />
        <StatCard
          title="إيرادات الشهر"
          value={isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          color="bg-purple-600"
          subtitle="آخر 30 يوم"
        />
      </DashboardGrids.Revenue>

      {/* Invoice Status Breakdown */}
      <DashboardGrids.Status>
        <StatCard
          title="فواتير معلقة"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.pendingInvoices}
          icon={TrendingUp}
          color="bg-yellow-600"
          subtitle="في انتظار الدفع"
        />
        <StatCard
          title="فواتير مدفوعة"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.paidInvoices}
          icon={TrendingUp}
          color="bg-green-600"
          subtitle="مدفوعة بالكامل"
        />
        <StatCard
          title="فواتير جزئية"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stats.partialInvoices}
          icon={TrendingUp}
          color="bg-blue-600"
          subtitle="مدفوعة جزئياً"
        />
      </DashboardGrids.Status>

      {/* Quick Actions */}
      <QuickActions 
        onCreateInvoice={onCreateInvoice} 
        onNavigate={onNavigate} 
      />

      {/* Recent Activities */}
      <RecentActivities
        recentInvoices={stats.recentInvoices}
        recentCustomers={stats.recentCustomers}
        upcomingDeliveries={stats.upcomingDeliveries}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}