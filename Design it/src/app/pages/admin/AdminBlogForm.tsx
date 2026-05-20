import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Upload } from 'lucide-react';

export function AdminBlogForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topic: '',
    excerpt: '',
    status: 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bài viết đã được lưu!');
    navigate('/admin/blog');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/blog" className="p-2 hover:bg-white rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-sm text-[#888888]">Blog</p>
          <h2 className="text-xl font-semibold text-[#1E3A5F]">Viết bài mới</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-0 py-2 text-3xl heading border-0 border-b-2 border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div className="flex gap-2 py-2 border-b border-[#E8E0D5]">
                <button
                  type="button"
                  className="px-3 py-1 hover:bg-[#FAF7F2] rounded font-bold"
                >
                  B
                </button>
                <button
                  type="button"
                  className="px-3 py-1 hover:bg-[#FAF7F2] rounded italic"
                >
                  I
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  H2
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  H3
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  List
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  Quote
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  Link
                </button>
                <button type="button" className="px-3 py-1 hover:bg-[#FAF7F2] rounded">
                  Image
                </button>
              </div>

              <textarea
                rows={20}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-0 py-4 border-0 outline-none resize-none"
                placeholder="Viết nội dung bài viết..."
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-[#1E3A5F] mb-4">Cài đặt</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ảnh bìa</label>
                  <div className="border-2 border-dashed border-[#E8E0D5] rounded-lg p-6 text-center hover:border-[#C8954A] cursor-pointer">
                    <Upload className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                    <p className="text-xs text-[#888888]">Kéo thả hoặc click để chọn</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Chủ đề</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="phong-cach-song">Phong cách sống</option>
                    <option value="huong-dan-bay-tri">Hướng dẫn bày trí</option>
                    <option value="tin-tuc">Tin tức</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tóm tắt</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none"
                    placeholder="Tóm tắt nội dung bài viết"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trạng thái</label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#888888]">Nháp</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          status: formData.status === 'draft' ? 'published' : 'draft',
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.status === 'published' ? 'bg-[#C8954A]' : 'bg-[#E8E0D5]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          formData.status === 'published' ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm text-[#888888]">Đã đăng</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]"
                  >
                    Đăng bài
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white"
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
