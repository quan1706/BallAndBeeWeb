'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories, useProducts, useBlogPosts, API_BASE_URL, Category, Product } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
  products: Product[];
}

function CategoryCard({ category, products }: CategoryCardProps) {
  // Lọc sản phẩm thuộc danh mục cha hoặc danh mục con của nó
  const subcategorySlugs = useMemo(() => {
    return category.subcategories?.map(sub => sub.slug) || [];
  }, [category]);

  const categoryProducts = useMemo(() => {
    return products.filter(
      p => p.categorySlug === category.slug || subcategorySlugs.includes(p.categorySlug)
    );
  }, [products, category, subcategorySlugs]);

  // Danh sách ảnh sản phẩm có sẵn
  const images = useMemo(() => {
    const urls = categoryProducts.map(p => p.image).filter(Boolean);
    return Array.from(new Set(urls));
  }, [categoryProducts]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Khoảng thời gian ngẫu nhiên từ 4s đến 7s cho mỗi card để tạo cảm giác tự nhiên, sinh động
    const randomInterval = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

    const timer = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setNextImageIndex(nextIndex);
      setIsFading(true);

      // Sau 700ms (thời gian fade-out), đổi ảnh chính và kết thúc fade
      const fadeTimeout = setTimeout(() => {
        setCurrentImageIndex(nextIndex);
        setNextImageIndex(null);
        setIsFading(false);
      }, 700);

      return () => clearTimeout(fadeTimeout);
    }, randomInterval);

    return () => clearInterval(timer);
  }, [images, currentImageIndex]);

  const primaryColor = category.color || '#C8954A';
  const hasImages = images.length > 0;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="relative group overflow-hidden rounded-xl aspect-[4/3] block snap-start flex-shrink-0 w-full md:w-[calc((100%-5*1.5rem)/6)] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#C8954A]/40 border border-transparent"
    >
      {/* 1. Background layer: Nếu không có ảnh, dùng Gradient màu thương hiệu */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, #030213 100%)`
        }}
      />

      {/* 2. Image layers cho slideshow (Cross-Fade) */}
      {hasImages && (
        <>
          {/* Ảnh hiện tại */}
          <img
            src={images[currentImageIndex]}
            alt={category.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out transition-transform duration-700 ease-out group-hover:scale-105 ${
              isFading ? 'opacity-0' : 'opacity-40 group-hover:opacity-50'
            }`}
          />
          {/* Ảnh tiếp theo (sẽ mờ dần hiện lên khi isFading = true) */}
          {nextImageIndex !== null && (
            <img
              src={images[nextImageIndex]}
              alt={category.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out transition-transform duration-700 ease-out group-hover:scale-105 ${
                isFading ? 'opacity-40 group-hover:opacity-50' : 'opacity-0'
              }`}
            />
          )}
        </>
      )}

      {/* 3. Overlay Gradient cao cấp để đảm bảo tính mỹ thuật và tương phản chữ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030213] via-[#030213]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

      {/* 4. Nội dung text */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-5 z-10">
        <h3 className="text-white text-[10px] sm:text-sm md:text-base font-semibold tracking-wide group-hover:text-[#C8954A] transition-colors duration-300 line-clamp-1">
          {category.name}
        </h3>
        {/* Subtitle nhỏ hiển thị số lượng sản phẩm để tăng sự chi tiết */}
        <p className="text-[8px] sm:text-[10px] text-white/60 mt-0.5 sm:mt-1 font-medium transition-colors group-hover:text-[#C8954A]/80">
          {categoryProducts.length} sản phẩm
        </p>
      </div>

      {/* 5. Border viền ánh kim khi hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8954A]/30 rounded-xl transition-all duration-500" />
    </Link>
  );
}

export default function HomePage() {
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories, 
    isError: isErrorCategories, 
    error: errorCategories 
  } = useCategories();

  const { 
    data: products = [], 
    isLoading: isLoadingProducts, 
    isError: isErrorProducts, 
    error: errorProducts 
  } = useProducts();

  const { 
    data: blogPosts = [], 
    isLoading: isLoadingBlogs, 
    isError: isErrorBlogs, 
    error: errorBlogs 
  } = useBlogPosts();

  useEffect(() => {
    console.log("=== BALL & BEE WEB CLIENT-SIDE DEBUG ===");
    console.log("API_BASE_URL hiện tại:", API_BASE_URL);
    console.log("process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Categories:", { length: categories.length, isLoadingCategories, isErrorCategories, errorCategories });
    console.log("Products (All):", { length: products.length, isLoadingProducts, isErrorProducts, errorProducts });
    console.log("BlogPosts:", { length: blogPosts.length, isLoadingBlogs, isErrorBlogs, errorBlogs });
    console.log("=========================================");
  }, [categories, products, blogPosts, isLoadingCategories, isLoadingProducts, isLoadingBlogs, isErrorCategories, isErrorProducts, isErrorBlogs, errorCategories, errorProducts, errorBlogs]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured).slice(0, 4);
  }, [products]);

  const featuredBlogs = blogPosts.filter((b) => b.featured).slice(0, 3);

  const isAnyError = isErrorCategories || isErrorProducts || isErrorBlogs;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {/* Debug Banner - Chỉ hiển thị khi dùng localhost trên Vercel hoặc khi xảy ra lỗi */}
      {isAnyError && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-sm">Không thể kết nối đến hệ thống máy chủ (Backend)!</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Đang cố gắng kết nối tới: <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-red-700 font-bold">{API_BASE_URL}</code>.
                  Vui lòng đảm bảo Backend Render đã hoạt động.
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl bg-[#030213]/40 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-white/10">
            <p className="text-[#C8954A] text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 font-semibold">
              Phong cách sống Việt
            </p>
            <h1 className="heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white mb-3 sm:mb-4 leading-tight font-extrabold">
              Không gian sống – Tinh tế từng chi tiết
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mb-5 sm:mb-6 leading-relaxed">
              Khám phá những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại,
              tạo nên không gian sống ấm cúng và đầy cảm hứng.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <Link
                href="/products"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20 text-xs sm:text-sm font-semibold text-center"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/contact"
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#030213] transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold text-center"
              >
                Về chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <h2 className="heading text-xl sm:text-3xl text-[#030213] font-bold">Danh mục sản phẩm</h2>
            {!isLoadingCategories && !isErrorCategories && categories.length > 0 && (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => handleScroll('left')}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#C8954A] flex items-center justify-center text-gray-500 hover:text-[#C8954A] hover:bg-[#FAF7F2] active:scale-95 transition-all cursor-pointer shadow-sm animate-fade-in"
                  title="Xem danh mục trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#C8954A] flex items-center justify-center text-gray-500 hover:text-[#C8954A] hover:bg-[#FAF7F2] active:scale-95 transition-all cursor-pointer shadow-sm animate-fade-in"
                  title="Xem danh mục tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-3 gap-3 md:flex md:overflow-hidden md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[4/3] w-full md:w-[calc((100%-5*1.5rem)/6)] flex-shrink-0" />
              ))}
            </div>
          ) : isErrorCategories ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Không thể tải danh mục sản phẩm lúc này</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">Chưa có danh mục sản phẩm nào.</p>
            </div>
          ) : (
            <>
              {/* CSS ẩn thanh cuộn scrollbar trên các trình duyệt */}
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div
                ref={scrollContainerRef}
                className="grid grid-cols-3 gap-3 md:flex md:overflow-x-auto md:gap-6 pb-2 pt-1 md:pb-6 md:pt-2 md:scroll-smooth md:snap-x md:snap-mandatory no-scrollbar select-none"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {categories.filter(c => c.parentId === null).map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    products={products}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading text-3xl text-[#030213] font-bold">Sản phẩm nổi bật</h2>
            <Link
              href="/products"
              className="text-[#C8954A] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden h-[380px]" />
              ))}
            </div>
          ) : isErrorProducts ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Không thể tải danh sách sản phẩm nổi bật</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl text-gray-500">
              <p className="text-sm">Hiện chưa có sản phẩm nổi bật nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 block border border-gray-100"
                >
                  <div className="aspect-square overflow-hidden relative bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-[#E07B54] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#717182] uppercase tracking-wider mb-1 font-medium">{product.category}</p>
                    <h3 className="font-semibold text-[#030213] mb-2 group-hover:text-[#C8954A] transition-colors duration-300 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#C8954A] font-bold text-sm">
                        {product.price.toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-xs text-[#717182] flex items-center gap-1 group-hover:text-[#C8954A] transition-colors">
                        Chi tiết <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading text-3xl text-center text-[#030213] mb-12 font-bold">
            Cảm hứng & Phong cách sống
          </h2>

          {isLoadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden h-[320px]" />
              ))}
            </div>
          ) : isErrorBlogs ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Không thể tải các bài viết cảm hứng</p>
            </div>
          ) : featuredBlogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">Chưa có bài viết nổi bật nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block border border-gray-100"
                >
                  <div className="aspect-video overflow-hidden bg-gray-50">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block bg-[#E07B54] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                      {post.topic}
                    </span>
                    <h3 className="heading text-lg text-[#030213] mb-2 group-hover:text-[#C8954A] transition-colors duration-300 line-clamp-1 font-semibold">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#717182] mb-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <p className="text-xs text-[#717182] font-medium">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="border-l-4 border-[#C8954A] pl-6">
              <h2 className="heading text-3xl text-[#030213] mb-4 font-bold">Về BallAndBee'sHome</h2>
              <p className="text-[#717182] leading-relaxed mb-6">
                Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt
                hiện đại. Mỗi sản phẩm đều được chọn lọc kỹ lưỡng, kết hợp giữa chất lượng cao cấp và
                thiết kế tinh tế, mang đến không gian sống ấm cúng và đầy cảm hứng cho mọi gia đình.
              </p>
              <Link href="/contact" className="text-[#C8954A] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"
                alt="About"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
