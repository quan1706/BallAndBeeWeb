'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { useCategoriesFlat, useProducts } from '@/lib/api';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Gọi APIs lấy dữ liệu trực tiếp qua React Query
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesFlat();

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Đọc tham số danh mục và tìm kiếm từ URL
  const categoryQuery = searchParams ? searchParams.get('category') : null;
  const searchQueryParam = searchParams ? searchParams.get('search') : null;

  // State bộ lọc
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);


  // Cập nhật danh mục được chọn khi URL query thay đổi
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCatSlug(categoryQuery);
    } else {
      setSelectedCatSlug('all');
    }
  }, [categoryQuery]);

  // Cập nhật từ khóa tìm kiếm khi URL query thay đổi
  useEffect(() => {
    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
    } else {
      setSearchQuery('');
    }
  }, [searchQueryParam]);

  // Hàm đệ quy kiểm tra xem sản phẩm có thuộc danh mục này hoặc bất kỳ danh mục con nào của nó không
  const isProductInCategory = (productCatSlug: string, targetCatSlug: string): boolean => {
    if (targetCatSlug === 'all') return true;
    if (productCatSlug === targetCatSlug) return true;

    // Tìm danh mục mục tiêu
    const targetCat = categories.find((c) => c.slug === targetCatSlug);
    if (!targetCat) return false;

    // Tìm tất cả danh mục con của danh mục mục tiêu
    const getChildrenIds = (catId: number): number[] => {
      const childs = categories.filter((c) => c.parentId === catId);
      return childs.reduce((acc, curr) => {
        return [...acc, curr.id, ...getChildrenIds(curr.id)];
      }, [] as number[]);
    };

    const targetAndChildrenIds = [targetCat.id, ...getChildrenIds(targetCat.id)];
    const productCat = categories.find((c) => c.slug === productCatSlug);

    return productCat ? targetAndChildrenIds.includes(productCat.id) : false;
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    // 1. Lọc theo danh mục
    const matchCategory = isProductInCategory(product.categorySlug, selectedCatSlug);

    // 2. Lọc theo giá
    const matchPrice = product.price >= minPrice && product.price <= maxPrice;

    // 3. Lọc theo xuất xứ
    const matchOrigin =
      selectedOrigins.length === 0 || selectedOrigins.includes(product.origin);

    // 4. Lọc theo tags
    const matchTags =
      selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag));

    // 5. Lọc theo tìm kiếm
    const matchSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchPrice && matchOrigin && matchTags && matchSearch;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return b.isNew ? 1 : -1;
    return b.featured ? 1 : -1; // Mặc định nổi bật (featured)
  });

  const handleResetFilters = () => {
    setSelectedCatSlug('all');
    setMinPrice(0);
    setMaxPrice(5000000);
    setSelectedOrigins([]);
    setSelectedTags([]);
    setSearchQuery('');
    setSortBy('featured');
    router.push('/products');
  };

  // Tìm danh mục hiện tại đang chọn
  const activeCat = categories.find((c) => c.slug === selectedCatSlug);

  // Hàm lấy đường dẫn danh mục từ gốc đến danh mục hiện tại
  const getCategoryPath = (catSlug: string): any[] => {
    const path: any[] = [];
    let current = categories.find((c) => c.slug === catSlug);
    while (current) {
      path.unshift(current);
      if (current.parentId !== null) {
        const parentId = current.parentId;
        current = categories.find((c) => c.id === parentId);
      } else {
        break;
      }
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Breadcrumbs & Title gộp chung tinh tế */}
        <div className="mb-4 pb-3 sm:mb-6 sm:pb-4 border-b border-[#E8E0D5]/20">
          <nav className="text-xs text-[#888888] font-semibold mb-1 sm:mb-2">
            <Link href="/" className="hover:text-[#C8954A] transition-colors">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1E3A5F]">Sản phẩm</span>
            {activeCat && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#C8954A]">{activeCat.name}</span>
              </>
            )}
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-1.5">
            <h1 className="text-lg sm:text-2xl font-bold text-[#1E3A5F] font-serif leading-tight">
              {activeCat ? activeCat.name : 'Bộ sưu tập sản phẩm'}
            </h1>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              {/* Select Sắp xếp nhỏ gọn, tinh giản */}
              <div className="flex items-center gap-1.5 flex-1 md:flex-initial">
                <span className="text-xs text-gray-400 font-semibold hidden md:inline">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-auto px-2.5 py-1.5 rounded-lg border border-[#E8E0D5] text-xs text-[#1E3A5F] font-bold focus:border-[#C8954A] outline-none bg-white cursor-pointer hover:border-[#C8954A] transition-colors"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="price-asc">Giá tăng</option>
                  <option value="price-desc">Giá giảm</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden flex items-center justify-center gap-1.5 flex-1 px-3 py-1.5 border border-[#E8E0D5] rounded-lg hover:bg-white transition-colors font-bold text-xs text-[#1E3A5F] cursor-pointer bg-white shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8954A]" /> Bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Category Chips */}
        {categories.length > 0 && (
          <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2 scroll-smooth select-none">
            {/* Chip "Quay lại" nếu đang chọn danh mục con */}
            {selectedCatSlug !== 'all' && activeCat && (
              <button
                onClick={() => {
                  const parentCat = activeCat.parentId !== null 
                    ? categories.find((c) => c.id === activeCat.parentId) 
                    : null;
                  if (parentCat) {
                    setSelectedCatSlug(parentCat.slug);
                    router.push(`/products?category=${parentCat.slug}`);
                  } else {
                    setSelectedCatSlug('all');
                    router.push('/products');
                  }
                }}
                className="flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-gray-500 border border-gray-200 hover:border-[#C8954A] hover:text-[#C8954A] active:scale-95 transition-all whitespace-nowrap shadow-sm"
              >
                ← Quay lại
              </button>
            )}

            {/* Chip "Tất cả" - Chỉ hiện khi đang ở trang gốc */}
            {selectedCatSlug === 'all' && (
              <button
                onClick={() => {
                  setSelectedCatSlug('all');
                  router.push('/products');
                }}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-[#C8954A] text-white transition-all whitespace-nowrap shadow-sm border border-[#C8954A]"
              >
                Tất cả
              </button>
            )}

            {/* Chip danh mục hiện tại (đang active) */}
            {selectedCatSlug !== 'all' && activeCat && (
              <button
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-[#C8954A] text-white transition-all whitespace-nowrap shadow-sm border border-[#C8954A]"
              >
                {activeCat.name}
              </button>
            )}

            {/* Danh sách các danh mục con hoặc cùng cấp hiển thị dưới dạng tag gợi ý */}
            {(() => {
              let chipsToShow: any[] = [];
              if (selectedCatSlug === 'all') {
                chipsToShow = categories.filter((c) => c.parentId === null);
              } else if (activeCat) {
                const children = categories.filter((c) => c.parentId === activeCat.id);
                if (children.length > 0) {
                  chipsToShow = children;
                } else {
                  chipsToShow = categories.filter((c) => c.parentId === activeCat.parentId && c.id !== activeCat.id);
                }
              }
              return chipsToShow.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCatSlug(cat.slug);
                    router.push(`/products?category=${cat.slug}`);
                  }}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#1E3A5F] border border-[#E8E0D5]/60 hover:border-[#C8954A] hover:text-[#C8954A] active:scale-95 transition-all whitespace-nowrap shadow-sm"
                >
                  {cat.name}
                </button>
              ));
            })()}
          </div>
        )}

        {/* Backdrop mờ phía sau cho Mobile Drawer */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[#030213]/40 backdrop-blur-[2px] z-40 transition-opacity lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR BỘ LỌC (Left Sidebar / Right Drawer trên Mobile) */}
          <div
            className={`bg-white transition-all duration-300 ease-in-out space-y-6 
              lg:col-span-1 lg:block lg:sticky lg:top-24 lg:self-start lg:translate-x-0 lg:p-6 lg:border lg:border-[#E8E0D5]/40 lg:rounded-2xl lg:shadow-sm lg:z-0 lg:w-auto lg:h-auto lg:overflow-y-visible lg:shadow-none
              fixed top-0 right-0 h-full w-[290px] sm:w-[320px] max-w-[85vw] z-50 shadow-2xl p-6 overflow-y-auto
              ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:block hidden'}
            `}
          >
            {/* Header Sidebar Mobile */}
            <div className="flex items-center justify-between lg:hidden pb-4 border-b border-[#E8E0D5]">
              <h3 className="font-bold text-[#1E3A5F] text-base font-serif">Bộ lọc tìm kiếm</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="px-3 py-1.5 bg-[#C8954A]/10 text-[#C8954A] rounded-xl text-xs font-bold hover:bg-[#C8954A]/20 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Bộ lọc: Tìm kiếm */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm trong danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E8E0D5] rounded-xl text-sm focus:ring-1 focus:ring-[#C8954A] focus:border-[#C8954A] outline-none bg-[#FAF7F2]/30 transition-all font-semibold"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Bộ lọc: Danh mục (chỉ hiện khi đã chọn danh mục cụ thể) */}
            {selectedCatSlug !== 'all' && activeCat && (
              <div>
                <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider mb-3">
                  Danh mục
                </h3>
                <div className="space-y-1">
                  <div className="space-y-2">
                    {/* Nút quay lại cấp cha trực tiếp */}
                    {(() => {
                      const parentCat = activeCat.parentId !== null 
                        ? categories.find((c) => c.id === activeCat.parentId) 
                        : null;
                      
                      return (
                        <button
                          onClick={() => {
                            if (parentCat) {
                              setSelectedCatSlug(parentCat.slug);
                              router.push(`/products?category=${parentCat.slug}`);
                            } else {
                              setSelectedCatSlug('all');
                              router.push('/products');
                            }
                          }}
                          className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-[#C8954A] font-bold pb-1 transition-colors cursor-pointer select-none uppercase tracking-wider"
                        >
                          ← {parentCat ? parentCat.name : 'Tất cả sản phẩm'}
                        </button>
                      );
                    })()}

                    {/* Chỉ hiển thị các danh mục con trực tiếp của danh mục hiện tại */}
                    {(() => {
                      const directChildren = categories.filter((c) => c.parentId === activeCat.id);
                      if (directChildren.length > 0) {
                        return (
                          <div className="space-y-1.5">
                            {directChildren.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => {
                                  setSelectedCatSlug(child.slug);
                                  router.push(`/products?category=${child.slug}`);
                                }}
                                className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-[#1E3A5F] hover:bg-[#FAF7F2] hover:text-[#C8954A] transition-all cursor-pointer flex items-center justify-between group bg-white border border-[#E8E0D5]/35 hover:border-[#C8954A]/30 shadow-sm"
                              >
                                <span className="truncate">{child.name}</span>
                                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-[#C8954A] transition-transform duration-200" />
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p className="text-[10px] text-gray-400 italic font-semibold select-none pt-1">
                          Đang ở danh mục cuối
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Bộ lọc: Khoảng giá */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider mb-4">
                Khoảng giá
              </h3>
              <div className="space-y-4">
                {/* Hai ô nhập min - max */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-semibold">đ</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice || 0}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-[#1E3A5F] focus:border-[#C8954A] outline-none font-semibold bg-gray-50/50"
                    />
                  </div>
                  <span className="text-gray-400 text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-semibold">đ</span>
                    <input
                      type="number"
                      placeholder="500000"
                      value={maxPrice || 5000000}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-[#1E3A5F] focus:border-[#C8954A] outline-none font-semibold bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Thanh trượt giá */}
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C8954A] border border-gray-200"
                />

                {/* Pills lọc nhanh */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: 'Dưới 200k', min: 0, max: 200000 },
                    { label: '200k-500k', min: 200000, max: 500000 },
                    { label: '500k-1tr', min: 500000, max: 1000000 },
                    { label: 'Trên 1tr', min: 1000000, max: 5000000 },
                  ].map((btn) => {
                    const isActive = minPrice === btn.min && maxPrice === btn.max;
                    return (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => {
                          setMinPrice(btn.min);
                          setMaxPrice(btn.max);
                        }}
                        className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${
                          isActive
                            ? 'bg-[#C8954A]/10 border-[#C8954A] text-[#C8954A]'
                            : 'border-gray-200 text-gray-600 bg-white hover:border-[#C8954A] hover:text-[#C8954A]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bộ lọc: Tags (Thiết kế y hệt ảnh) */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'vintage', label: '#vintage', count: 8 },
                  { name: 'handmade', label: '#handmade', count: 9 },
                  { name: 'ceramic', label: '#ceramic', count: 8 },
                  { name: 'bamboo', label: '#bamboo', count: 7 },
                  { name: 'eco', label: '#eco', count: 4 },
                  { name: 'minimalist', label: '#minimalist', count: 11 },
                ].map((tag) => {
                  const isChecked = selectedTags.includes(tag.name);
                  return (
                    <label
                      key={tag.name}
                      className="flex items-center justify-between text-sm text-gray-600 font-semibold cursor-pointer select-none hover:text-[#C8954A]"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag.name)
                                ? prev.filter((t) => t !== tag.name)
                                : [...prev, tag.name]
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#C8954A] focus:ring-[#C8954A]/30 cursor-pointer accent-[#C8954A]"
                        />
                        <span>{tag.label}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-normal">({tag.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bộ lọc: Xuất xứ */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider mb-3">
                Xuất xứ
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Việt Nam', count: 86 },
                  { name: 'Nhật Bản', count: 18 },
                  { name: 'Hàn Quốc', count: 12 },
                  { name: 'Thái Lan', count: 8 },
                ].map((orig) => {
                  const isChecked = selectedOrigins.includes(orig.name);
                  return (
                    <label
                      key={orig.name}
                      className="flex items-center justify-between text-sm text-gray-600 font-semibold cursor-pointer select-none hover:text-[#C8954A]"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedOrigins((prev) =>
                              prev.includes(orig.name)
                                ? prev.filter((o) => o !== orig.name)
                                : [...prev, orig.name]
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#C8954A] focus:ring-[#C8954A]/30 cursor-pointer accent-[#C8954A]"
                        />
                        <span>{orig.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-normal">({orig.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Nút Xóa bộ lọc */}
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-[#C8954A] hover:text-[#C8954A] hover:bg-[#FAF7F2] font-semibold text-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
            </button>
          </div>

          {/* DANH SÁCH SẢN PHẨM (Right Column) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Grid Sản phẩm */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-2xl border border-[#E8E0D5]/35 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col h-full"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="aspect-square overflow-hidden relative bg-[#FAF7F2]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#C8954A] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 rounded shadow-sm">
                          Mới
                        </span>
                      )}
                      {product.featured && !product.isNew && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#E07B54] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 rounded shadow-sm">
                          Nổi bật
                        </span>
                      )}
                    </div>

                    {/* Nội dung thẻ */}
                    <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                      <div className="space-y-1">
                        {/* Đường dẫn danh mục */}
                        <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#888888] truncate">
                          {product.category} {product.subcategory ? `> ${product.subcategory}` : ''}
                        </p>
                        {/* Tên sản phẩm */}
                        <h3 className="font-serif text-[#1E3A5F] text-xs sm:text-base lg:text-lg font-bold group-hover:text-[#C8954A] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {/* Tag Capsules */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-[#C8954A]/30 text-[#C8954A] bg-[#C8954A]/5 px-1.5 py-0.5 sm:px-2.5 rounded-full text-[8px] sm:text-[10px] font-semibold tracking-wide"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Xem chi tiết & Giá */}
                      <div className="pt-2 sm:pt-3.5 flex items-center justify-between border-t border-[#FAF7F2]/80 mt-3 sm:mt-4">
                        <p className="text-[9px] sm:text-xs font-semibold text-[#C8954A] flex items-center gap-1 hover:text-[#B8854A] transition-colors">
                          Xem chi tiết <span className="font-serif">→</span>
                        </p>
                        <span className="text-[11px] sm:text-sm font-serif font-bold text-[#D45B2E]">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8E0D5]/40 py-16 px-6 text-center text-gray-500">
                <RotateCcw className="w-12 h-12 text-[#E8E0D5] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">Không tìm thấy sản phẩm</h3>
                <p className="text-sm max-w-md mx-auto">
                  Không có sản phẩm nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng bấm "Xóa bộ lọc" để xem toàn bộ sản phẩm.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-2 bg-[#C8954A] text-white rounded-xl hover:bg-[#B8854A] font-semibold text-sm transition-all cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-lg font-semibold text-[#1E3A5F] animate-pulse">Đang tải sản phẩm...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
