'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { useProducts, useCategoriesFlat, useUpdateProduct } from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: categoriesFlat = [], isLoading: isLoadingCats } = useCategoriesFlat();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    material: '',
    size: '',
    origin: '',
    price: 0,
    visible: true,
    featured: false,
    tags: [] as string[],
    image: '',
    slug: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((p) => p.id === id);
      if (product) {
        // Find category ID from category slug if possible, or we should use categoriesFlat to match
        const cat = categoriesFlat.find(c => c.slug === product.categorySlug || c.name === product.category);
        
        setFormData({
          name: product.name,
          slug: product.slug || '',
          price: product.price || 0,
          description: product.description || '',
          categoryId: cat ? String(cat.id) : '',
          material: product.material || '',
          size: product.size || '',
          origin: product.origin || '',
          visible: product.visible !== false,
          featured: product.featured === true,
          tags: product.tags || [],
          image: product.image || '',
        });
      }
    }
  }, [id, products, categoriesFlat]);

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Vui lòng chọn danh mục sản phẩm');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          ...formData,
          categoryId: Number(formData.categoryId),
          visible: !isDraft,
        }
      });
      alert('Sản phẩm đã được lưu!');
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Lưu sản phẩm thất bại!');
    } finally {
      setIsSaving(false);
    }
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

  if (isLoadingProducts || isLoadingCats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin mb-4" />
        <p className="text-[#888888]">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1E3A5F]" />
        </Link>
        <div>
          <p className="text-sm text-[#888888]">Sản phẩm</p>
          <h2 className="text-xl font-semibold text-[#1E3A5F]">Chỉnh sửa sản phẩm</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-3xl text-gray-800">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Slug (Đường dẫn tĩnh)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all font-mono text-sm"
                    placeholder="ban-go-soi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all font-mono"
                    placeholder="Ví dụ: 1500000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Mô tả</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none transition-all"
                  placeholder="Mô tả sản phẩm"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-gray-300 w-4 h-4 text-[#C8954A] focus:ring-[#C8954A]"
                  />
                  <span className="text-sm text-gray-700 font-medium">Hiển thị trên website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 w-4 h-4 text-[#C8954A] focus:ring-[#C8954A]"
                  />
                  <span className="text-sm text-gray-700 font-medium">Ghim lên trang chủ (Nổi bật)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Phân loại</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Danh mục *</label>
                <select
                  value={formData.categoryId}
                  required
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none transition-all bg-white font-semibold text-gray-700"
                >
                  <option value="">Chọn danh mục</option>
                  {categoriesFlat.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parentId ? `— ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
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
                    placeholder="Nhập tag và nhấn Enter (vd: the-thao, do-go)"
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
                      className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E0D5] text-[#888888] rounded-full text-sm flex items-center gap-2 font-medium shadow-sm"
                    >
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer hover:text-red-500 text-gray-400">
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
                  placeholder="Gốm sứ, gỗ,..."
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
                  placeholder="Việt Nam, TQ,..."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
            <h3 className="font-semibold text-[#1E3A5F] mb-4">Hình ảnh sản phẩm</h3>
            
            {formData.image ? (
              <div className="relative inline-block">
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-[#E8E0D5]" />
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, image: ''})}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#C8954A] rounded-lg p-8 text-center transition-colors">
                <Upload className="w-12 h-12 text-[#C8954A] mx-auto mb-3" />
                <p className="text-sm text-[#888888] mb-2 font-medium">Click để nhập URL ảnh sản phẩm (Mock UI cho Upload)</p>
                <input 
                  type="text" 
                  className="w-full mt-2 px-3 py-2 border rounded text-sm"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>
            )}
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
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, true)}
              className="px-6 py-2 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer disabled:opacity-50"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-semibold cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
