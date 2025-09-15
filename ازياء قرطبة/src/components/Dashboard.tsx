import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Scissors, 
  Ruler, 
  FileText, 
  Receipt, 
  Users, 
  TrendingUp,
  Calendar,
  Bell,
  Package
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {

  const quickActions = [
    { label: 'طلب جديد', icon: FileText, action: () => onNavigate('orders'), color: 'bg-[#155446]' },
    { label: 'فاتورة جديدة', icon: Receipt, action: () => onNavigate('invoices'), color: 'bg-[#C69A72]' },
    { label: 'زبون جديد', icon: Users, action: () => onNavigate('customers'), color: 'bg-[#13312A]' },
  ];
  
  const stats = [
    { label: 'الطلبات الجديدة', value: '12', icon: FileText, color: 'bg-[#155446]' },
    { label: 'الفواتير المعلقة', value: '8', icon: Receipt, color: 'bg-[#C69A72]' },
    { label: 'إجمالي الزبائن', value: '156', icon: Users, color: 'bg-[#13312A]' },
    { label: 'المبيعات اليوم', value: '2,450 دينار عراقي', icon: TrendingUp, color: 'bg-[#155446]' },
  ];

  
  const upcomingTasks = [
    { client: 'أحمد محمد', task: 'تسليم دشداشة', date: 'اليوم', priority: 'عالي' },
    { client: 'سارة علي', task: 'اقترب موعد التسليم', date: 'بعد 4 ايام', priority: 'متوسط' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#13312A] arabic-text mb-2">أهلاً وسهلاً</h1>
          <p className="text-[#155446] arabic-text">نظرة عامة على المبيعات اليوم</p>
        </div>
        <Button className="bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] touch-target">
          <Bell className="w-4 h-4 ml-2" />
          <span className="arabic-text">الإشعارات</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            
            <Card key={index} className="bg-white border-[#C69A72] hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center p-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center ml-4`}>
                  <Icon className="w-6 h-6 text-[#F6E9CA]" />
                </div>
                <div>
                  <p className="text-2xl text-[#13312A] mb-1">{stat.value}</p>
                  <p className="text-sm text-[#155446] arabic-text">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-[#C69A72]">
        <CardHeader>
          <CardTitle className="text-[#13312A] arabic-text flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} hover:opacity-90 text-[#F6E9CA] p-6 h-auto flex flex-col items-center gap-3 touch-target transition-all`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="arabic-text">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks and Tailor Icons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-white border-[#C69A72]">
          <CardHeader>
            <CardTitle className="text-[#13312A] arabic-text flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              المهام القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F6E9CA] rounded-lg border border-[#C69A72]">
                  <div>
                    <p className="text-[#13312A] arabic-text">{task.client}</p>
                    <p className="text-sm text-[#155446] arabic-text">{task.task}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[#13312A] arabic-text">{task.date}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'عالي' ? 'bg-red-100 text-red-800' :
                      task.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}