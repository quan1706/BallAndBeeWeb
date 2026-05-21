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
  
  console.log('🔌 Đang kết nối trực tiếp tới database để kiểm tra tài khoản...');
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Đã kết nối thành công!');
    
    // Kiểm tra bảng auth.users
    const res = await client.query(`
      SELECT id, email, email_confirmed_at, last_sign_in_at, created_at 
      FROM auth.users;
    `);
    
    console.log('\n📊 DANH SÁCH TOÀN BỘ TÀI KHOẢN TRONG DATABASE (BẢNG auth.users):');
    if (res.rows.length === 0) {
      console.log('❌ DATABASE TRỐNG - Không có bất kỳ tài khoản nào!');
    } else {
      console.table(res.rows);
    }

    // Kiểm tra thêm bảng auth.identities
    const resIdentities = await client.query(`
      SELECT id, user_id, provider, identity_data 
      FROM auth.identities
      WHERE user_id IN (
        SELECT id FROM auth.users WHERE email IN ('ballandbee@gmail.com', 'admin@gmail.com')
      );
    `);
    console.log('\n📊 THÔNG TIN LIÊN KẾT IDENTITIES:');
    if (resIdentities.rows.length === 0) {
      console.log('⚠️ CẢNH BÁO: Không tìm thấy liên kết danh tính (identities). Supabase Auth bắt buộc phải có bản ghi trong bảng auth.identities để có thể đăng nhập bằng email!');
    } else {
      console.table(resIdentities.rows);
    }
    
  } catch (err) {
    console.error('❌ ĐÃ CÓ LỖI XẢY RA KHI TRUY VẤN:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Đã đóng kết nối database.');
  }
}

run();
