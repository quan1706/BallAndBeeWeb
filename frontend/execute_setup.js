import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

async function run() {
  console.log('🔌 Đang đọc cấu hình kết nối từ .env.local...');
  
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Không tìm thấy file .env.local!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  
  if (!dbUrlMatch) {
    console.error('❌ Không tìm thấy biến DATABASE_URL trong file .env.local!');
    process.exit(1);
  }
  
  const connectionString = dbUrlMatch[1];
  
  // Đọc file SQL setup
  const sqlPath = path.resolve('src/lib/supabase_setup.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Không tìm thấy file supabase_setup.sql tại src/lib/!');
    process.exit(1);
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
  
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
    console.log('🚀 Đang tự động thực thi các câu lệnh SQL thiết lập RLS & chèn Admin...');
    
    // Thực thi script SQL
    await client.query(sqlContent);
    
    console.log('\n========================================================================');
    console.log('🎉 THÀNH CÔNG! ĐÃ NẠP TÀI KHOẢN ADMIN & THIẾT LẬP RLS LÊN SUPABASE!');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('\n❌ ĐÃ CÓ LỖI XẢY RA KHI THỰC THI SQL:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Đã đóng kết nối database.');
  }
}

run();
