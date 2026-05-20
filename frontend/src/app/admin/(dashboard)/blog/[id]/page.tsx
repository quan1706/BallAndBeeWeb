'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { blogPosts } from '@/data/mockData';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topic: '',
    excerpt: '',
    status: 'draft',
  });

  useEffect(() => {
    if (id) {
      const post = blogPosts.find((p) => p.id === Number(id));
      if (post) {
        setFormData({
          title: post.title,
          content: post.content || '',
          topic: post.topicSlug || '',
          excerpt: post.excerpt || '',
          status: post.status || 'published',
        });
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bài viết đã được lưu!');
    router.push('/admin/blog');
  };

  return (
    <div className="text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1E3A5F]" />
        </Link>
        <div>
          <p className="text-sm text-[#888888]">Blog</p>
          <h2 className="text-xl font-semibold text-[#1E3A5F]">Chỉnh sửa bài viết</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-0 py-2 text-3xl heading border-0 border-b-2 border-[#E8E0D5] focus:border-[#C8954A] outline-none text-gray-800 placeholder-gray-400 font-bold bg-transparent transition-all"
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div className="flex gap-2 py-2 border-b border-[#E8E0D5]">
                <button
                  type="button"
                  className="px-3 py-1 hover:bg-[#FAF7F2] rounded font-bold cursor-pointer transition-colors"
                >
                  B
                </button>
                <button
                  type="button"
                  className="px-3 py-1 hover:bg-[#FAF7F2] rounded italic cursor-pointer transition-colors"
                >
                  I
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  H2
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  H3
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  List
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  Quote
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  Link
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded cursor-pointer transition-colors font-medium">
                  Image
                </button>
              </div>

              <textarea
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-0 py-4 border-0 outline-none resize-none bg-transparent placeholder-gray-400"
                placeholder="Viết nội dung bài viết..."
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
              <h3 className="font-semibold text-[#1E3A5F] mb-4">Cài đặt</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Ảnh bìa</label>
                  <div className="border-2 border-dashed border-[#E8E0D5] rounded-lg p-6 text-center hover:border-[#C8954A] cursor-pointer transition-all hover:bg-[#FAF7F2]/30">
                    <Upload className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                    <p className="text-xs text-[#888888] font-medium">Kéo thả hoặc click để chọn</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Chủ đề</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white transition-all"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="phong-cach-song">Phong cách sống</option>
                    <option value="huong-dan-bay-tri">Hướng dẫn bày trí</option>
                    <option value="tin-tuc">Tin tức</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tóm tắt</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none transition-all"
                    placeholder="Tóm tắt nội dung bài viết"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Trạng thái</label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#888888] font-medium">Nháp</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          status: formData.status === 'draft' ? 'published' : 'draft',
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        formData.status === 'published' ? 'bg-[#C8954A]' : 'bg-[#E8E0D5]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          formData.status === 'published' ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm text-[#888888] font-medium">Đã đăng</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-semibold cursor-pointer"
                  >
                    Đăng bài
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer"
                  >
                    Lưu nháp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
