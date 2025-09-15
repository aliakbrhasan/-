import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Scissors } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F6E9CA] to-[#C69A72]">
      <Card className="w-full max-w-md bg-[#F6E9CA] border-[#C69A72] shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#13312A] rounded-full flex items-center justify-center">
              <Scissors className="w-8 h-8 text-[#F6E9CA]" />
            </div>
          </div>
          <CardTitle className="text-2xl text-[#13312A] arabic-text">
            نظام خياطة قرطبة
          </CardTitle>
          <p className="text-[#155446] arabic-text">مرحباً بك، يرجى تسجيل الدخول</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#13312A] arabic-text">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                className="bg-white border-[#C69A72] focus:border-[#155446] text-right touch-target"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#13312A] arabic-text">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="bg-white border-[#C69A72] focus:border-[#155446] text-right touch-target"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-[#155446] data-[state=checked]:bg-[#155446]"
              />
              <Label htmlFor="remember" className="text-[#13312A] arabic-text cursor-pointer">
                تذكرني
              </Label>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#155446] hover:bg-[#13312A] text-[#F6E9CA] py-3 touch-target arabic-text transition-all duration-200 hover:shadow-lg"
            >
              تسجيل الدخول
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-[#155446] hover:text-[#13312A] arabic-text text-sm">
              نسيت كلمة المرور؟
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}