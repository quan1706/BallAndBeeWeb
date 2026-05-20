'use client';

import { useCallback, useState } from 'react';
import { Upload, X, ImageIcon, CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import { useImageKitUpload, UploadedImage, getOptimizedImageUrl } from '@/lib/useImageKitUpload';

interface ImageUploadZoneProps {
  folder?: string;
  maxImages?: number;
  value?: string[];             // Existing image URLs
  onChange?: (urls: string[]) => void;
  onMainImageChange?: (url: string) => void;
}

export function ImageUploadZone({
  folder = '/ballandbee/products',
  maxImages = 6,
  value = [],
  onChange,
  onMainImageChange,
}: ImageUploadZoneProps) {
  const { uploadFile, uploadedImages, removeImage, progress, resetProgress } = useImageKitUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string>(value[0] || '');

  // Combine existing external URLs + newly uploaded
  const allImages: UploadedImage[] = [
    ...value.map((url, i) => ({
      url,
      fileId: `existing-${i}`,
      name: url.split('/').pop() || 'image',
      thumbnailUrl: url,
    })),
    ...uploadedImages,
  ];

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      for (const file of files.slice(0, maxImages - allImages.length)) {
        const result = await uploadFile(file, folder);
        if (result && allImages.length === 0 && !mainImageUrl) {
          setMainImageUrl(result.url);
          onMainImageChange?.(result.url);
        }
        onChange?.([...value, ...(result ? [result.url] : [])]);
      }
      resetProgress();
    },
    [uploadFile, folder, allImages.length, maxImages, value, onChange, onMainImageChange, mainImageUrl, resetProgress]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      for (const file of files.slice(0, maxImages - allImages.length)) {
        const result = await uploadFile(file, folder);
        if (result) {
          const newUrls = [...value, result.url];
          onChange?.(newUrls);
          if (!mainImageUrl) {
            setMainImageUrl(result.url);
            onMainImageChange?.(result.url);
          }
        }
      }
      resetProgress();
      e.target.value = '';
    },
    [uploadFile, folder, allImages.length, maxImages, value, onChange, onMainImageChange, mainImageUrl, resetProgress]
  );

  const handleSetMain = (url: string) => {
    setMainImageUrl(url);
    onMainImageChange?.(url);
  };

  const handleRemove = (img: UploadedImage) => {
    removeImage(img.fileId);
    const newUrls = value.filter((u) => u !== img.url);
    onChange?.(newUrls);
    if (mainImageUrl === img.url) {
      setMainImageUrl(newUrls[0] || '');
      onMainImageChange?.(newUrls[0] || '');
    }
  };

  const isUploading = progress.status === 'uploading';
  const canUploadMore = allImages.length < maxImages && !isUploading;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canUploadMore && (
        <label htmlFor="imagekit-upload-input">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? 'border-[#C8954A] bg-[#FFF8EF] scale-[1.01] shadow-lg shadow-[#C8954A]/10'
                : 'border-[#E8E0D5] hover:border-[#C8954A] hover:bg-[#FAF7F2]/60'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-12 h-12 text-[#C8954A] animate-spin" />
                <p className="text-sm font-semibold text-[#C8954A]">
                  Đang tải lên CDN ImageKit...
                </p>
                {/* Progress bar */}
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8954A] to-[#E8B86D] rounded-full transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{progress.percent}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] flex items-center justify-center group-hover:bg-[#C8954A]/10 transition-colors">
                  <Upload className="w-7 h-7 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E3A5F] group-hover:text-[#C8954A] transition-colors">
                    Kéo thả ảnh vào đây
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    hoặc <span className="text-[#C8954A] underline font-semibold">click để chọn file</span>
                  </p>
                  <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-wider">
                    PNG, JPG, WEBP · Tối đa {maxImages} ảnh · Tự động tối ưu CDN
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {progress.status === 'error' && (
              <div className="mt-3 flex items-center gap-2 justify-center text-red-500">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-medium">{progress.error}</p>
              </div>
            )}
          </div>
          <input
            id="imagekit-upload-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}

      {/* Image Grid Preview */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {allImages.map((img) => {
            const isMain = img.url === mainImageUrl;
            const thumbUrl = getOptimizedImageUrl(img.url, { width: 200, height: 200, quality: 75 });
            return (
              <div
                key={img.fileId}
                className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                  isMain
                    ? 'border-[#C8954A] shadow-lg shadow-[#C8954A]/20 ring-2 ring-[#C8954A]/30'
                    : 'border-[#E8E0D5] hover:border-[#C8954A]/50'
                }`}
              >
                <Image
                  src={thumbUrl || img.url}
                  alt={img.name}
                  fill
                  className="object-cover"
                  unoptimized={!img.url.includes('imagekit.io')}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Set as main */}
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(img.url)}
                      title="Đặt làm ảnh đại diện"
                      className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-[#C8954A] hover:text-white transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemove(img)}
                    title="Xóa ảnh"
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main badge */}
                {isMain && (
                  <div className="absolute top-2 left-2 bg-[#C8954A] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Đại diện
                  </div>
                )}

                {/* Uploaded badge */}
                {img.url.includes('imagekit.io') && (
                  <div className="absolute bottom-2 right-2 bg-green-500/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <CheckCircle className="w-2.5 h-2.5" />
                    CDN
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more slot */}
          {allImages.length < maxImages && !isUploading && (
            <label
              htmlFor="imagekit-upload-input"
              className="aspect-square rounded-xl border-2 border-dashed border-[#E8E0D5] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C8954A] hover:bg-[#FAF7F2]/50 transition-all"
            >
              <ImageIcon className="w-6 h-6 text-gray-300" />
              <span className="text-[10px] text-gray-300 font-medium">Thêm ảnh</span>
            </label>
          )}
        </div>
      )}

      {/* CDN info */}
      {allImages.some((img) => img.url.includes('imagekit.io')) && (
        <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
          <CheckCircle className="w-3 h-3" />
          Ảnh được lưu trữ và tối ưu hóa tự động qua ImageKit CDN
          — tải siêu nhanh, nén thông minh, thân thiện SEO
        </p>
      )}
    </div>
  );
}
