'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Package } from 'lucide-react';
import { ImageUploadZone } from '@/components/ImageUploadZone';
import { useCategories, useCreateProduct } from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    material: '',
    size: '',
    origin: '',
    visible: true,
    featured: false,
    isNew: true,
    tags: [] as string[],
    image: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from name
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      setError('Vui lòng chọn danh mục sản phẩm.');
      return;
    }
    if (!formData.image) {
      setError('Vui lòng upload ít nhất một ảnh sản phẩm.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.categoryId),
        material: formData.material,
        size: formData.size,
        origin: formData.origin,
        visible: formData.visible,
        featured: formData.featured,
        isNew: formData.isNew,
        tags: formData.tags,
        image: formData.image,
      };

      await createProduct.mutateAsync(payload);

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Lưu sản phẩm thất bại');
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Root categories (parentId === null)
  const rootCategories = categories.filter((c) => c.parentId === null);

  // Sub-categories of selected root
  const selectedRoot = categories.find((c) => c.id.toString() === formData.categoryId);
  const subCategories = selectedRoot
    ? categories.filter((c) => c.parentId === selectedRoot.id)
    : [];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1E3A5F]" />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-[#888888] flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            Sản phẩm
          </p>
          <h2 className="text-xl font-semibold text-[#1E3A5F]">Thêm sản phẩm mới</h2>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl text-gray-800">
        <div className="space-y-6">

          {/* === BASIC INFO === */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs flex items-center justify-center font-bold">1</span>
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">
                  Tên sản phẩm <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Vd: Bình gốm trắng nghệ thuật"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">
                  Đường dẫn (Slug)
                  <span className="ml-2 text-xs text-gray-400 font-normal">Tự động tạo từ tên</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">/products/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all font-mono text-sm text-gray-600"
                    placeholder="binh-gom-trang-nghe-thuat"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">Mô tả sản phẩm</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none resize-none transition-all"
                  placeholder="Mô tả chất liệu, phong cách thiết kế, ý nghĩa nghệ thuật..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">
                  Giá bán (VNĐ) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className="w-full pl-4 pr-16 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                    placeholder="850000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">VNĐ</span>
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                {[
                  { key: 'visible', label: 'Hiển thị trên website' },
                  { key: 'featured', label: 'Ghim lên trang chủ' },
                  { key: 'isNew', label: 'Đánh dấu là Mới' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      onClick={() => setFormData((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center ${
                        formData[key as keyof typeof formData] ? 'bg-[#C8954A]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-transform ${
                          formData[key as keyof typeof formData] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-[#1E3A5F] transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* === CATEGORY === */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs flex items-center justify-center font-bold">2</span>
              Phân loại sản phẩm
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Root category */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">
                    Danh mục chính <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all bg-white text-gray-700"
                  >
                    <option value="">Chọn danh mục</option>
                    {rootCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-category */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">Danh mục con</label>
                  <select
                    value=""
                    onChange={(e) => e.target.value && setFormData((p) => ({ ...p, categoryId: e.target.value }))}
                    disabled={subCategories.length === 0}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all bg-white text-gray-700 disabled:opacity-50"
                  >
                    <option value="">Chọn danh mục con</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">Tags tìm kiếm</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all text-sm"
                    placeholder="Nhập tag rồi nhấn Enter (vd: thủ công, gốm, nội thất)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] cursor-pointer transition-colors font-medium text-sm"
                  >
                    Thêm
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#FAF7F2] border border-[#C8954A]/30 text-[#C8954A] rounded-full text-xs flex items-center gap-1.5 font-semibold"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[#C8954A]/60 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === SPECS === */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs flex items-center justify-center font-bold">3</span>
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'material', label: 'Chất liệu', placeholder: 'Gốm sứ, gỗ tự nhiên...' },
                { key: 'size', label: 'Kích thước', placeholder: '20cm × 30cm' },
                { key: 'origin', label: 'Xuất xứ', placeholder: 'Bát Tràng, Việt Nam' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5 text-[#1E3A5F]">{label}</label>
                  <input
                    type="text"
                    value={formData[key as keyof typeof formData] as string}
                    onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all text-sm"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* === IMAGES === */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs flex items-center justify-center font-bold">4</span>
              Hình ảnh sản phẩm
              <span className="text-red-400 text-sm">*</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4 ml-8">
              Ảnh đầu tiên sẽ là ảnh đại diện. Nhấn ⭐ để đặt ảnh đại diện. Ảnh được tự động nén và tối ưu hóa qua CDN.
            </p>
            <ImageUploadZone
              folder="/ballandbee/products"
              maxImages={6}
              value={formData.image ? [formData.image] : []}
              onMainImageChange={(url) => setFormData((p) => ({ ...p, image: url }))}
              onChange={(urls) => {
                if (urls.length > 0 && !formData.image) {
                  setFormData((p) => ({ ...p, image: urls[0] }));
                }
              }}
            />
          </div>
        </div>

        {/* === BOTTOM ACTION BAR === */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-[#E8E0D5] mt-8 -mx-6 px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <Link href="/admin/products" className="text-[#888888] hover:text-[#C8954A] transition-colors font-medium text-sm">
            Hủy bỏ
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, visible: false }))}
              className="px-5 py-2.5 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Lưu nháp
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-semibold cursor-pointer text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Đăng sản phẩm
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
