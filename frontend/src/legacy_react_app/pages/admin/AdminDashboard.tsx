import { Package, FolderTree, FileText, Star } from 'lucide-react';
import { Link } from 'react-router';
import { products, categories, blogPosts } from '../../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Tổng sản phẩm',
      value: products.length,
      icon: Package,
      color: 'bg-[#C8954A]/10 text-[#C8954A]',
    },
    {
      label: 'Danh mục',
      value: categories.length,
      icon: FolderTree,
      color: 'bg-[#1E3A5F]/10 text-[#1E3A5F]',
    },
    {
      label: 'Bài blog',
      value: blogPosts.length,
      icon: FileText,
      color: 'bg-[#E07B54]/10 text-[#E07B54]',
    },
    {
      label: 'Sản phẩm nổi bật',
      value: products.filter((p) => p.featured).length,
      icon: Star,
      color: 'bg-[#88B04B]/10 text-[#88B04B]',
    },
  ];

  const recentProducts = products.slice(0, 5);

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: products.filter((p) => p.categorySlug === cat.slug).length,
  }));

  const COLORS = ['#C8954A', '#1E3A5F', '#E07B54', '#88B04B', '#6B7DB3', '#D4956A'];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1E3A5F]">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-[#1E3A5F] mb-4">Sản phẩm mới thêm</h3>
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
                  <tr key={product.id} className="border-b border-[#E8E0D5]">
                    <td className="py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="py-3 text-sm">{product.name}</td>
                    <td className="py-3 text-sm text-[#888888]">{product.category}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Hiển thị
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-[#1E3A5F] mb-4">Phân bổ danh mục</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          to="/admin/products/new"
          className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors"
        >
          + Thêm sản phẩm
        </Link>
        <Link
          to="/admin/blog/new"
          className="px-6 py-3 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-colors"
        >
          + Viết bài blog
        </Link>
      </div>
    </div>
  );
}
