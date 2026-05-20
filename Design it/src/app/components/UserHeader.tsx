import { Link } from 'react-router';
import { Search, Menu } from 'lucide-react';

export function UserHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#C8954A] heading">
            BALLANDBEEHOME
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm hover:text-[#C8954A] transition-colors">
              Trang chủ
            </Link>
            <Link to="/products" className="text-sm hover:text-[#C8954A] transition-colors">
              Sản phẩm
            </Link>
            <Link to="/blog" className="text-sm hover:text-[#C8954A] transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-sm hover:text-[#C8954A] transition-colors">
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
