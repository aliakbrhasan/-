import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  BarChart, 
  TrendingUp, 
  Calendar,
  Clock,
  Wrench,
  Sparkles
} from 'lucide-react';

export function ReportsPage() {
  const upcomingFeatures = [
    {
      title: 'تقارير المبيعات',
      description: 'تقارير مفصلة عن المبيعات الشهرية والسنوية',
      icon: BarChart,
      estimatedDate: 'الربع الثاني 2026'
    },
    {
      title: 'تحليل الأداء',
      description: 'تحليل أداء العمل ومعدلات النمو',
      icon: TrendingUp,
      estimatedDate: 'الربع الثاني 2026'
    },
    {
      title: 'تقارير الزبائن',
      description: 'تحليل سلوك الزبائن وأنماط الشراء',
      icon: Calendar,
      estimatedDate: 'الربع الثالث 2026'
    },
    {
      title: 'تقارير المخزون',
      description: 'تتبع المخزون والأقمشة المتوفرة',
      icon: Clock,
      estimatedDate: 'الربع الثالث 2026'
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-[#13312A] rounded-full flex items-center justify-center">
            <Wrench className="w-12 h-12 text-[#F6E9CA]" />
          </div>
        </div>
        <h1 className="text-3xl text-[#13312A] arabic-text">التقارير</h1>
        <p className="text-xl text-[#155446] arabic-text">قريباً</p>
      </div>

      {/* Coming Soon Message */}
      <Card className="bg-gradient-to-br from-[#13312A] to-[#155446] border-[#C69A72] text-center">
        <CardContent className="p-8">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-[#F6E9CA]" />
          </div>
          <h2 className="text-2xl text-[#F6E9CA] arabic-text mb-4">
            نعمل على تطوير نظام التقارير
          </h2>
          <p className="text-[#C69A72] arabic-text text-lg mb-6">
            سيتضمن النظام تقارير شاملة ومفصلة لمساعدتك في إدارة المركز
          </p>
          <Button className="bg-[#C69A72] hover:bg-[#b8886a] text-[#13312A] px-8 py-3 touch-target">
            <span className="arabic-text">سيتم الإشعار عند الإطلاق</span>
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Features */}
      <div className="space-y-4">
        <h3 className="text-xl text-[#13312A] arabic-text text-center mb-6">الميزات القادمة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-white border-[#C69A72] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#155446] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#F6E9CA]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#13312A] arabic-text">{feature.title}</CardTitle>
                      <p className="text-sm text-[#155446] arabic-text">{feature.estimatedDate}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#155446] arabic-text">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-white border-[#C69A72]">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg text-[#13312A] arabic-text">تقدم التطوير</h3>
            <div className="w-full bg-[#C69A72] rounded-full h-4">
              <div className="bg-[#155446] h-4 rounded-full transition-all duration-300" style={{ width: '35%' }}></div>
            </div>
            <p className="text-[#155446] arabic-text">35% مكتمل</p>
            <p className="text-sm text-[#155446] arabic-text">
              الإطلاق المتوقع: الربع الثاني من عام 2026
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}