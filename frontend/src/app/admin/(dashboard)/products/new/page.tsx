'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { categories } from '@/data/mockData';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    material: '',
    size: '',
    origin: '',
    visible: true,
    featured: false,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sản phẩm đã được lưu!');
    router.push('/admin/products');
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1E3A5F]" />
        </Link>
        <div>
          <p className="text-sm text-[#888888]">Sản phẩm</p>
          <h2 className="text-xl font-semibold text-[#1E3A5F]">Thêm sản phẩm mới</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl text-gray-800">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tên sản phẩm</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Mô tả</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none resize-none transition-all"
                  placeholder="Mô tả sản phẩm"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Hiển thị trên website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Ghim lên trang chủ</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Phân loại</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Danh mục chính</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value, subcategory: '' });
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all bg-white font-semibold text-gray-700"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.filter((c) => c.parentId === null).map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Danh mục con</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all bg-white font-semibold text-gray-700"
                    disabled={!formData.category}
                  >
                    <option value="">Chọn danh mục con</option>
                    {(() => {
                      const selectedParent = categories.find((c) => c.slug === formData.category);
                      if (!selectedParent) return null;
                      return categories
                        .filter((c) => c.parentId === selectedParent.id)
                        .map((sub) => (
                          <option key={sub.id} value={sub.slug}>
                            {sub.name}
                          </option>
                        ));
                    })()}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all"
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] cursor-pointer transition-colors font-medium"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#C8954A] text-white rounded-full text-sm flex items-center gap-2 font-medium shadow-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer hover:text-red-200">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Thông số kỹ thuật</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Chất liệu</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all"
                  placeholder="Gốm sứ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Kích thước</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all"
                  placeholder="20cm x 20cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Xuất xứ</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all"
                  placeholder="Việt Nam"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Hình ảnh sản phẩm</h3>
            <div className="border-2 border-dashed border-[#C8954A] rounded-lg p-8 text-center cursor-pointer hover:bg-[#FAF7F2]/50 transition-colors">
              <Upload className="w-12 h-12 text-[#C8954A] mx-auto mb-3" />
              <p className="text-sm text-[#888888] mb-2 font-medium">Kéo thả ảnh vào đây hoặc click để chọn</p>
              <p className="text-xs text-[#888888]">Ảnh đầu tiên sẽ là ảnh đại diện</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#E8E0D5] mt-8 -mx-6 px-6 py-4 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <Link href="/admin/products" className="text-[#888888] hover:text-[#C8954A] transition-colors font-medium">
            Hủy
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-semibold cursor-pointer"
            >
              Đăng sản phẩm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
