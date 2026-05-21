import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

async function run() {
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
    console.log('✅ Đã kết nối thành công!');
    
    // Lấy thông tin các cột của bảng categories
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'categories';
    `);
    
    console.log('\n📊 DANH SÁCH CÁC CỘT CỦA BẢNG categories:');
    console.table(res.rows);
    
  } catch (err) {
    console.error('❌ LỖI TRUY VẤN:', err.message);
  } finally {
    await client.end();
  }
}

run();
