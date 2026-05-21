const crypto = require('crypto');

// Copy dữ liệu từ mockData.ts
const categoriesRaw = [
  { id: 1, name: 'Nội thất', slug: 'noi-that', color: '#C8954A', parentId: null },
  { id: 2, name: 'Lighting', slug: 'lighting', color: '#1E3A5F', parentId: null },
  { id: 3, name: 'Trang trí', slug: 'trang-tri', color: '#E07B54', parentId: null },
  { id: 4, name: 'Kitchen & Dining', slug: 'kitchen-dining', color: '#88B04B', parentId: null },
  { id: 5, name: 'Souvenir', slug: 'souvenir', color: '#6B7DB3', parentId: null },
  { id: 6, name: 'Đạo cụ chụp hình', slug: 'dao-cu-chup-hinh', color: '#D4956A', parentId: null },

  { id: 11, name: 'Nội thất trong nhà', slug: 'noi-that-trong-nha', parentId: 1 },
  { id: 12, name: 'Nội thất trẻ em', slug: 'noi-that-tre-em', parentId: 1 },
  { id: 13, name: 'Nội thất ngoài trời', slug: 'noi-that-ngoai-troi', parentId: 1 },

  { id: 111, name: 'Sofa & Armchair', slug: 'sofa-armchair', parentId: 11 },
  { id: 112, name: 'Bàn trà & Bàn góc', slug: 'ban-tra-ban-goc', parentId: 11 },
  { id: 113, name: 'Kệ tivi & Tủ trang trí', slug: 'ke-tivi-tu-trang-tri', parentId: 11 },

  { id: 21, name: 'Đèn treo', slug: 'den-treo', parentId: 2 },
  { id: 22, name: 'Đèn bàn', slug: 'den-ban', parentId: 2 },

  { id: 31, name: 'Tranh treo tường', slug: 'tranh-treo-tuong', parentId: 3 },

  { id: 41, name: 'Tableware', slug: 'tableware', parentId: 4 },
  { id: 42, name: 'Serveware', slug: 'serveware', parentId: 4 },
  { id: 43, name: 'Drinkware', slug: 'drinkware', parentId: 4 },

  { id: 411, name: 'Bát đĩa sứ vẽ tay', slug: 'bat-dia-su-ve-tay', parentId: 41 },
  { id: 412, name: 'Bát đĩa gốm mộc', slug: 'bat-dia-gom-moc', parentId: 41 },
];

const productsRaw = [
  {
    name: 'Bàn gỗ me tây',
    price: 650000,
    slug: 'ban-go-me-tay',
    categorySlug: 'noi-that',
    description: 'Bàn gỗ me tây tự nhiên chân gỗ tinh tế, đan xen nét thô mộc và hiện đại.',
    material: 'Gỗ sồi',
    size: '80cm x 80cm x 75cm',
    origin: 'Việt Nam',
    tags: ['eco', 'handmade', 'minimalist'],
    featured: true,
    isNew: true,
    visible: true,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
  },
  {
    name: 'Đèn treo tre đan',
    price: 350000,
    slug: 'den-treo-tre-dan',
    categorySlug: 'lighting',
    description: 'Đèn treo làm hoàn toàn từ tre tự nhiên đan thủ công tỉ mỉ, mang lại ánh sáng vàng ấm cúng.',
    material: 'Tre tự nhiên',
    size: '30cm x 40cm',
    origin: 'Việt Nam',
    tags: ['bamboo', 'handmade', 'eco'],
    featured: true,
    isNew: true,
    visible: true,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
  },
  {
    name: 'Tranh treo tường',
    price: 450000,
    slug: 'tranh-treo-tuong',
    categorySlug: 'trang-tri',
    description: 'Tranh nghệ thuật trừu tượng phong cách Bắc Âu tối giản, in canvas chất lượng cao kèm khung gỗ mộc.',
    material: 'Canvas & Khung gỗ thông',
    size: '50cm x 70cm',
    origin: 'Việt Nam',
    tags: ['minimalist', 'handmade'],
    featured: false,
    isNew: true,
    visible: true,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
  },
  {
    name: 'Đèn bàn hiện đại B&B',
    price: 1250000,
    slug: 'den-ban-hien-dai',
    categorySlug: 'lighting',
    description: 'Đèn bàn thiết kế hiện đại, khung gỗ tự nhiên kết hợp chao đèn vải linen cao cấp.',
    material: 'Gỗ sồi & Vải Linen',
    size: '35cm x 15cm',
    origin: 'Việt Nam',
    tags: ['minimalist', 'handmade'],
    featured: true,
    isNew: true,
    visible: true,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
  },
  {
    name: 'Ghế sofa đơn Scandinavia',
    price: 3450000,
    slug: 'ghe-sofa-2-cho',
    categorySlug: 'noi-that',
    description: 'Ghế sofa đơn phong cách Scandinavia tinh tế, đệm mút chống lún bọc vải nỉ cừu cao cấp chân gỗ tự nhiên.',
    material: 'Vải nỉ cừu & Chân gỗ sồi',
    size: '85cm x 80cm x 85cm',
    origin: 'Việt Nam',
    tags: ['vintage', 'handmade', 'minimalist'],
    featured: true,
    isNew: false,
    visible: true,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  },
  {
    name: 'Đĩa gốm mộc sâu lòng',
    price: 180000,
    slug: 'dia-gom-moc-tron',
    categorySlug: 'kitchen-dining',
    description: 'Đĩa gốm mộc chất liệu bán sứ chịu nhiệt cao, tráng men thô mộc mạc.',
    material: 'Gốm thô mộc',
    size: 'Đường kính 22cm',
    origin: 'Bình Dương, Việt Nam',
    tags: ['ceramic', 'tableware', 'handmade'],
    featured: false,
    isNew: false,
    visible: true,
    image: 'https://images.unsplash.com/photo-1589987607627-616cad1a14e4?w=800',
  },
  {
    name: 'Kệ sách mini gỗ thông mộc',
    price: 580000,
    slug: 'ke-sach-mini-go-thong',
    categorySlug: 'noi-that',
    description: 'Kệ sách để bàn mini nhiều ngăn thông minh làm bằng gỗ thông sấy tự nhiên chà nhám mịn, có phủ bóng nhẹ.',
    material: 'Gỗ thông tự nhiên',
    size: '45cm x 20cm x 35cm',
    origin: 'Việt Nam',
    tags: ['minimalist', 'handmade', 'eco'],
    featured: true,
    isNew: true,
    visible: true,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
  },
];

const blogPostsRaw = [
  {
    title: 'Cách bày trí phòng khách phong cách tối giản',
    slug: 'cach-bay-tri-phong-khach-phong-cach-toi-gian',
    topic: 'Hướng dẫn bày trí',
    topicSlug: 'huong-dan-bay-tri',
    excerpt: 'Khám phá cách tạo không gian phòng khách thoáng đãng, tinh tế với phong cách tối giản hiện đại.',
    content: '<p>Nội dung bài viết cách bày trí phòng khách phong cách tối giản đầy đủ...</p>',
    read_time: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    is_featured: true,
    status: 'published',
  },
  {
    title: '10 món đồ trang trí không thể thiếu trong nhà',
    slug: '10-mon-do-trang-tri-khong-the-thieu-trong-nha',
    topic: 'Phong cách sống',
    topicSlug: 'phong-cach-song',
    excerpt: 'Những món đồ trang trí thiết yếu giúp ngôi nhà của bạn trở nên ấm cúng và đầy cá tính hơn.',
    content: '<p>Nội dung bài viết 10 món đồ trang trí thiết yếu...</p>',
    read_time: '7 phút đọc',
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800',
    is_featured: false,
    status: 'published',
  },
  {
    title: 'Xu hướng nội thất 2026',
    slug: 'xu-huong-noi-that-2026',
    topic: 'Tin tức',
    topicSlug: 'tin-tuc',
    excerpt: 'Cập nhật những xu hướng nội thất mới nhất năm 2026 từ các chuyên gia thiết kế hàng đầu.',
    content: '<p>Nội dung bài viết xu hướng nội thất 2026...</p>',
    read_time: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    is_featured: true,
    status: 'published',
  },
];

const companyInfoRaw = {
  name: "BallAndBee'sHome",
  tagline: 'Không gian sống - Tinh tế từng chi tiết',
  description: 'Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại.',
  phone: '0901 234 567',
  zalo: '0901 234 567',
  email: 'hello@ballandbeehome.com',
  address: '123 Nguyễn Văn Linh, Đà Nẵng',
  hours: 'Thứ 2–7, 8:00–18:00',
  facebook: 'https://facebook.com/ballandbeehome',
  instagram: 'https://instagram.com/ballandbeehome',
  tiktok: 'https://tiktok.com/@ballandbeehome',
  google_maps_embed: ''
};

// Cấu hình kết nối Supabase
const supabaseUrl = 'https://bfuiditvfwlwatnzrujj.supabase.co';
// BẮT BUỘC: Sử dụng Service Role Key hoặc Key có quyền ghi.
// Nếu không có Service Role Key ở đây, ta sẽ thử dùng anonKey (yêu cầu tắt RLS tạm thời).
let supabaseKey = 'sb_publishable_DJcm-mf4m66HEBJDnenqLA_KGRWURCE';

// Nhận key từ tham số dòng lệnh nếu có (ví dụ: node seed.cjs YOUR_SERVICE_ROLE_KEY)
if (process.argv[2]) {
  supabaseKey = process.argv[2];
  console.log('Sử dụng Supabase Key được truyền vào từ tham số dòng lệnh.');
} else {
  console.log('Sử dụng Anon Key mặc định (Yêu cầu TẮT RLS trên Supabase Dashboard để chạy thành công).');
}

async function apiRequest(path, method, body = null) {
  const url = `${supabaseUrl}/rest/v1/${path}`;
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP Error ${response.status} on ${method} ${path}: ${text}`);
  }
  return await response.json();
}

async function seed() {
  console.log('=== BẮT ĐẦU SEED DỮ LIỆU LÊN SUPABASE ===');

  try {
    // 1. Tạo Map UUID cho Categories
    console.log('1. Đang chuẩn bị dữ liệu Categories...');
    const catIdToUuid = {};
    
    // Gán UUID local cho từng category để giữ quan hệ cha con
    categoriesRaw.forEach(cat => {
      catIdToUuid[cat.id] = crypto.randomUUID();
    });

    const categoriesToInsert = categoriesRaw.map(cat => {
      return {
        id: catIdToUuid[cat.id],
        name: cat.name,
        slug: cat.slug,
        color: cat.color || null,
        parent_id: cat.parentId ? catIdToUuid[cat.parentId] : null
      };
    });

    // Chèn Categories (chia ra chèn cấp 1 trước, cấp 2 sau, cấp 3 sau để tránh lỗi foreign key parent_id)
    console.log('2. Đang chèn Categories lên Supabase...');
    const lvl1 = categoriesToInsert.filter(c => c.parent_id === null);
    const lvl2 = categoriesToInsert.filter(c => c.parent_id !== null && !categoriesToInsert.some(p => p.id === c.parent_id && p.parent_id !== null));
    const lvl3 = categoriesToInsert.filter(c => c.parent_id !== null && categoriesToInsert.some(p => p.id === c.parent_id && p.parent_id !== null));

    console.log(`- Chèn ${lvl1.length} danh mục cấp 1...`);
    if (lvl1.length > 0) await apiRequest('categories', 'POST', lvl1);
    
    console.log(`- Chèn ${lvl2.length} danh mục cấp 2...`);
    if (lvl2.length > 0) await apiRequest('categories', 'POST', lvl2);

    console.log(`- Chèn ${lvl3.length} danh mục cấp 3...`);
    if (lvl3.length > 0) await apiRequest('categories', 'POST', lvl3);

    console.log('=> Đã chèn thành công tất cả Categories!');

    // 2. Chèn Products và Product Images
    console.log('\n3. Đang chèn Products và Images...');
    
    for (const prod of productsRaw) {
      // Tìm category id tương ứng từ slug
      const matchedCat = categoriesRaw.find(c => c.slug === prod.categorySlug);
      const categoryId = matchedCat ? catIdToUuid[matchedCat.id] : null;

      const productUuid = crypto.randomUUID();

      const productData = {
        id: productUuid,
        name: prod.name,
        slug: prod.slug,
        price: prod.price,
        description: prod.description,
        material: prod.material,
        size: prod.size,
        origin: prod.origin,
        tags: prod.tags,
        is_featured: prod.featured,
        is_new: prod.isNew,
        is_visible: prod.visible,
        category_id: categoryId
      };

      // Chèn Product
      await apiRequest('products', 'POST', [productData]);
      console.log(`- Đã chèn sản phẩm: "${prod.name}"`);

      // Chèn Image tương ứng vào product_images
      if (prod.image) {
        const urlParts = prod.image.split('/');
        const fileName = urlParts[urlParts.length - 1] || 'image.jpg';

        const imageData = {
          product_id: productUuid,
          image_url: prod.image,
          image_path: `/${fileName}`,
          file_id: 'uploaded_via_seed',
          is_primary: true,
          position: 0
        };

        await apiRequest('product_images', 'POST', [imageData]);
        console.log(`  + Đã liên kết ảnh cho: "${prod.name}"`);
      }
    }
    console.log('=> Đã chèn thành công tất cả Products và Images!');

    // 3. Chèn Blog Posts
    console.log('\n4. Đang chèn Blog Posts...');
    const blogToInsert = blogPostsRaw.map(blog => {
      return {
        id: crypto.randomUUID(),
        title: blog.title,
        slug: blog.slug,
        topic: blog.topic,
        topic_slug: blog.topicSlug,
        excerpt: blog.excerpt,
        content: blog.content,
        read_time: blog.read_time,
        image: blog.image,
        is_featured: blog.is_featured,
        status: blog.status
      };
    });

    if (blogToInsert.length > 0) {
      await apiRequest('blog_posts', 'POST', blogToInsert);
      blogToInsert.forEach(b => console.log(`- Đã chèn bài viết: "${b.title}"`));
    }
    console.log('=> Đã chèn thành công tất cả Blog Posts!');

    // 4. Chèn System Settings
    console.log('\n5. Đang chèn System Settings...');
    // Xóa settings cũ nếu có để tránh trùng lặp
    try {
      await apiRequest('system_settings', 'DELETE');
    } catch (e) {
      // Bỏ qua nếu bảng trống hoặc lỗi
    }

    const settingsData = {
      id: crypto.randomUUID(),
      ...companyInfoRaw
    };

    await apiRequest('system_settings', 'POST', [settingsData]);
    console.log('=> Đã chèn thành công System Settings!');

    console.log('\n=== HOÀN TẤT SEED DỮ LIỆU SUPABASE THÀNH CÔNG! ===');
  } catch (err) {
    console.error('\n❌ LỖI TRONG QUÁ TRÌNH SEED DỮ LIỆU:', err.message);
  }
}

seed();
