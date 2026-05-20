'use client';

import Link from 'next/link';
import { Search, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { products } from '@/data/mockData';
import { useState } from 'react';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quản lý sản phẩm</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-[#E8E0D5]/30">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none">
            <option>Tất cả danh mục</option>
            <option>Nội thất</option>
            <option>Lighting</option>
            <option>Trang trí</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none">
            <option>Tất cả trạng thái</option>
            <option>Hiển thị</option>
            <option>Ẩn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E8E0D5]/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Ảnh</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Danh mục</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Tags</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Nổi bật</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-[#E8E0D5] hover:bg-[#FAF7F2]/30 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-[#888888]">{product.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {product.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-[#FAF7F2] rounded-full text-[#888888]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.featured && <span className="text-[#C8954A]">⭐</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Hiển thị
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-1 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#C8954A] transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link href={`/products/${product.slug}`} className="p-1 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#1E3A5F] transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1 hover:bg-red-50 rounded text-red-500 cursor-pointer transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
