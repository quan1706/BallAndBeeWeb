import { NextResponse } from 'next/server';
import crypto from 'crypto';

// API Route phục vụ Client-side Upload của ImageKit
// Trình duyệt sẽ gọi API này để lấy Signature bảo mật được ký bằng Private Key từ Server
export async function GET() {
  try {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    // Kiểm tra xem đã cấu hình đầy đủ biến môi trường chưa
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error('Missing ImageKit environment variables');
      return NextResponse.json(
        { error: 'ImageKit is not configured properly on the server' },
        { status: 500 }
      );
    }

    // Sinh token ngẫu nhiên (UUID) và thời gian hết hạn (Unix timestamp tính bằng giây, hiệu lực 30 phút)
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 1800; 

    // Ký thuật toán HMAC-SHA1 theo chuẩn bảo mật của ImageKit
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire.toString())
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature,
    });
  } catch (error: any) {
    console.error('Failed to generate ImageKit auth signature:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
