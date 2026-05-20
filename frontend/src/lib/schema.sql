-- =========================================================================
-- SCHEMA SỬ DỤNG CHO DỰ ÁN BALL & BEE WEB (SUPABASE POSTGRESQL)
-- File này định nghĩa cấu trúc dữ liệu lưu trữ sản phẩm và link ảnh từ ImageKit
-- =========================================================================

-- Kích hoạt extension sinh UUID ngẫu nhiên nếu chưa được kích hoạt
create extension if not exists "uuid-ossp";

-- XÓA CÁC BẢNG CŨ (Nếu có xung đột cấu trúc từ Backend .NET cũ)
drop table if exists product_images cascade;
drop table if exists products cascade;
drop table if exists categories cascade; -- Nếu có bảng categories cũ của EF Core

-- 1. TẠO BẢNG PRODUCTS (Lưu thông tin sản phẩm theo chuẩn mới dùng UUID)
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  slug text unique not null,
  material text,                  -- Chất liệu (từ cấu trúc cũ)
  size text,                      -- Kích thước
  origin text,                    -- Xuất xứ
  tags text[],                    -- Mảng các thẻ tìm kiếm
  is_featured boolean default false, -- Sản phẩm nổi bật
  is_new boolean default true,    -- Sản phẩm mới
  is_visible boolean default true, -- Cho phép hiển thị công khai
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TẠO BẢNG PRODUCT_IMAGES (Lưu liên kết hình ảnh sản phẩm từ ImageKit)
create table product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,        -- Link hiển thị đầy đủ (Ví dụ: https://ik.imagekit.io/...)
  image_path text not null,       -- Đường dẫn tương đối trong ImageKit (Ví dụ: /san-pham/ao.jpg)
  file_id text not null,          -- fileId của ImageKit (dùng để xóa file vật lý bằng ImageKit API sau này)
  is_primary boolean default false, -- Ảnh đại diện chính hiển thị trên danh sách sản phẩm
  position integer default 0,     -- Thứ tự hiển thị trong slide ảnh (0, 1, 2...)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BẬT TÍNH NĂNG BẢO MẬT RLS (ROW LEVEL SECURITY)
-- Đây là tính năng bắt buộc của Supabase để kiểm soát truy cập trực tiếp từ client
alter table products enable row level security;
alter table product_images enable row level security;

-- 4. THIẾT LẬP CHÍNH SÁCH TRUY CẬP (POLICIES)

-- Quyền đọc: Mọi người (Public) đều có thể xem sản phẩm và ảnh sản phẩm
create policy "Allow public read access to products" on products
  for select using (true);

create policy "Allow public read access to product_images" on product_images
  for select using (true);

-- Quyền ghi/sửa/xóa: Chỉ cho phép người dùng đã xác thực (Authenticated Users/Admin)
create policy "Allow authenticated modify to products" on products
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated modify to product_images" on product_images
  for all to authenticated using (true) with check (true);
