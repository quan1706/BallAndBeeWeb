interface ImageKitLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

// Hàm Loader cho component <Image /> của Next.js
// Giúp tự động nén, đổi định dạng và resize ảnh ngay từ CDN của ImageKit
export default function imagekitLoader({ src, width, quality }: ImageKitLoaderProps): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (!endpoint) {
    console.warn('Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.local');
    return src;
  }

  let formattedSrc = src;

  // Nếu src là đường dẫn tương đối (ví dụ: /san-pham/ao.jpg) thì ghép với endpoint
  if (src.startsWith('/')) {
    // Tránh trùng lặp dấu gạch chéo
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    formattedSrc = `${cleanEndpoint}${src}`;
  }

  // Nếu không phải ảnh từ ImageKit thì trả về src gốc
  if (!formattedSrc.includes(endpoint)) {
    return formattedSrc;
  }

  // Tách các query parameters sẵn có (nếu có)
  const urlParts = formattedSrc.split('?');
  const baseUrl = urlParts[0];
  const existingParams = urlParts[1] ? `&${urlParts[1]}` : '';

  // Tạo các tham số transformation cho ImageKit
  // - w: thay đổi chiều rộng tương ứng với layout
  // - q: nén ảnh xuống mức phù hợp (mặc định 80)
  // - f-auto: tự động phát hiện trình duyệt để đổi sang định dạng tối ưu WebP/AVIF
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  } else {
    params.push('q-80');
  }
  params.push('f-auto');

  const ikTransform = `tr=${params.join(',')}`;

  return `${baseUrl}?${ikTransform}${existingParams}`;
}
