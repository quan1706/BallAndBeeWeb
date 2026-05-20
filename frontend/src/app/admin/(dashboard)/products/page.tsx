'use client';

import Link from 'next/link';
import { Search, Edit, Eye, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useProducts, useCategories, useDeleteProduct } from '@/lib/api';
import { useState } from 'react';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch từ API
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const { data: categoriesTree = [] } = useCategories();
  const deleteProduct = useDeleteProduct();

  // Lấy flat list root categories để hiển thị dropdown filter
  const rootCategories = categoriesTree.filter((c) => c.parentId === null);

  // Filter client-side
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategorySlug === '' || p.categorySlug === selectedCategorySlug;

    const matchStatus =
      selectedStatus === '' ||
      (selectedStatus === 'visible' && p.visible) ||
      (selectedStatus === 'hidden' && !p.visible);

    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } catch (err) {
      alert('Xóa sản phẩm thất bại. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quản lý sản phẩm</h2>
          {!isLoading && (
            <p className="text-sm text-[#888888] mt-0.5">
              {filteredProducts.length} / {products.length} sản phẩm
            </p>
          )}
        </div>
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
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
            />
          </div>

          {/* Category filter — từ API */}
          <select
            value={selectedCategorySlug}
            onChange={(e) => setSelectedCategorySlug(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white text-sm cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {rootCategories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white text-sm cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="visible">Đang hiển thị</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-[#E8E0D5]/30 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin" />
          <p className="text-sm text-[#888888]">Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-700">Không thể tải dữ liệu</p>
            <p className="text-sm text-red-500">Kiểm tra kết nối đến backend API.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E8E0D5]/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF7F2]">
                <tr>
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
                  <tr
                    key={product.id}
                    className="border-t border-[#E8E0D5] hover:bg-[#FAF7F2]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={product.image || 'https://placehold.co/48x48?text=?'}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover shadow-sm border border-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                      <p className="text-xs text-[#888888] mt-0.5">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888]">
                      <span>{product.category}</span>
                      {product.subcategory && (
                        <p className="text-xs text-gray-400 mt-0.5">{product.subcategory}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-[#FAF7F2] rounded-full text-[#888888] border border-[#E8E0D5]"
                          >
                            #{tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="text-xs text-[#888888]">+{product.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.featured && <span className="text-[#C8954A] text-lg">⭐</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.visible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {product.visible ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#C8954A] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#1E3A5F] transition-colors"
                          title="Xem trên website"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
                          title="Xóa sản phẩm"
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#888888]">
                      <p className="text-lg mb-1">😕 Không tìm thấy sản phẩm nào</p>
                      <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
