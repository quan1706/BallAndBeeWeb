'use client';

import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCategories, useProducts, useBlogPosts } from '@/lib/api';

export default function HomePage() {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts({ featured: true });
  const { data: blogPosts = [], isLoading: isLoadingBlogs } = useBlogPosts();

  const featuredProducts = products.slice(0, 4);
  const featuredBlogs = blogPosts.filter((b) => b.featured).slice(0, 3);

  const isLoading = isLoadingCategories || isLoadingProducts || isLoadingBlogs;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl bg-[#030213]/40 backdrop-blur-md p-8 rounded-xl border border-white/10">
            <p className="text-[#C8954A] text-xs uppercase tracking-widest mb-3 font-semibold">
              Phong cách sống Việt
            </p>
            <h1 className="heading text-5xl text-white mb-4 leading-tight font-extrabold">
              Không gian sống – Tinh tế từng chi tiết
            </h1>
            <p className="text-white/80 mb-6 leading-relaxed">
              Khám phá những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại,
              tạo nên không gian sống ấm cúng và đầy cảm hứng.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#030213] transition-all hover:scale-105 active:scale-95"
              >
                Về chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading text-3xl text-center text-[#030213] mb-12 font-bold">Danh mục sản phẩm</h2>
          
          {isLoadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[4/3]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(c => c.parentId === null).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-cover bg-center block"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(3, 2, 19, 0.8), transparent), url(https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=600)`,
                  }}
                >
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 bg-[#030213]/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-white text-xl font-semibold tracking-wide group-hover:text-[#C8954A] transition-colors">{category.name}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8954A] rounded-xl transition-colors duration-300" />
                </Link>
              ))}
            </div>
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
              <h2 className="heading text-3xl text-[#030213] mb-4 font-bold">Về BALLANDBEEHOME</h2>
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
