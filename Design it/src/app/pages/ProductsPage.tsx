import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, categories } from '../data/mockData';
import { useState } from 'react';

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categorySlug === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#C8954A] text-white'
                    : 'bg-[#FAF7F2] text-[#1E3A5F] hover:bg-[#E8E0D5]'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#C8954A] text-white'
                      : 'bg-[#FAF7F2] text-[#1E3A5F] hover:bg-[#E8E0D5]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="text-sm text-[#888888]">{filteredProducts.length} sản phẩm</div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-[#C8954A] text-white text-xs px-3 py-1 rounded-full">
                    Mới
                  </span>
                )}
                {product.featured && !product.isNew && (
                  <span className="absolute top-3 left-3 bg-[#E07B54] text-white text-xs px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-[#888888] mb-1">{product.category}</p>
                <h3 className="font-semibold text-[#1E3A5F] mb-3">{product.name}</h3>
                <div className="text-[#C8954A] text-sm flex items-center gap-1">
                  Xem chi tiết <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="p-2 rounded-lg hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-[#C8954A] text-white rounded-lg">1</button>
          <button className="px-4 py-2 hover:bg-white rounded-lg transition-colors">2</button>
          <button className="px-4 py-2 hover:bg-white rounded-lg transition-colors">3</button>
          <span className="px-2">...</span>
          <button className="px-4 py-2 hover:bg-white rounded-lg transition-colors">8</button>
          <button className="p-2 rounded-lg hover:bg-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
