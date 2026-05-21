-- =========================================================================
-- SCHEMA SỬ DỤNG CHO DỰ ÁN BALL & BEE WEB (SUPABASE POSTGRESQL)
-- File này định nghĩa cấu trúc dữ liệu hoàn chỉnh của hệ thống E-Commerce
-- cùng với chính sách bảo mật RLS (Row Level Security) chuẩn dành cho Admin
-- =========================================================================

-- Kích hoạt extension sinh UUID ngẫu nhiên nếu chưa được kích hoạt
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- XÓA CÁC BẢNG CŨ (Nếu có xung đột cấu trúc)
drop table if exists contact_messages cascade;
drop table if exists system_settings cascade;
drop table if exists blog_posts cascade;
drop table if exists product_images cascade;
drop table if exists products cascade;
drop table if exists categories cascade;

-- ============================================================
-- 1. TẠO BẢNG CATEGORIES (Danh mục sản phẩm)
-- ============================================================
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  color text,
  parent_id uuid references categories(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 2. TẠO BẢNG PRODUCTS (Sản phẩm)
-- ============================================================
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  slug text unique not null,
  material text,
  size text,
  origin text,
  tags text[],
  is_featured boolean default false,
  is_new boolean default true,
  is_visible boolean default true,
  category_id uuid references categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 3. TẠO BẢNG PRODUCT_IMAGES (Liên kết ảnh sản phẩm từ ImageKit)
-- ============================================================
create table product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  image_path text not null,
  file_id text not null,
  is_primary boolean default false,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 4. TẠO BẢNG BLOG_POSTS (Bài viết tin tức/blog)
-- ============================================================
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  topic text not null,
  topic_slug text not null,
  excerpt text,
  content text not null,
  read_time text,
  image text,
  is_featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 5. TẠO BẢNG SYSTEM_SETTINGS (Cài đặt cấu hình hệ thống)
-- ============================================================
create table system_settings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  tagline text,
  description text,
  phone text,
  zalo text,
  email text,
  address text,
  hours text,
  facebook text,
  instagram text,
  tiktok text,
  google_maps_embed text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 6. TẠO BẢNG CONTACT_MESSAGES (Tin nhắn liên hệ từ khách hàng)
-- ============================================================
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- BẬT TÍNH NĂNG BẢO MẬT RLS (ROW LEVEL SECURITY)
-- =========================================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table blog_posts enable row level security;
alter table system_settings enable row level security;
alter table contact_messages enable row level security;

-- =========================================================================
-- THIẾT LẬP CHÍNH SÁCH TRUY CẬP (POLICIES) DÀNH CHO ADMIN & PUBLIC
-- =========================================================================

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG CATEGORIES
-- ------------------------------------------------------------
create policy "Allow public read access to categories" on categories
  for select using (true);

create policy "Allow authenticated modify to categories" on categories
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG PRODUCTS
-- ------------------------------------------------------------
create policy "Allow public read access to products" on products
  for select using (true);

create policy "Allow authenticated modify to products" on products
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG PRODUCT_IMAGES
-- ------------------------------------------------------------
create policy "Allow public read access to product_images" on product_images
  for select using (true);

create policy "Allow authenticated modify to product_images" on product_images
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG BLOG_POSTS
-- ------------------------------------------------------------
create policy "Allow public read access to blog_posts" on blog_posts
  for select using (true);

create policy "Allow authenticated modify to blog_posts" on blog_posts
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG SYSTEM_SETTINGS
-- ------------------------------------------------------------
create policy "Allow public read access to system_settings" on system_settings
  for select using (true);

create policy "Allow authenticated modify to system_settings" on system_settings
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- CHÍNH SÁCH BẢNG CONTACT_MESSAGES
-- ------------------------------------------------------------
-- Cho phép khách hàng vãng lai (Public/Anon) được gửi tin nhắn liên hệ lên hệ thống
create policy "Allow public insert to contact_messages" on contact_messages
  for insert with check (true);

-- Chỉ cho phép Admin đã xác thực (Authenticated) được xem và xử lý tin nhắn liên hệ
create policy "Allow authenticated modify to contact_messages" on contact_messages
  for all to authenticated using (true) with check (true);
