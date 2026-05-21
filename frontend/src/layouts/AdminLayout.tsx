import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Package, FolderTree, FileText, Settings, LogOut, Bell } from 'lucide-react';
import { useEffect } from 'react';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: FolderTree, label: 'Danh mục' },
    { path: '/admin/blog', icon: FileText, label: 'Blog' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
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
                to={item.path}
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
            <button onClick={handleLogout} className="p-1 hover:bg-white/10 rounded">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E8E0D5] px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1E3A5F]">
            {location.pathname === '/admin' && 'Tổng quan'}
            {location.pathname.startsWith('/admin/products') && 'Quản lý sản phẩm'}
            {location.pathname.startsWith('/admin/categories') && 'Quản lý danh mục'}
            {location.pathname.startsWith('/admin/blog') && 'Quản lý Blog'}
            {location.pathname.startsWith('/admin/settings') && 'Cài đặt'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#888888]">{new Date().toLocaleDateString('vi-VN')}</span>
            <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#C8954A] flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
