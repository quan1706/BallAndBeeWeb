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
    console.error('❌ Không tìm thấy file .env.local');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  
  if (!dbUrlMatch) {
    console.error('❌ Không tìm thấy biến DATABASE_URL');
    process.exit(1);
  }
  
  const connectionString = dbUrlMatch[1];
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Đã kết nối database thành công!');
    
    console.log('⚙️ Đang thực thi lệnh SQL nâng cấp schema bảng categories...');
    
    // 1. Thêm cột position
    await client.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
    `);
    console.log('🚀 Đã thêm cột "position" (INTEGER) thành công!');
    
    // 2. Khởi tạo position cho các danh mục hiện tại (tăng dần theo created_at và phân nhóm theo parent_id)
    await client.query(`
      WITH ordered_cats AS (
        SELECT id, row_number() OVER (PARTITION BY parent_id ORDER BY created_at ASC) * 10 as row_num
        FROM categories
      )
      UPDATE categories
      SET position = ordered_cats.row_num
      FROM ordered_cats
      WHERE categories.id = ordered_cats.id;
    `);
    console.log('🚀 Đã khởi tạo vị trí sắp xếp position mặc định cho các danh mục hiện tại!');
    
    console.log('🎉 NÂNG CẤP DATABASE THÀNH CÔNG RỰC RỠ!');
    
  } catch (err) {
    console.error('❌ THẤT BẠI KHI THỰC THI SQL:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Đã đóng kết nối database.');
  }
}

run();
