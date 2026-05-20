import { Link, useParams } from 'react-router';
import { ChevronRight, Phone, MessageCircle, Package, Ruler, MapPin } from 'lucide-react';
import { products, companyInfo } from '../data/mockData';
import { useState } from 'react';

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#888888] mb-8">
          <Link to="/" className="hover:text-[#C8954A]">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-[#C8954A]">
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
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden ${
                    selectedImage === idx ? 'ring-2 ring-[#C8954A]' : ''
                  }`}
                >
                  <img src={img} alt="" className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-2">
            <h1 className="heading text-3xl text-[#1E3A5F] mb-4">{product.name}</h1>
            <p className="text-[#888888] mb-6">{product.description}</p>

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
                  className="px-3 py-1 bg-[#FAF7F2] border border-[#C8954A] text-[#C8954A] text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-[#FDF3E3] rounded-xl p-6">
              <h3 className="font-semibold text-[#1E3A5F] mb-2">Quan tâm sản phẩm này?</h3>
              <p className="text-sm text-[#888888] mb-4">Liên hệ để được tư vấn và đặt hàng</p>
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] transition-colors mb-3"
              >
                <Phone className="w-5 h-5" />
                Gọi ngay: {companyInfo.phone}
              </a>
              <a
                href={`https://zalo.me/${companyInfo.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-[#C8954A] text-[#C8954A] py-3 rounded-lg hover:bg-[#C8954A] hover:text-white transition-colors"
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
                  to={`/products/${p.slug}`}
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
                    <h3 className="font-semibold text-[#1E3A5F]">{p.name}</h3>
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
