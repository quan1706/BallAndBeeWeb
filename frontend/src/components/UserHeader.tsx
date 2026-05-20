'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, ChevronRight, Phone, User, Heart, ShoppingCart } from 'lucide-react';
import { useCategories, useSettings } from '@/lib/api';

export function UserHeader() {
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const companyName = settings?.name || "BALL & BEE";

  const formatLogo = (name: string) => {
    if (name.includes('&')) {
      const parts = name.split('&');
      return (
        <>
          {parts[0]}<span className="text-[#C8954A]">&</span>{parts[1]}
        </>
      );
    }
    return name;
  };
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);

  // Logic Smart Sticky Header (Ẩn khi cuộn xuống, hiện khi cuộn lên)
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 80) {
        // Luôn hiện header khi ở sát đỉnh trang
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Cuộn xuống -> Ẩn header
        setShowHeader(false);
      } else {
        // Cuộn lên -> Hiện header
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lấy các danh mục cấp 1 (root)
  const rootCategories = categories.filter((c) => c.parentId === null);

  // Tìm các danh mục con (cấp 2)
  const getSubcategories = (catId: number) => {
    return categories.filter((c) => c.parentId === catId);
  };

  // Tìm các danh mục cháu (cấp 3)
  const getGrandchildren = (subId: number) => {
    return categories.filter((c) => c.parentId === subId);
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-white border-b border-[#E8E0D5]/80 shadow-sm transition-transform duration-300 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* TIER 1: UPPER HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-8">
        {/* Left: Luxury Logo moved to the left */}
        <div className="flex items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-[0.2em] font-serif uppercase hover:opacity-95 transition-opacity whitespace-nowrap">
            {formatLogo(companyName)}
          </Link>
        </div>

        {/* Center: Search Box (Pill rounded search bar) */}
        <div className="hidden md:block relative w-96 max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-[11px] outline-none focus:bg-white focus:border-[#C8954A] focus:ring-1 focus:ring-[#C8954A] transition-all font-semibold tracking-wide text-gray-700"
          />
        </div>

        {/* Right: Elegant Actions (Icons with text underneath - Shopping Cart removed) */}
        <div className="flex items-center gap-6">
          <Link href="/contact" className="flex flex-col items-center gap-1 group text-gray-500 hover:text-[#C8954A] transition-all cursor-pointer">
            <Phone className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">Liên hệ</span>
          </Link>
          
          <Link href="/admin" className="flex flex-col items-center gap-1 group text-gray-500 hover:text-[#C8954A] transition-all cursor-pointer">
            <User className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">Tài khoản</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center gap-1 group text-gray-500 hover:text-[#C8954A] transition-all relative cursor-pointer">
            <div className="relative">
              <Heart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#1E3A5F] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                1
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">Yêu thích</span>
          </Link>

          {/* Hamburger Menu on Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-[#FAF7F2] rounded-lg transition-colors text-[#1E3A5F] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* TIER 2: LOWER NAVIGATION BAR (Horizontal categories & hover mega menu) */}
      <div className="hidden md:block border-t border-[#E8E0D5]/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav 
            className="flex items-center justify-center gap-6 lg:gap-8 h-11 relative"
            onMouseLeave={() => setHoveredCat(null)}
          >
            {!isProductPage ? (
              <>
                {/* 1. Trang chủ */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/"
                    className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest py-3 relative transition-colors ${
                      pathname === '/' ? 'text-[#C8954A]' : 'text-[#1E3A5F] hover:text-[#C8954A]'
                    }`}
                  >
                    Trang chủ
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] transition-transform origin-center duration-300 ${
                      pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                </div>

                {/* 2. Sản phẩm */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/products"
                    className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest py-3 relative transition-colors ${
                      pathname?.startsWith('/products') ? 'text-[#C8954A]' : 'text-[#1E3A5F] hover:text-[#C8954A]'
                    }`}
                  >
                    Sản phẩm
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] transition-transform origin-center duration-300 ${
                      pathname?.startsWith('/products') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                </div>

                {/* 3. Blog */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/blog"
                    className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest py-3 relative transition-colors ${
                      pathname?.startsWith('/blog') ? 'text-[#C8954A]' : 'text-[#1E3A5F] hover:text-[#C8954A]'
                    }`}
                  >
                    Blog
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] transition-transform origin-center duration-300 ${
                      pathname?.startsWith('/blog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* 1. Trang chủ */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/"
                    className="text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#1E3A5F] hover:text-[#C8954A] transition-colors py-3 relative"
                  >
                    Trang chủ
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                  </Link>
                </div>

                {/* 2. Mới */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/products?sort=newest"
                    className="text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#C8954A] hover:opacity-90 transition-colors py-3 relative"
                  >
                    MỚI
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                  </Link>
                </div>

                {/* Các danh mục Root động */}
                {rootCategories.map((cat) => {
                  const subCats = getSubcategories(cat.id);
                  const hasSub = subCats.length > 0;

                  return (
                    <div
                      key={cat.id}
                      className="group h-full flex items-center"
                      onMouseEnter={() => {
                        if (hasSub) setHoveredCat(cat.id);
                        else setHoveredCat(null);
                      }}
                    >
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest py-3 relative transition-colors cursor-pointer ${
                          hoveredCat === cat.id ? 'text-[#C8954A]' : 'text-[#1E3A5F] hover:text-[#C8954A]'
                        }`}
                      >
                        {cat.name}
                        <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] transition-transform origin-center duration-300 ${
                          hoveredCat === cat.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`} />
                      </Link>

                      {/* Mega Menu panel của từng danh mục */}
                      {hasSub && hoveredCat === cat.id && (
                        <div className="absolute top-11 left-0 right-0 w-full bg-white border-b border-[#E8E0D5]/60 shadow-2xl py-8 z-50 animate-fade-in">
                          <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
                            {subCats.map((sub) => {
                              const grandChildren = getGrandchildren(sub.id);
                              return (
                                <div key={sub.id} className="space-y-3">
                                  <Link
                                    href={`/products?category=${sub.slug}`}
                                    className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider hover:text-[#C8954A] transition-colors block border-b border-[#E8E0D5]/30 pb-2 font-serif"
                                  >
                                    {sub.name}
                                  </Link>
                                  {grandChildren.length > 0 && (
                                    <div className="space-y-1.5 pl-1">
                                      {grandChildren.map((grand) => (
                                        <Link
                                          key={grand.id}
                                          href={`/products?category=${grand.slug}`}
                                          className="block text-[11px] text-[#666666] hover:text-[#C8954A] hover:pl-1 transition-all font-semibold"
                                        >
                                          {grand.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 3. Blog */}
                <div className="group relative h-full flex items-center">
                  <Link
                    href="/blog"
                    className="text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#1E3A5F] hover:text-[#C8954A] transition-colors py-3 relative"
                  >
                    Blog
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8954A] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Open State */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E0D5] bg-white p-4 space-y-4 animate-fade-in shadow-inner max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs outline-none focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#1E3A5F] hover:bg-[#FAF7F2]"
            >
              Trang chủ
            </Link>
            
            <Link
              href="/products?sort=newest"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#C8954A] hover:bg-[#FAF7F2]"
            >
              MỚI
            </Link>

            {/* Mobile Categories Accordion-style */}
            <div className="border-t border-b border-gray-100 py-2 my-2 space-y-2">
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Danh mục sản phẩm</p>
              {rootCategories.map((cat) => {
                const subs = getSubcategories(cat.id);
                return (
                  <div key={cat.id} className="pl-3 space-y-1">
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 text-xs font-bold text-[#1E3A5F] hover:text-[#C8954A]"
                    >
                      {cat.name}
                    </Link>
                    {subs.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/products?category=${sub.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block pl-3 py-0.5 text-[11px] text-gray-500 hover:text-[#C8954A] font-semibold"
                      >
                        — {sub.name}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>

            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#1E3A5F] hover:bg-[#FAF7F2]"
            >
              Blog
            </Link>
            
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#1E3A5F] hover:bg-[#FAF7F2]"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
