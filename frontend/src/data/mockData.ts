export interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  parentId: number | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string | null;
  description: string;
  material: string;
  size: string;
  origin: string;
  tags: string[];
  featured: boolean;
  isNew: boolean;
  visible: boolean;
  image: string;
}

export const categories: Category[] = [
  // Cấp 1 (Root)
  { id: 1, name: 'Nội thất', slug: 'noi-that', color: '#C8954A', parentId: null },
  { id: 2, name: 'Lighting', slug: 'lighting', color: '#1E3A5F', parentId: null },
  { id: 3, name: 'Trang trí', slug: 'trang-tri', color: '#E07B54', parentId: null },
  { id: 4, name: 'Kitchen & Dining', slug: 'kitchen-dining', color: '#88B04B', parentId: null },
  { id: 5, name: 'Souvenir', slug: 'souvenir', color: '#6B7DB3', parentId: null },
  { id: 6, name: 'Đạo cụ chụp hình', slug: 'dao-cu-chup-hinh', color: '#D4956A', parentId: null },

  // Cấp 2 (Con của Nội thất)
  { id: 11, name: 'Nội thất trong nhà', slug: 'noi-that-trong-nha', parentId: 1 },
  { id: 12, name: 'Nội thất trẻ em', slug: 'noi-that-tre-em', parentId: 1 },
  { id: 13, name: 'Nội thất ngoài trời', slug: 'noi-that-ngoai-troi', parentId: 1 },

  // Cấp 3 (Con của Nội thất trong nhà)
  { id: 111, name: 'Sofa & Armchair', slug: 'sofa-armchair', parentId: 11 },
  { id: 112, name: 'Bàn trà & Bàn góc', slug: 'ban-tra-ban-goc', parentId: 11 },
  { id: 113, name: 'Kệ tivi & Tủ trang trí', slug: 'ke-tivi-tu-trang-tri', parentId: 11 },

  // Cấp 2 (Con của Lighting)
  { id: 21, name: 'Đèn treo', slug: 'den-treo', parentId: 2 },
  { id: 22, name: 'Đèn bàn', slug: 'den-ban', parentId: 2 },

  // Cấp 2 (Con của Trang trí)
  { id: 31, name: 'Tranh treo tường', slug: 'tranh-treo-tuong', parentId: 3 },

  // Cấp 2 (Con của Kitchen & Dining)
  { id: 41, name: 'Tableware', slug: 'tableware', parentId: 4 },
  { id: 42, name: 'Serveware', slug: 'serveware', parentId: 4 },
  { id: 43, name: 'Drinkware', slug: 'drinkware', parentId: 4 },

  // Cấp 3 (Con của Tableware)
  { id: 411, name: 'Bát đĩa sứ vẽ tay', slug: 'bat-dia-su-ve-tay', parentId: 41 },
  { id: 412, name: 'Bát đĩa gốm mộc', slug: 'bat-dia-gom-moc', parentId: 41 },
];

// Để đảm bảo tương thích ngược với code cũ sử dụng subcategories[categoryId]
export const subcategories: Record<number, Array<{ id: number; name: string; slug: string }>> = {
  1: [
    { id: 11, name: 'Nội thất trong nhà', slug: 'noi-that-trong-nha' },
    { id: 12, name: 'Nội thất trẻ em', slug: 'noi-that-tre-em' },
    { id: 13, name: 'Nội thất ngoài trời', slug: 'noi-that-ngoai-troi' },
  ],
  2: [
    { id: 21, name: 'Đèn treo', slug: 'den-treo' },
    { id: 22, name: 'Đèn bàn', slug: 'den-ban' },
  ],
  3: [
    { id: 31, name: 'Tranh treo tường', slug: 'tranh-treo-tuong' },
  ],
  4: [
    { id: 41, name: 'Tableware', slug: 'tableware' },
    { id: 42, name: 'Serveware', slug: 'serveware' },
    { id: 43, name: 'Drinkware', slug: 'drinkware' },
  ],
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Bàn gỗ me tây',
    price: 650000,
    slug: 'ban-go-me-tay',
    category: 'Nội thất',
    categorySlug: 'noi-that',
    subcategory: 'Nội thất trong nhà',
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
    id: 2,
    name: 'Đèn treo tre đan',
    price: 350000,
    slug: 'den-treo-tre-dan',
    category: 'Lighting',
    categorySlug: 'lighting',
    subcategory: 'Đèn treo',
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
    id: 3,
    name: 'Tranh treo tường',
    price: 450000,
    slug: 'tranh-treo-tuong',
    category: 'Trang trí',
    categorySlug: 'trang-tri',
    subcategory: 'Tranh treo tường',
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
    id: 4,
    name: 'Đèn bàn hiện đại B&B',
    price: 1250000,
    slug: 'den-ban-hien-dai',
    category: 'Lighting',
    categorySlug: 'lighting',
    subcategory: 'Đèn bàn',
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
    id: 5,
    name: 'Ghế sofa đơn Scandinavia',
    price: 3450000,
    slug: 'ghe-sofa-2-cho',
    category: 'Nội thất',
    categorySlug: 'noi-that',
    subcategory: 'Nội thất trong nhà',
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
    id: 6,
    name: 'Đĩa gốm mộc sâu lòng',
    price: 180000,
    slug: 'dia-gom-moc-tron',
    category: 'Kitchen & Dining',
    categorySlug: 'kitchen-dining',
    subcategory: 'Tableware',
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
    id: 7,
    name: 'Kệ sách mini gỗ thông mộc',
    price: 580000,
    slug: 'ke-sach-mini-go-thong',
    category: 'Nội thất',
    categorySlug: 'noi-that',
    subcategory: 'Nội thất trong nhà',
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

export const blogPosts = [
  {
    id: 1,
    title: 'Cách bày trí phòng khách phong cách tối giản',
    slug: 'cach-bay-tri-phong-khach-phong-cach-toi-gian',
    topic: 'Hướng dẫn bày trí',
    topicSlug: 'huong-dan-bay-tri',
    excerpt: 'Khám phá cách tạo không gian phòng khách thoáng đãng, tinh tế với phong cách tối giản hiện đại.',
    content: '<p>Nội dung bài viết...</p>',
    date: '2026-05-10',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    featured: true,
    status: 'published',
  },
  {
    id: 2,
    title: '10 món đồ trang trí không thể thiếu trong nhà',
    slug: '10-mon-do-trang-tri-khong-the-thieu-trong-nha',
    topic: 'Phong cách sống',
    topicSlug: 'phong-cach-song',
    excerpt: 'Những món đồ trang trí thiết yếu giúp ngôi nhà của bạn trở nên ấm cúng và đầy cá tính hơn.',
    content: '<p>Nội dung bài viết...</p>',
    date: '2026-05-08',
    readTime: '7 phút đọc',
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800',
    featured: false,
    status: 'published',
  },
  {
    id: 3,
    title: 'Xu hướng nội thất 2026',
    slug: 'xu-huong-noi-that-2026',
    topic: 'Tin tức',
    topicSlug: 'tin-tuc',
    excerpt: 'Cập nhật những xu hướng nội thất mới nhất năm 2026 từ các chuyên gia thiết kế hàng đầu.',
    content: '<p>Nội dung bài viết...</p>',
    date: '2026-05-15',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    featured: true,
    status: 'published',
  },
];

export const companyInfo = {
  name: 'BALLANDBEEHOME',
  tagline: 'Không gian sống - Tinh tế từng chi tiết',
  description: 'Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại.',
  phone: '0901 234 567',
  zalo: '0901 234 567',
  email: 'hello@ballandbeehome.com',
  address: '123 Nguyễn Văn Linh, Đà Nẵng',
  hours: 'Thứ 2–7, 8:00–18:00',
  social: {
    facebook: 'https://facebook.com/ballandbeehome',
    instagram: 'https://instagram.com/ballandbeehome',
    tiktok: 'https://tiktok.com/@ballandbeehome',
  },
};
