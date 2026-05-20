import { useState, useCallback } from 'react';
import { API_BASE_URL } from './api';

// ImageKit upload configuration
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

export interface UploadedImage {
  url: string;           // Full optimized URL from ImageKit CDN
  fileId: string;        // Unique file ID from ImageKit
  name: string;          // File name stored in ImageKit
  thumbnailUrl: string;  // Auto-generated thumbnail URL
}

export interface UploadProgress {
  percent: number;
  status: 'idle' | 'uploading' | 'done' | 'error';
  error?: string;
}

// Fetch authentication signature from our backend
async function getAuthSignature(): Promise<{
  token: string;
  expire: number;
  signature: string;
}> {
  const res = await fetch(`${API_BASE_URL}/imagekit/auth`);
  if (!res.ok) throw new Error('Failed to get upload authentication');
  return res.json();
}

// Fetch public config (publicKey + urlEndpoint) from backend
async function getImageKitConfig(): Promise<{
  urlEndpoint: string;
  publicKey: string;
  defaultFolder: string;
}> {
  const res = await fetch(`${API_BASE_URL}/imagekit/config`);
  if (!res.ok) throw new Error('Failed to get ImageKit config');
  return res.json();
}

// Generate optimized ImageKit URL with transformation parameters
export function getOptimizedImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!url || !url.includes('imagekit.io')) return url;

  const transforms: string[] = [];
  if (options.width) transforms.push(`w-${options.width}`);
  if (options.height) transforms.push(`h-${options.height}`);
  transforms.push(`q-${options.quality ?? 80}`);
  transforms.push('f-auto'); // Auto format (webp/avif)

  // Insert transformation into ImageKit URL
  const [base, rest] = url.split('/ballandbeehome/');
  if (!rest) return url;
  return `${base}/ballandbeehome/tr:${transforms.join(',')}/${rest}`;
}

export function useImageKitUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    percent: 0,
    status: 'idle',
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const uploadFile = useCallback(
    async (file: File, folder: string = '/ballandbee/products'): Promise<UploadedImage | null> => {
      setProgress({ percent: 0, status: 'uploading' });

      try {
        // Get auth signature from our secure backend
        const [auth, config] = await Promise.all([
          getAuthSignature(),
          getImageKitConfig(),
        ]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
        formData.append('publicKey', config.publicKey);
        formData.append('signature', auth.signature);
        formData.append('expire', auth.expire.toString());
        formData.append('token', auth.token);
        formData.append('folder', folder);
        formData.append('useUniqueFileName', 'true');

        setProgress({ percent: 30, status: 'uploading' });

        const response = await fetch(IMAGEKIT_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        setProgress({ percent: 80, status: 'uploading' });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const data = await response.json();

        const uploaded: UploadedImage = {
          url: data.url,
          fileId: data.fileId,
          name: data.name,
          thumbnailUrl: data.thumbnailUrl || data.url,
        };

        setUploadedImages((prev) => [...prev, uploaded]);
        setProgress({ percent: 100, status: 'done' });

        return uploaded;
      } catch (err: any) {
        setProgress({
          percent: 0,
          status: 'error',
          error: err.message || 'Upload thất bại. Vui lòng thử lại.',
        });
        return null;
      }
    },
    []
  );

  const removeImage = useCallback((fileId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.fileId !== fileId));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ percent: 0, status: 'idle' });
  }, []);

  return {
    uploadFile,
    uploadedImages,
    setUploadedImages,
    removeImage,
    progress,
    resetProgress,
  };
}
