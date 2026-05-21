-- =========================================================================
-- SCRIPT CẤU HÌNH SUPABASE CHO DỰ ÁN BALL & BEE (CHẠY TRÊN SQL EDITOR)
-- Hướng dẫn: Copy toàn bộ nội dung file này, dán vào SQL Editor trên
-- Supabase Dashboard (https://supabase.com) và nhấn RUN.
-- =========================================================================

-- ------------------------------------------------------------
-- BƯỚC 1: KÍCH HOẠT EXTENSION MÃ HÓA BĂM BCRYPT
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- BƯỚC 2: KHỞI TẠO 2 TÀI KHOẢN ADMIN TRÊN SUPABASE AUTH
-- Tài khoản 1: ballandbee@gmail.com | Mật khẩu: admin
-- Tài khoản 2: admin@gmail.com       | Mật khẩu: admin
-- ------------------------------------------------------------
DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  hashed_password text := crypt('admin', gen_salt('bf', 10));
BEGIN
  -- 1. Tạo tài khoản ballandbee@gmail.com nếu chưa tồn tại
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ballandbee@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    ) VALUES (
      user1_id,
      '00000000-0000-0000-0000-000000000000',
      'ballandbee@gmail.com',
      hashed_password,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      user1_id,
      user1_id,
      json_build_object('sub', user1_id, 'email', 'ballandbee@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'Đã chèn tài khoản ballandbee@gmail.com thành công!';
  ELSE
    RAISE NOTICE 'Tài khoản ballandbee@gmail.com đã tồn tại.';
  END IF;

  -- 2. Tạo tài khoản admin@gmail.com nếu chưa tồn tại
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    ) VALUES (
      user2_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@gmail.com',
      hashed_password,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      user2_id,
      user2_id,
      json_build_object('sub', user2_id, 'email', 'admin@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'Đã chèn tài khoản admin@gmail.com thành công!';
  ELSE
    RAISE NOTICE 'Tài khoản admin@gmail.com đã tồn tại.';
  END IF;
END $$;

-- ------------------------------------------------------------
-- BƯỚC 3: XÓA CÁC CHÍNH SÁCH RLS CŨ DƯ THỪA ĐỂ TRÁNH TRÙNG LẶP
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated modify to products" ON products;
DROP POLICY IF EXISTS "Allow public read access to product_images" ON product_images;
DROP POLICY IF EXISTS "Allow authenticated modify to product_images" ON product_images;
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated modify to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated modify to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public read access to system_settings" ON system_settings;
DROP POLICY IF EXISTS "Allow authenticated modify to system_settings" ON system_settings;
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated modify to contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow anon update to system_settings" ON system_settings;

-- ------------------------------------------------------------
-- BƯỚC 4: BẬT RLS (ROW LEVEL SECURITY) CHO TOÀN BỘ CÁC BẢNG
-- ------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- BƯỚC 5: THIẾT LẬP CHÍNH SÁCH BẢO MẬT MỚI TỐI ƯU CHO ADMIN
-- ------------------------------------------------------------

-- A. BẢNG CATEGORIES (Danh mục)
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modify to categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- B. BẢNG PRODUCTS (Sản phẩm)
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modify to products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- C. BẢNG PRODUCT_IMAGES (Ảnh sản phẩm)
CREATE POLICY "Allow public read access to product_images" ON product_images
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modify to product_images" ON product_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- D. BẢNG BLOG_POSTS (Bài viết blog)
CREATE POLICY "Allow public read access to blog_posts" ON blog_posts
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modify to blog_posts" ON blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- E. BẢNG SYSTEM_SETTINGS (Cài đặt cấu hình)
CREATE POLICY "Allow public read access to system_settings" ON system_settings
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modify to system_settings" ON system_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- F. BẢNG CONTACT_MESSAGES (Tin nhắn liên hệ)
-- Cho phép khách hàng gửi tin nhắn ẩn danh từ trang liên hệ
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
-- Chỉ cho phép Admin xem và quản lý tin nhắn
CREATE POLICY "Allow authenticated modify to contact_messages" ON contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- HOÀN TẤT THIẾT LẬP CƠ SỞ DỮ LIỆU BẢO MẬT SUPABASE THÀNH CÔNG!
-- =========================================================================
