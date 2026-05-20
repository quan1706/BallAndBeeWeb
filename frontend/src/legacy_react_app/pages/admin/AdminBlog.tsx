import { Link } from 'react-router';
import { Search, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { blogPosts } from '../../data/mockData';
import { useState } from 'react';

export function AdminBlog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quản lý Blog</h2>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Viết bài mới
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none">
            <option>Tất cả chủ đề</option>
            <option>Phong cách sống</option>
            <option>Hướng dẫn bày trí</option>
            <option>Tin tức</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none">
            <option>Tất cả trạng thái</option>
            <option>Đã đăng</option>
            <option>Nháp</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">
                  Thumbnail
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">
                  Tiêu đề
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Chủ đề</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">
                  Ngày đăng
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-t border-[#E8E0D5]">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium max-w-md">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-[#E07B54] text-white rounded-full">
                      {post.topic}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Đã đăng
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#888888]">{post.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-[#FAF7F2] rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-[#FAF7F2] rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded text-red-500">
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
