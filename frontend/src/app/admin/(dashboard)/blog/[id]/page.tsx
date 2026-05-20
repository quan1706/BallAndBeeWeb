'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import { useBlogPosts, useUpdateBlogPost } from '@/lib/api';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const updateBlogPost = useUpdateBlogPost();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    topic: '',
    topicSlug: '',
    excerpt: '',
    status: 'draft',
    image: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && blogPosts.length > 0) {
      const post = blogPosts.find((p) => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug || '',
          content: post.content || '',
          topic: post.topic || '',
          topicSlug: post.topicSlug || '',
          excerpt: post.excerpt || '',
          status: post.status || 'published',
          image: post.image || '',
        });
      }
    }
  }, [id, blogPosts]);

  const handleSubmit = async (e: React.FormEvent, submitStatus?: string) => {
    e.preventDefault();
    setIsSaving(true);
    
    const finalStatus = submitStatus || formData.status;

    try {
      await updateBlogPost.mutateAsync({
        id,
        data: {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          topic: formData.topic,
          topicSlug: formData.topicSlug,
          excerpt: formData.excerpt,
          status: finalStatus,
          image: formData.image,
        }
      });
      alert('Bài viết đã được lưu!');
      router.push('/admin/blog');
    } catch (err: any) {
      alert(err.message || 'Lưu bài viết thất bại!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    // Auto generate slug
    const slug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^a-z0-9\s-]|)/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({ ...prev, title: val, slug }));
  };

  const handleTopicChange = (val: string) => {
    let topicName = '';
    if (val === 'phong-cach-song') topicName = 'Phong cách sống';
    else if (val === 'huong-dan-bay-tri') topicName = 'Hướng dẫn bày trí';
    else if (val === 'tin-tuc') topicName = 'Tin tức';
    else topicName = val; // fallback for custom topics

    setFormData(prev => ({ ...prev, topicSlug: val, topic: topicName }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin mb-4" />
        <p className="text-[#888888]">Đang tải thông tin bài viết...</p>
      </div>
    );
  }

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

      <form onSubmit={(e) => handleSubmit(e, formData.status)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-0 py-2 text-3xl heading border-0 border-b-2 border-[#E8E0D5] focus:border-[#C8954A] outline-none text-gray-800 placeholder-gray-400 font-bold bg-transparent transition-all"
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div className="flex gap-2 py-2 border-b border-[#E8E0D5]">
                {['B', 'I', 'H2', 'H3', 'List', 'Quote', 'Link', 'Image'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    className="px-3 py-1 hover:bg-[#FAF7F2] rounded font-medium cursor-pointer transition-colors text-sm text-[#1E3A5F]"
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <textarea
                rows={15}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-0 py-4 border-0 outline-none resize-none bg-transparent placeholder-gray-400"
                placeholder="Viết nội dung bài viết (Hỗ trợ HTML/Markdown)..."
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
              <h3 className="font-semibold text-[#1E3A5F] mb-4">Cài đặt bài viết</h3>
              <div className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Slug (Đường dẫn tĩnh)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Ảnh bìa</label>
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="Cover preview" className="w-full aspect-[16/9] object-cover rounded-lg border border-[#E8E0D5]" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#E8E0D5] rounded-lg p-6 text-center hover:border-[#C8954A] transition-all hover:bg-[#FAF7F2]/30">
                      <Upload className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                      <p className="text-xs text-[#888888] font-medium mb-2">Nhập URL ảnh cover</p>
                      <input 
                        type="text" 
                        className="w-full mt-2 px-3 py-2 border rounded text-sm outline-none focus:border-[#C8954A]"
                        placeholder="https://example.com/image.jpg"
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Chủ đề</label>
                  <select
                    required
                    value={formData.topicSlug}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white transition-all cursor-pointer"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="phong-cach-song">Phong cách sống</option>
                    <option value="huong-dan-bay-tri">Hướng dẫn bày trí</option>
                    <option value="tin-tuc">Tin tức</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tóm tắt (Excerpt)</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none transition-all"
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Trạng thái</label>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${formData.status === 'draft' ? 'text-[#C8954A]' : 'text-[#888888]'}`}>Nháp</span>
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
                    <span className={`text-sm font-medium ${formData.status === 'published' ? 'text-[#C8954A]' : 'text-[#888888]'}`}>Đã đăng</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    onClick={(e) => handleSubmit(e, 'published')}
                    className="w-full px-4 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && formData.status === 'published' && <Loader2 className="w-4 h-4 animate-spin" />}
                    Đăng bài (Published)
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={(e) => handleSubmit(e, 'draft')}
                    className="w-full px-4 py-3 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && formData.status === 'draft' && <Loader2 className="w-4 h-4 animate-spin" />}
                    Lưu nháp (Draft)
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
