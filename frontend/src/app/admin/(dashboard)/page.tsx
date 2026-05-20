'use client';

import { Package, Star, FolderTree, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProducts, useAdminStats, useBlogPosts } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const COLORS = ['#C8954A', '#1E3A5F', '#E07B54', '#88B04B', '#6B7DB3', '#D4956A'];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: blogPosts = [] } = useBlogPosts();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stats cards config
  const statCards = [
    {
      label: 'Tổng sản phẩm',
      value: stats?.totalProducts ?? '—',
      icon: Package,
      color: 'bg-[#C8954A]/10 text-[#C8954A]',
      href: '/admin/products',
    },
    {
      label: 'Danh mục',
      value: stats?.totalCategories ?? '—',
      icon: FolderTree,
      color: 'bg-[#1E3A5F]/10 text-[#1E3A5F]',
      href: '/admin/categories',
    },
    {
      label: 'Bài blog',
      value: stats?.totalBlogPosts ?? '—',
      icon: FileText,
      color: 'bg-[#E07B54]/10 text-[#E07B54]',
      href: '/admin/blog',
    },
    {
      label: 'Sản phẩm nổi bật',
      value: stats?.featuredProducts ?? '—',
      icon: Star,
      color: 'bg-[#88B04B]/10 text-[#88B04B]',
      href: '/admin/products',
    },
  ];

  // 5 sản phẩm mới nhất
  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Tính phân bổ danh mục từ dữ liệu sản phẩm
  const categoryMap = products.reduce<Record<string, number>>((acc, p) => {
    const key = p.category || 'Khác';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  // Topic phân bổ blog
  const topicMap = blogPosts.reduce<Record<string, number>>((acc, b) => {
    const key = b.topic || 'Khác';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} href={stat.href} className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">{stat.label}</p>
                  {isLoadingStats ? (
                    <div className="h-9 w-12 bg-gray-100 animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-[#1E3A5F] group-hover:text-[#C8954A] transition-colors">{stat.value}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1E3A5F]">Sản phẩm mới nhất</h3>
            <Link href="/admin/products" className="text-xs text-[#C8954A] hover:underline font-semibold">
              Xem tất cả →
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded bg-gray-100" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E0D5] text-left">
                    <th className="pb-3 text-sm font-medium text-[#888888]">Ảnh</th>
                    <th className="pb-3 text-sm font-medium text-[#888888]">Tên</th>
                    <th className="pb-3 text-sm font-medium text-[#888888]">Danh mục</th>
                    <th className="pb-3 text-sm font-medium text-[#888888]">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="border-b border-[#E8E0D5] last:border-none">
                      <td className="py-3">
                        <img
                          src={product.image || 'https://placehold.co/40x40?text=No+img'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover border border-gray-100"
                        />
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-800">
                        <Link href={`/admin/products/${product.id}`} className="hover:text-[#C8954A] transition-colors">
                          {product.name}
                        </Link>
                      </td>
                      <td className="py-3 text-sm text-[#888888]">{product.category}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.visible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.visible ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-[#888888]">
                        Chưa có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
          <h3 className="font-semibold text-[#1E3A5F] mb-4">Phân bổ danh mục</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {!mounted || isLoadingProducts ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin" />
                <span className="text-xs text-[#888888]">Đang tải biểu đồ...</span>
              </div>
            ) : categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} sản phẩm`, 'Số lượng']}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E0D5' }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: '11px', color: '#717182' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[#888888]">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Summary below chart */}
          {stats && (
            <div className="mt-4 pt-4 border-t border-[#E8E0D5]/50 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Sản phẩm mới</span>
                <span className="font-bold text-[#C8954A]">{stats.newProducts}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Đang hiển thị</span>
                <span className="font-bold text-green-600">{stats.visibleProducts}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors font-medium"
        >
          + Thêm sản phẩm
        </Link>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-colors font-medium"
        >
          + Viết bài blog
        </Link>
        <Link
          href="/admin/categories"
          className="px-6 py-3 border-2 border-[#1E3A5F] text-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F] hover:text-white transition-colors font-medium"
        >
          Quản lý danh mục
        </Link>
      </div>
    </div>
  );
}
