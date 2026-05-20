'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminToken', 'demo-token-' + Date.now());
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E8E0D5]/50">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-[#C8954A] heading mb-2">BALLANDBEEHOME</div>
            <h2 className="heading text-2xl text-[#1E3A5F] mb-1">Đăng nhập quản trị</h2>
            <p className="text-sm text-[#E07B54]">Chỉ dành cho quản trị viên</p>
          </div>

          <div className="border-t border-[#E8E0D5] my-6" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="admin@ballandbeehome.com"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#C8954A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] transition-colors font-semibold cursor-pointer"
            >
              Đăng nhập
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
