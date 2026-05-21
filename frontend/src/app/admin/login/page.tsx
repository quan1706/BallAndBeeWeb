'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        let message = error.message;
        if (message === 'Invalid login credentials') {
          message = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
        } else if (message === 'Email not confirmed') {
          message = 'Email tài khoản của bạn chưa được xác nhận trên hệ thống.';
        }
        setErrorMsg(message);
      } else {
        if (data.session) {
          localStorage.setItem('adminToken', data.session.access_token);
        }
        router.push('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E8E0D5]/50">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-[#C8954A] heading mb-2">BallAndBee'sHome</div>
            <h2 className="heading text-2xl text-[#1E3A5F] mb-1">Đăng nhập quản trị</h2>
            <p className="text-sm text-[#E07B54]">Chỉ dành cho quản trị viên</p>
          </div>

          <div className="border-t border-[#E8E0D5] my-6" />

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-red-700">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="ballandbee@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#C8954A] cursor-pointer disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] disabled:bg-[#C8954A]/60 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-[#888888] hover:text-[#C8954A] transition-colors">
                Quên mật khẩu?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

