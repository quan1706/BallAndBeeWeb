'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, FolderTree, FileText, Settings, LogOut, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          router.push('/admin/login');
        } else {
          localStorage.setItem('adminToken', session.access_token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        router.push('/admin/login');
      } else if (session) {
        localStorage.setItem('adminToken', session.access_token);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // Hiển thị màn hình chờ xác thực sang trọng đồng bộ thương hiệu
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030213] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#C8954A] border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-semibold tracking-widest text-[#C8954A] uppercase font-sans animate-pulse">
          Đang xác thực quyền truy cập...
        </div>
      </div>
    );
  }


  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: FolderTree, label: 'Danh mục' },
    { path: '/admin/blog', icon: FileText, label: 'Blog' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-gray-800">
      <aside className="w-60 bg-[#1E3A5F] text-white flex flex-col">
        <div className="p-6">
          <div className="text-lg font-bold text-[#C8954A] heading">BallAndBee'sHome</div>
          <div className="text-xs text-white/60 mt-1">Admin</div>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                  active
                    ? 'bg-[#C8954A]/10 text-[#C8954A] border-l-4 border-[#C8954A] -ml-3 pl-6'
                    : 'hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C8954A] flex items-center justify-center text-sm font-semibold">
              A
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Admin</div>
            </div>
            <button onClick={handleLogout} className="p-1 hover:bg-white/10 rounded cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E8E0D5] px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1E3A5F]">
            {pathname === '/admin' && 'Tổng quan'}
            {pathname.startsWith('/admin/products') && 'Quản lý sản phẩm'}
            {pathname.startsWith('/admin/categories') && 'Quản lý danh mục'}
            {pathname.startsWith('/admin/blog') && 'Quản lý Blog'}
            {pathname.startsWith('/admin/settings') && 'Cài đặt'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#888888]">{new Date().toLocaleDateString('vi-VN')}</span>
            <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#C8954A] flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
