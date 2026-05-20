import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import { categories, subcategories } from '../../data/mockData';

export function AdminCategories() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Category Tree */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[#1E3A5F]">Danh sách danh mục</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]">
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const subs = subcategories[category.id] || [];

            return (
              <div key={category.id}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#FAF7F2] cursor-pointer ${
                    selectedCategory === category.id ? 'bg-[#C8954A]/10' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <GripVertical className="w-4 h-4 text-[#888888]" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.id);
                    }}
                    className="p-1"
                  >
                    {subs.length > 0 ? (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 font-medium">{category.name}</span>
                  <span className="text-xs px-2 py-1 bg-[#FAF7F2] rounded-full text-[#888888]">
                    {subs.length}
                  </span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-white rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && subs.length > 0 && (
                  <div className="ml-12 mt-1 space-y-1">
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
                      >
                        <GripVertical className="w-4 h-4 text-[#888888]" />
                        <span className="flex-1 text-sm text-[#888888]">{sub.name}</span>
                        <button className="p-1 hover:bg-white rounded">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Panel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {selectedCat ? (
          <>
            <h3 className="font-semibold text-[#1E3A5F] mb-6">Chỉnh sửa danh mục</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên danh mục</label>
                <input
                  type="text"
                  defaultValue={selectedCat.name}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Danh mục cha</label>
                <select className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none">
                  <option>Là danh mục chính</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Màu đại diện</label>
                <div className="flex gap-2">
                  {['#C8954A', '#1E3A5F', '#E07B54', '#88B04B', '#6B7DB3', '#D4956A'].map(
                    (color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${
                          selectedCat.color === color ? 'ring-2 ring-offset-2 ring-[#C8954A]' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]">
                  Lưu
                </button>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 text-[#888888] hover:text-[#C8954A]"
                >
                  Hủy
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-[#888888]">
            <p>Chọn danh mục để chỉnh sửa</p>
          </div>
        )}
      </div>
    </div>
  );
}
