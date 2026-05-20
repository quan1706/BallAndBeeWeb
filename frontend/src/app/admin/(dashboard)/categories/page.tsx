'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, GripVertical, FolderPlus, Folder } from 'lucide-react';
import { categories as initialCategories, Category } from '@/data/mockData';

export default function AdminCategories() {
  const [localCategories, setLocalCategories] = useState<Category[]>(initialCategories);
  const [expandedCats, setExpandedCats] = useState<number[]>([1, 4]); // Mặc định mở rộng Nội thất và Kitchen & Dining
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  // Form states cho thêm/sửa
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addingParentId, setAddingParentId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#C8954A',
    parentId: '' as string | number,
  });

  const toggleCategory = (id: number) => {
    setExpandedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectedCat = localCategories.find((c) => c.id === selectedCatId);

  // Lấy các danh mục gốc
  const rootCategories = localCategories.filter((c) => c.parentId === null);

  // Lấy danh mục con của một danh mục
  const getChildren = (catId: number) => {
    return localCategories.filter((c) => c.parentId === catId);
  };

  // Tự động tạo slug khi gõ tên
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^a-z0-9\s-]|)/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleEditClick = (cat: Category) => {
    setIsAdding(false);
    setSelectedCatId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      color: cat.color || '#C8954A',
      parentId: cat.parentId !== null ? cat.parentId : 'root',
    });
  };

  const handleAddSubClick = (parentCat: Category) => {
    setIsAdding(true);
    setSelectedCatId(null);
    setAddingParentId(parentCat.id);
    setFormData({
      name: '',
      slug: '',
      color: parentCat.color || '#C8954A',
      parentId: parentCat.id,
    });
  };

  const handleAddRootClick = () => {
    setIsAdding(true);
    setSelectedCatId(null);
    setAddingParentId(null);
    setFormData({
      name: '',
      slug: '',
      color: '#C8954A',
      parentId: 'root',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const parentIdValue = formData.parentId === 'root' || formData.parentId === '' 
      ? null 
      : Number(formData.parentId);

    if (isAdding) {
      // Thêm danh mục mới
      const newCat: Category = {
        id: Date.now(), // Tạo ID ngẫu nhiên bằng milisecond
        name: formData.name,
        slug: formData.slug || 'danh-muc-moi',
        color: formData.color,
        parentId: parentIdValue,
      };

      setLocalCategories((prev) => [...prev, newCat]);
      alert('Đã thêm danh mục mới thành công!');
      
      // Mở rộng cha của danh mục mới để người dùng thấy ngay
      if (parentIdValue) {
        setExpandedCats((prev) => prev.includes(parentIdValue) ? prev : [...prev, parentIdValue]);
      }
      
      setIsAdding(false);
    } else if (selectedCatId !== null) {
      // Cập nhật danh mục hiện tại
      // Chống đệ quy vòng tròn (danh mục không được làm cha của chính nó)
      if (parentIdValue === selectedCatId) {
        alert('Lỗi: Một danh mục không thể làm cha của chính nó!');
        return;
      }

      setLocalCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCatId
            ? { ...c, name: formData.name, slug: formData.slug, color: formData.color, parentId: parentIdValue }
            : c
        )
      );
      alert('Đã cập nhật danh mục thành công!');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả danh mục con của nó cũng sẽ được đưa về cấp cha.')) {
      // Tìm danh mục cha của danh mục sắp xóa để gán lại cho các con của nó
      const catToDelete = localCategories.find((c) => c.id === id);
      const parentOfDeleted = catToDelete ? catToDelete.parentId : null;

      setLocalCategories((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => (c.parentId === id ? { ...c, parentId: parentOfDeleted } : c))
      );
      
      if (selectedCatId === id) {
        setSelectedCatId(null);
      }
      alert('Đã xóa danh mục thành công!');
    }
  };

  // Tạo mảng phẳng danh mục được định dạng thụt lề thụt dòng (để render ra thẻ Select)
  const getFlattenedSelectOptions = (parentId: number | null = null, level: number = 0): Array<{ id: number; name: string }> => {
    const list = localCategories.filter((c) => c.parentId === parentId);
    return list.reduce((acc, curr) => {
      const prefix = '— '.repeat(level);
      const option = { id: curr.id, name: `${prefix}${curr.name}` };
      const children = getFlattenedSelectOptions(curr.id, level + 1);
      return [...acc, option, ...children];
    }, [] as Array<{ id: number; name: string }>);
  };

  const selectOptions = getFlattenedSelectOptions(null, 0);

  // Đệ quy để hiển thị cây thư mục Admin không giới hạn cấp
  const renderAdminCategoryTree = (parentId: number | null = null, level: number = 0) => {
    const list = localCategories.filter((c) => c.parentId === parentId);
    if (list.length === 0) return null;

    return (
      <div className={`space-y-1.5 ${level > 0 ? 'pl-6 border-l-2 border-[#E8E0D5]/50 mt-1' : ''}`}>
        {list.map((cat) => {
          const children = getChildren(cat.id);
          const hasChildren = children.length > 0;
          const isExpanded = expandedCats.includes(cat.id);
          const isSelected = selectedCatId === cat.id;

          return (
            <div key={cat.id} className="space-y-1">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#FAF7F2] cursor-pointer group transition-all ${
                  isSelected ? 'bg-[#C8954A]/10 border-l-4 border-[#C8954A]' : 'bg-white border-l-4 border-transparent'
                }`}
                onClick={() => handleEditClick(cat)}
              >
                <GripVertical className="w-4 h-4 text-[#888888] opacity-50 cursor-grab active:cursor-grabbing" />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(cat.id);
                  }}
                  className="p-1 cursor-pointer hover:bg-white rounded transition-colors"
                >
                  {hasChildren ? (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#1E3A5F]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#1E3A5F]" />
                    )
                  ) : (
                    <Folder className="w-4 h-4 text-gray-300" />
                  )}
                </button>

                {cat.color && (
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                )}

                <span className="flex-1 font-semibold text-gray-700">{cat.name}</span>

                <span className="text-xs px-2.5 py-0.5 bg-[#FAF7F2] rounded-full text-gray-500 font-bold border border-gray-100 shrink-0">
                  {children.length} con
                </span>

                {/* Các nút hành động nhanh */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSubClick(cat);
                    }}
                    title="Thêm danh mục con"
                    className="p-1 hover:bg-white rounded text-[#C8954A] transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(cat);
                    }}
                    title="Chỉnh sửa"
                    className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cat.id);
                    }}
                    title="Xóa danh mục"
                    className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {hasChildren && isExpanded && renderAdminCategoryTree(cat.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 text-gray-800">
      {/* Category Tree (Left 2 Columns) */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#1E3A5F] text-lg">Phân cấp danh mục (Không giới hạn cấp)</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">Bấm nút + bên cạnh danh mục để tạo danh mục con trực tiếp</p>
          </div>
          <button
            onClick={handleAddRootClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] cursor-pointer transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Thêm thẻ gốc
          </button>
        </div>

        <div className="space-y-2 select-none">
          {renderAdminCategoryTree(null, 0)}
        </div>
      </div>

      {/* Editing / Adding Panel (Right Column) */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30 self-start sticky top-24">
        {isAdding || selectedCatId !== null ? (
          <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-[#1E3A5F] text-lg border-b border-[#E8E0D5]/50 pb-3">
              {isAdding
                ? addingParentId
                  ? `Thêm con của: ${localCategories.find((c) => c.id === addingParentId)?.name}`
                  : 'Thêm danh mục gốc'
                : 'Chỉnh sửa danh mục'}
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Tên danh mục</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên..."
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Slug (Đường dẫn tinh gọn)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-tinh-gon"
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Danh mục cha</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none bg-white font-semibold text-gray-700"
              >
                <option value="root">Là danh mục chính (Thẻ gốc)</option>
                {selectOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Màu đại diện</label>
              <div className="flex flex-wrap gap-2">
                {['#C8954A', '#1E3A5F', '#E07B54', '#88B04B', '#6B7DB3', '#D4956A', '#EC5B5B', '#4D4D4D'].map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 shadow-sm ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-[#C8954A] scale-105' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-bold cursor-pointer"
              >
                Lưu lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setSelectedCatId(null);
                }}
                className="px-4 py-3 text-[#888888] hover:text-[#C8954A] transition-colors cursor-pointer font-bold"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-[#1E3A5F] text-base mb-1">Bảng điều khiển</h4>
            <p className="text-xs max-w-[200px] mx-auto">
              Bấm vào bất kỳ danh mục nào để chỉnh sửa hoặc nhấn "Thêm thẻ gốc" để tạo mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
