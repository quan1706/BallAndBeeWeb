import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

async function run() {
  console.log('🔌 Đang tìm cấu hình kết nối từ .env.local...');
  
  let envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) envPath = path.resolve('frontend', '.env.local');
  if (!fs.existsSync(envPath)) envPath = path.resolve('../.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Không tìm thấy file .env.local ở bất kỳ thư mục nào!');
    process.exit(1);
  }
  
  console.log(`✅ Tìm thấy file cấu hình tại: ${envPath}`);
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  
  if (!dbUrlMatch) {
    console.error('❌ Không tìm thấy biến DATABASE_URL trong file .env.local!');
    process.exit(1);
  }
  
  const connectionString = dbUrlMatch[1];
  
  console.log('🔌 Đang kết nối trực tiếp tới PostgreSQL database trên Supabase...');
  
  // Khởi tạo client kết nối (Supabase yêu cầu SSL)
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Đã kết nối thành công!');
    console.log('🚀 Đang tiến hành reset mật khẩu của các tài khoản Admin về "admin"...');
    
    // Câu lệnh SQL cập nhật mật khẩu của admin
    const resetSql = `
      DO $$
      DECLARE
        hashed_password text := crypt('admin123', gen_salt('bf', 10));
      BEGIN
        -- Đảm bảo extension pgcrypto đã được kích hoạt
        CREATE EXTENSION IF NOT EXISTS pgcrypto;

        -- 1. Reset mật khẩu cho ballandbee@gmail.com
        IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'ballandbee@gmail.com') THEN
          UPDATE auth.users 
          SET encrypted_password = hashed_password,
              updated_at = now()
          WHERE email = 'ballandbee@gmail.com';
          RAISE NOTICE 'Đã khôi phục mật khẩu tài khoản ballandbee@gmail.com về "admin123"';
        ELSE
          RAISE NOTICE 'Không tìm thấy tài khoản ballandbee@gmail.com';
        END IF;

        -- 2. Reset mật khẩu cho admin@gmail.com
        IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
          UPDATE auth.users 
          SET encrypted_password = hashed_password,
              updated_at = now()
          WHERE email = 'admin@gmail.com';
          RAISE NOTICE 'Đã khôi phục mật khẩu tài khoản admin@gmail.com về "admin123"';
        ELSE
          RAISE NOTICE 'Không tìm thấy tài khoản admin@gmail.com';
        END IF;
      END $$;
    `;
    
    await client.query(resetSql);
    
    console.log('\n========================================================================');
    console.log('🎉 THÀNH CÔNG! ĐÃ KHÔI PHỤC MẬT KHẨU CÁC TÀI KHOẢN ADMIN VỀ MẶC ĐỊNH: "admin"');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('\n❌ ĐÃ CÓ LỖI XẢY RA KHI RESET MẬT KHẨU:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Đã đóng kết nối database.');
  }
}

run();
