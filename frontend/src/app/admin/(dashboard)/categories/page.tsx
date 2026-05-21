'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, FolderPlus, Folder, Loader2, AlertCircle, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useCategories, useCategoriesFlat, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from '@/lib/api';

// Helper: generate slug from Vietnamese name
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^a-z0-9\s-]|)/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Flatten category tree to list
function flattenCategories(cats: Category[], result: Category[] = []): Category[] {
  for (const cat of cats) {
    result.push({ ...cat, subcategories: [] });
    if (cat.subcategories && cat.subcategories.length > 0) {
      flattenCategories(cat.subcategories, result);
    }
  }
  return result;
}

export default function AdminCategories() {
  const { data: categoryTree = [], isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Flatten tree to use for lookups
  const flatCategories = useMemo(() => flattenCategories(categoryTree), [categoryTree]);

  const [expandedCats, setExpandedCats] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addingParentId, setAddingParentId] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSortingId, setIsSortingId] = useState<any | null>(null);

  // States hỗ trợ kéo thả danh mục cùng cấp
  const [draggedCatId, setDraggedCatId] = useState<any | null>(null);
  const [draggedParentId, setDraggedParentId] = useState<any | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#C8954A',
    parentId: 'root' as string,
  });

  const toggleCategory = (id: any) => {
    setExpandedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectedCat = flatCategories.find((c) => c.id === selectedCatId);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name, slug: toSlug(name) }));
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

  const handleAddRootClick = () => {
    setSelectedCatId(null);
    setIsAdding(true);
    setAddingParentId(null);
    setFormData({ name: '', slug: '', color: '#C8954A', parentId: 'root' });
  };

  const handleAddSubClick = (parentCat: Category) => {
    setSelectedCatId(null);
    setIsAdding(true);
    setAddingParentId(parentCat.id);
    setFormData({ name: '', slug: '', color: '#C8954A', parentId: parentCat.id });
    // Auto expand parent
    setExpandedCats((prev) => Array.from(new Set([...prev, parentCat.id])));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parentId = formData.parentId === 'root' ? null : String(formData.parentId);
      const payload = {
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        parentId,
      };

      if (isAdding) {
        await createCategory.mutateAsync(payload);
        setIsAdding(false);
      } else if (selectedCatId !== null) {
        await updateCategory.mutateAsync({ id: selectedCatId, data: payload });
        setSelectedCatId(null);
      }
      setFormData({ name: '', slug: '', color: '#C8954A', parentId: 'root' });
    } catch (err: any) {
      alert(err.message || 'Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"? Thao tác này không thể hoàn tác.`)) return;
    setDeletingId(id);
    try {
      await deleteCategory.mutateAsync(id);
      if (selectedCatId === id) setSelectedCatId(null);
    } catch (err: any) {
      alert(err.message || 'Xóa thất bại. Danh mục có thể đang có sản phẩm.');
    } finally {
      setDeletingId(null);
    }
  };

  // Logic hoán đổi vị trí danh mục cùng cấp (Lên / Xuống)
  const handleMoveCategory = async (cat: Category, direction: 'up' | 'down') => {
    if (isSortingId) return;

    // 1. Tìm toàn bộ các danh mục cùng cấp (có cùng parentId)
    const siblings = flatCategories
      .filter((c) => c.parentId === cat.parentId)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    // 2. Tìm index của danh mục hiện tại trong danh sách cùng cấp
    const index = siblings.findIndex((c) => c.id === cat.id);
    if (index === -1) return;

    // 3. Xác định target để hoán đổi
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetCat = siblings[targetIndex];

    setIsSortingId(cat.id);
    try {
      const currentPos = cat.position !== undefined ? cat.position : 0;
      const targetPos = targetCat.position !== undefined ? targetCat.position : 0;

      let newCurrentPos = targetPos;
      let newTargetPos = currentPos;

      // Nếu position trùng nhau, tăng hoặc giảm để phân cấp rõ ràng
      if (newCurrentPos === newTargetPos) {
        if (direction === 'up') {
          newCurrentPos = Math.max(0, targetPos - 10);
          newTargetPos = targetPos + 10;
        } else {
          newCurrentPos = targetPos + 10;
          newTargetPos = Math.max(0, targetPos - 10);
        }
      }

      // Cập nhật đồng thời vị trí mới lên database qua React Query
      await Promise.all([
        updateCategory.mutateAsync({
          id: cat.id,
          data: { position: newCurrentPos },
        }),
        updateCategory.mutateAsync({
          id: targetCat.id,
          data: { position: newTargetPos },
        }),
      ]);
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi thay đổi thứ tự danh mục.');
    } finally {
      setIsSortingId(null);
    }
  };

  // Xử lý sự kiện kéo thả (Drag and Drop)
  const handleDragStart = (e: React.DragEvent, cat: Category) => {
    setDraggedCatId(cat.id);
    setDraggedParentId(cat.parentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetCat: Category) => {
    e.preventDefault();
    if (draggedCatId !== null && targetCat.parentId === draggedParentId && targetCat.id !== draggedCatId) {
      setDragOverCatId(targetCat.id);
    }
  };

  const handleDragLeave = () => {
    setDragOverCatId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCat: Category) => {
    e.preventDefault();
    if (draggedCatId === null || targetCat.parentId !== draggedParentId || targetCat.id === draggedCatId) {
      setDraggedCatId(null);
      setDraggedParentId(null);
      setDragOverCatId(null);
      return;
    }

    const siblings = flatCategories
      .filter((c) => c.parentId === draggedParentId)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    const draggedIndex = siblings.findIndex((c) => c.id === draggedCatId);
    const targetIndex = siblings.findIndex((c) => c.id === targetCat.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedCatId(null);
      setDraggedParentId(null);
      setDragOverCatId(null);
      return;
    }

    setIsSortingId(draggedCatId);
    setDraggedCatId(null);
    setDraggedParentId(null);
    setDragOverCatId(null);

    try {
      const newSiblings = [...siblings];
      const [removed] = newSiblings.splice(draggedIndex, 1);
      newSiblings.splice(targetIndex, 0, removed);

      const updatePromises = newSiblings.map((cat, idx) => {
        const newPos = (idx + 1) * 10;
        if (cat.position !== newPos) {
          return updateCategory.mutateAsync({
            id: cat.id,
            data: { position: newPos },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sắp xếp thứ tự kéo thả.');
    } finally {
      setIsSortingId(null);
    }
  };

  // Get flat list for the parent select dropdown (exclude current editing cat)
  const selectOptions = flatCategories.filter((c) => c.id !== selectedCatId);

  // Recursive render from tree
  const renderTree = (cats: Category[], level = 0) => {
    // Sắp xếp các phần tử trước khi render để đảm bảo đúng vị trí
    const sortedCats = [...cats].sort((a, b) => (a.position || 0) - (b.position || 0));

    return (
      <div className={level > 0 ? 'pl-5 border-l border-[#E8E0D5]/50 mt-1 space-y-1' : 'space-y-2'}>
        {sortedCats.map((cat, index) => {
          const children = cat.subcategories || [];
          const hasChildren = children.length > 0;
          const isExpanded = expandedCats.includes(cat.id);
          const isSelected = selectedCatId === cat.id;
          const isCurrentSorting = isSortingId === cat.id;
          const isDragOver = dragOverCatId === cat.id;

          return (
            <div key={cat.id}>
              <div
                draggable={isSortingId === null}
                onDragStart={(e) => handleDragStart(e, cat)}
                onDragOver={(e) => handleDragOver(e, cat)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, cat)}
                onDragEnd={() => {
                  setDraggedCatId(null);
                  setDraggedParentId(null);
                  setDragOverCatId(null);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer group transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#C8954A]/10 border border-[#C8954A]/30'
                    : 'hover:bg-[#FAF7F2] border border-transparent'
                } ${isCurrentSorting ? 'opacity-60 animate-pulse' : ''} ${
                  isDragOver ? 'border-2 border-dashed border-[#C8954A] bg-[#C8954A]/5 scale-[1.01]' : ''
                }`}
                onClick={() => {
                  handleEditClick(cat);
                  if (hasChildren) toggleCategory(cat.id);
                }}
              >
                {/* Drag Handle 3 gạch */}
                <span
                  className="p-1 -ml-1 text-gray-300 hover:text-[#C8954A] cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors"
                  title="Nhấn giữ để kéo sắp xếp"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="w-4 h-4" />
                </span>

                {/* Expand/Collapse Icon */}
                <span className="w-5 flex-shrink-0 text-gray-400">
                  {hasChildren ? (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  ) : (
                    <span className="w-4" />
                  )}
                </span>

                {/* Color dot */}
                {cat.color && (
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                )}

                <span className="flex-1 font-semibold text-gray-700 text-sm">{cat.name}</span>
                <span className="text-xs px-2 py-0.5 bg-[#FAF7F2] rounded-full text-gray-500 border border-gray-100 flex-shrink-0">
                  {children.length} con
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Nút di chuyển lên */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveCategory(cat, 'up');
                    }}
                    disabled={index === 0 || isSortingId !== null}
                    title="Di chuyển lên"
                    className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#C8954A] transition-colors cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Nút di chuyển xuống */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveCategory(cat, 'down');
                    }}
                    disabled={index === sortedCats.length - 1 || isSortingId !== null}
                    title="Di chuyển xuống"
                    className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#C8954A] transition-colors cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddSubClick(cat); }}
                    title="Thêm danh mục con"
                    className="p-1 hover:bg-white rounded text-[#C8954A] transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditClick(cat); }}
                    title="Chỉnh sửa"
                    className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat.id, cat.name); }}
                    title="Xóa danh mục"
                    disabled={deletingId === cat.id}
                    className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {deletingId === cat.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {hasChildren && isExpanded && renderTree(children, level + 1)}
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
            <h3 className="font-bold text-[#1E3A5F] text-lg">Phân cấp danh mục</h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng: <strong>{flatCategories.length}</strong> danh mục
            </p>
          </div>
          <button
            onClick={handleAddRootClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] cursor-pointer transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Thêm thẻ gốc
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-[#C8954A] animate-spin" />
            <p className="text-sm text-[#888888]">Đang tải danh mục...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">Không thể tải danh mục</p>
            <button onClick={() => refetch()} className="ml-auto text-xs px-3 py-1 bg-red-500 text-white rounded cursor-pointer">Thử lại</button>
          </div>
        )}

        {/* Tree */}
        {!isLoading && !isError && (
          <div className="space-y-2 select-none">
            {renderTree(categoryTree)}
            {categoryTree.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold">Chưa có danh mục nào</p>
                <p className="text-xs mt-1">Nhấn &quot;Thêm thẻ gốc&quot; để bắt đầu</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editing / Adding Panel (Right Column) */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30 self-start sticky top-24">
        {isAdding || selectedCatId !== null ? (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-[#1E3A5F] text-lg border-b border-[#E8E0D5]/50 pb-3">
              {isAdding
                ? addingParentId
                  ? `Thêm con của: ${flatCategories.find((c) => c.id === addingParentId)?.name}`
                  : 'Thêm danh mục gốc'
                : `Chỉnh sửa: ${selectedCat?.name}`}
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Tên danh mục *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên danh mục..."
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                placeholder="slug-tinh-gon"
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1E3A5F]">Danh mục cha</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((p) => ({ ...p, parentId: e.target.value }))}
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
                      onClick={() => setFormData((p) => ({ ...p, color }))}
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
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-all font-bold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSaving ? 'Đang lưu...' : 'Lưu lại'}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setSelectedCatId(null); }}
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
              Bấm vào danh mục để chỉnh sửa, hoặc nhấn &quot;Thêm thẻ gốc&quot; để tạo mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
