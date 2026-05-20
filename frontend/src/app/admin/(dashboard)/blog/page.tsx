'use client';

import Link from 'next/link';
import { Search, Edit, Eye, Trash2, Plus, Loader2, AlertCircle, Star } from 'lucide-react';
import { useBlogPosts, useDeleteBlogPost } from '@/lib/api';
import { useState, useMemo } from 'react';

export default function AdminBlog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch từ API
  const { data: blogPosts = [], isLoading, isError, refetch } = useBlogPosts();
  const deleteBlogPost = useDeleteBlogPost();

  // Tính topics động từ dữ liệu thật
  const topics = useMemo(() => {
    const topicMap = new Map<string, string>();
    blogPosts.forEach((p) => {
      if (p.topicSlug && p.topic) topicMap.set(p.topicSlug, p.topic);
    });
    return Array.from(topicMap.entries()).map(([slug, name]) => ({ slug, name }));
  }, [blogPosts]);

  // Filter client-side
  const filteredPosts = blogPosts.filter((p) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTopic = selectedTopic === '' || p.topicSlug === selectedTopic;

    const matchStatus =
      selectedStatus === '' ||
      (selectedStatus === 'published' && p.status === 'published') ||
      (selectedStatus === 'draft' && p.status !== 'published');

    return matchSearch && matchTopic && matchStatus;
  });

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    setDeletingId(id);
    try {
      await deleteBlogPost.mutateAsync(id);
    } catch {
      alert('Xóa bài viết thất bại. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quản lý Blog</h2>
          {!isLoading && (
            <p className="text-sm text-[#888888] mt-0.5">
              {filteredPosts.length} / {blogPosts.length} bài viết
            </p>
          )}
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Viết bài mới
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-[#E8E0D5]/30">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
            />
          </div>
          {/* Topics dropdown — từ dữ liệu thật */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white text-sm cursor-pointer"
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white text-sm cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-[#E8E0D5]/30 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin" />
          <p className="text-sm text-[#888888]">Đang tải bài viết...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 rounded-lg p-6 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <p className="font-medium text-red-700">Không thể tải dữ liệu blog</p>
          <button onClick={() => refetch()} className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg text-sm cursor-pointer">
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Thumbnail</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Tiêu đề</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Chủ đề</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Nổi bật</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Ngày đăng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#888888]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t border-[#E8E0D5] hover:bg-[#FAF7F2]/30 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={post.image || 'https://placehold.co/64x48?text=No+img'}
                        alt={post.title}
                        className="w-16 h-12 rounded object-cover shadow-sm border border-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold max-w-xs text-gray-800 text-sm">
                      <span className="line-clamp-2">{post.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-[#E07B54] text-white rounded-full font-medium whitespace-nowrap">
                        {post.topic}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {post.featured && <Star className="w-4 h-4 text-[#C8954A] fill-[#C8954A]" />}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888] whitespace-nowrap">{post.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#C8954A] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-[#FAF7F2] rounded text-gray-600 hover:text-[#1E3A5F] transition-colors"
                          title="Xem bài viết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 cursor-pointer transition-colors disabled:opacity-40"
                          title="Xóa bài viết"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#888888]">
                      <p className="text-lg mb-1">📝 Chưa có bài viết nào</p>
                      <p className="text-sm">Bắt đầu viết bài blog đầu tiên của bạn</p>
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
