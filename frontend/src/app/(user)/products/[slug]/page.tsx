'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Phone, MessageCircle, Package, Ruler, MapPin } from 'lucide-react';
import { useProductBySlug, useProducts, useSettings } from '@/lib/api';
import { companyInfo } from '@/lib/constants';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: product, isLoading: isLoadingProduct } = useProductBySlug(slug);
  const { data: allProducts = [] } = useProducts();
  const { data: settings } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8954A]" />
        <p className="mt-4 text-[#030213] font-medium animate-pulse text-sm">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-[#030213] font-medium">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#888888] mb-8">
          <Link href="/" className="hover:text-[#C8954A] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#C8954A] transition-colors">
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span>{product.subcategory}</span>
            </>
          )}
        </div>

        {/* Product Content */}
        <div className="grid md:grid-cols-5 gap-8 mb-16">
          {/* Image Gallery */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E0D5]/30 flex items-center justify-center h-[320px] sm:h-[400px] md:h-[480px]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer aspect-square bg-white border transition-all ${
                    selectedImage === idx 
                      ? 'border-[#C8954A] ring-2 ring-[#C8954A]/30 scale-[0.98]' 
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-2">
            <h1 className="heading text-3xl text-[#1E3A5F] mb-4">{product.name}</h1>
            <p className="text-[#888888] mb-6 leading-relaxed">{product.description}</p>

            <div className="border-t border-[#E8E0D5] pt-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#C8954A]" />
                  <span className="text-sm text-[#888888]">Chất liệu:</span>
                  <span className="text-sm font-medium">{product.material}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-[#C8954A]" />
                  <span className="text-sm text-[#888888]">Kích thước:</span>
                  <span className="text-sm font-medium">{product.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#C8954A]" />
                  <span className="text-sm text-[#888888]">Xuất xứ:</span>
                  <span className="text-sm font-medium">{product.origin}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white border border-[#C8954A]/30 text-[#C8954A] text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E0D5]/50">
              <h3 className="font-semibold text-[#1E3A5F] mb-2">Quan tâm sản phẩm này?</h3>
              <p className="text-sm text-[#888888] mb-4">Liên hệ để được tư vấn và đặt hàng</p>
              <a
                href={`tel:${settings?.phone || companyInfo.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] transition-colors mb-3 font-medium text-center"
              >
                <Phone className="w-5 h-5" />
                Gọi ngay: {settings?.phone || companyInfo.phone}
              </a>
              <a
                href={`https://zalo.me/${settings?.zalo || companyInfo.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-[#C8954A] text-[#C8954A] py-3 rounded-lg hover:bg-[#C8954A] hover:text-white transition-colors font-medium text-center"
              >
                <MessageCircle className="w-5 h-5" />
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="heading text-2xl text-[#1E3A5F] mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#888888] mb-1">{p.category}</p>
                    <h3 className="font-semibold text-[#1E3A5F] group-hover:text-[#C8954A] transition-colors">{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
