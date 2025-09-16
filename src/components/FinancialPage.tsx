import React from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp, FileText, DollarSign, Users } from 'lucide-react';

export function FinancialPage() {
  const stats = [
    { label: 'إجمالي المبيعات', value: '15,750 دينار عراقي', icon: TrendingUp, color: 'bg-[#155446]' },
    { label: 'طلبات اليوم', value: '12', icon: FileText, color: 'bg-[#C69A72]' },
    { label: 'الأرباح', value: '1,200 دينار عراقي', icon: DollarSign, color: 'bg-[#13312A]' },
    { label: 'عدد الزبائن', value: '156', icon: Users, color: 'bg-[#155446]' }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl text-center text-[#13312A] arabic-text">المالية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-[#C69A72]">
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
    </div>
  );
}
