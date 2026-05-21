import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface Category {
  id: any; // Sử dụng any để tương thích cả string (UUID) và number từ UI cũ
  name: string;
  slug: string;
  color?: string;
  parentId: any; // Sử dụng any
  position?: number; // Thêm trường position lưu thứ tự sắp xếp
  subcategories?: Category[];
}

export interface Product {
  id: any; // Sử dụng any
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

export interface BlogPost {
  id: any; // Sử dụng any
  title: string;
  slug: string;
  topic: string;
  topicSlug: string;
  excerpt: string;
  content: string;
  date: string; 
  readTime: string;
  image: string;
  featured: boolean;
  status: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalBlogPosts: number;
  featuredProducts: number;
  newProducts: number;
  visibleProducts: number;
}

export interface SystemSetting {
  id?: any; // Sử dụng any
  name: string;
  tagline?: string;
  description?: string;
  phone?: string;
  zalo?: string;
  email?: string;
  address?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  googleMapsEmbed?: string;
}

export interface ContactMessage {
  id?: any; // Sử dụng any
  name: string;
  phone: string;
  email?: string;
  message: string;
  sentAt?: string;
  isRead?: boolean;
}

// ============================================================
// Helper: Map backend ProductDto → Frontend Product
// ============================================================
function mapProduct(p: any, imageUrl: string = ''): Product {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    slug: p.slug,
    category: p.categories?.name || '', 
    categorySlug: p.categories?.slug || '', 
    subcategory: null,
    description: p.description || '',
    material: p.material || '',
    size: p.size || '',
    origin: p.origin || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    featured: !!p.is_featured,
    isNew: !!p.is_new,
    visible: !!p.is_visible,
    image: imageUrl || p.image || '',
  };
}

// ============================================================
// Fetch Functions — Categories
// ============================================================

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true }) // Ưu tiên sắp xếp theo vị trí position kéo thả
    .order('created_at', { ascending: true }); // Fallback theo thời gian tạo

  if (error) throw new Error(error.message);

  // Xây dựng cây danh mục (tree) từ danh sách phẳng
  const buildTree = (cats: any[], parentId: any = null): Category[] => {
    return cats
      .filter(c => c.parent_id === parentId)
      .map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        color: c.color || undefined,
        parentId: c.parent_id,
        position: c.position || 0,
        subcategories: buildTree(cats, c.id)
      }));
  };

  return buildTree(data || []);
}

export async function fetchCategoriesFlat(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true }) // Ưu tiên sắp xếp theo position
    .order('created_at', { ascending: true }); // Fallback theo thời gian tạo

  if (error) throw new Error(error.message);

  return (data || []).map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    color: c.color || undefined,
    parentId: c.parent_id,
    position: c.position || 0
  }));
}

export async function createCategory(data: {
  name: string;
  slug: string;
  color?: string;
  parentId?: any;
  position?: number;
}): Promise<Category> {
  const { data: cat, error } = await supabase
    .from('categories')
    .insert([{
      name: data.name,
      slug: data.slug,
      color: data.color || null,
      parent_id: data.parentId || null,
      position: data.position !== undefined ? data.position : 0
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color || undefined,
    parentId: cat.parent_id,
    position: cat.position || 0
  };
}

export async function updateCategory(
  id: any,
  data: { name?: string; slug?: string; color?: string; parentId?: any; position?: number }
): Promise<Category> {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.color !== undefined) updateData.color = data.color || null;
  if (data.parentId !== undefined) updateData.parent_id = data.parentId || null;
  if (data.position !== undefined) updateData.position = data.position;

  const { data: cat, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color || undefined,
    parentId: cat.parent_id,
    position: cat.position || 0
  };
}

export async function deleteCategory(id: any): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ============================================================
// Fetch Functions — Products
// ============================================================

export async function fetchProducts(filters?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      ),
      product_images (
        image_url,
        is_primary
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let filteredData = data || [];

  // Filter theo categorySlug client-side hoặc join query
  if (filters?.categorySlug) {
    filteredData = filteredData.filter((p: any) => p.categories?.slug === filters.categorySlug);
  }

  return filteredData.map((p: any) => {
    const primaryImg = p.product_images?.find((img: any) => img.is_primary) || p.product_images?.[0];
    return mapProduct(p, primaryImg?.image_url || '');
  });
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      ),
      product_images (
        image_url,
        is_primary
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw new Error('Product not found');
  
  const primaryImg = data.product_images?.find((img: any) => img.is_primary) || data.product_images?.[0];
  return mapProduct(data, primaryImg?.image_url || '');
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  return createProductRaw({
    name: data.name,
    slug: data.slug,
    price: data.price,
    description: data.description,
    material: data.material,
    size: data.size,
    origin: data.origin,
    tags: data.tags,
    featured: data.featured,
    isNew: data.isNew,
    visible: data.visible,
    image: data.image,
    categoryId: null
  });
}

export async function createProductRaw(data: {
  name: string;
  slug?: string;
  price: number;
  description?: string;
  material?: string;
  size?: string;
  origin?: string;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
  visible?: boolean;
  image?: string;
  categoryId: any; // Sử dụng any
}): Promise<Product> {
  const slug = data.slug || data.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // 1. Lưu sản phẩm vào table products
  const { data: p, error } = await supabase
    .from('products')
    .insert([{
      name: data.name,
      slug,
      price: data.price,
      description: data.description || '',
      material: data.material || '',
      size: data.size || '',
      origin: data.origin || '',
      tags: data.tags || [],
      is_featured: !!data.featured,
      is_new: data.isNew !== false,
      is_visible: data.visible !== false,
      category_id: data.categoryId || null
    }])
    .select('*, categories(name, slug)')
    .single();

  if (error) throw new Error(error.message);

  // 2. Nếu có ảnh từ ImageKit, lưu link ảnh vào product_images
  if (data.image) {
    const urlParts = data.image.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'image.jpg';

    const { error: imgError } = await supabase
      .from('product_images')
      .insert([{
        product_id: p.id,
        image_url: data.image,
        image_path: `/${fileName}`,
        file_id: 'uploaded_via_frontend',
        is_primary: true,
        position: 0
      }]);

    if (imgError) console.error('Lỗi khi liên kết ảnh sản phẩm:', imgError);
  }

  return mapProduct(p, data.image || '');
}

export async function updateProductRaw(
  id: any,
  data: {
    name: string;
    slug: string;
    price: number;
    description?: string;
    material?: string;
    size?: string;
    origin?: string;
    tags?: string[];
    featured?: boolean;
    isNew?: boolean;
    visible?: boolean;
    image?: string;
    categoryId: any;
  }
): Promise<Product> {
  // 1. Cập nhật thông tin cơ bản của sản phẩm
  const { data: p, error } = await supabase
    .from('products')
    .update({
      name: data.name,
      slug: data.slug,
      price: data.price,
      description: data.description || '',
      material: data.material || '',
      size: data.size || '',
      origin: data.origin || '',
      tags: data.tags || [],
      is_featured: !!data.featured,
      is_new: data.isNew !== false,
      is_visible: data.visible !== false,
      category_id: data.categoryId || null
    })
    .eq('id', id)
    .select('*, categories(name, slug)')
    .single();

  if (error) throw new Error(error.message);

  // 2. Cập nhật hình ảnh sản phẩm nếu có thay đổi
  if (data.image) {
    const urlParts = data.image.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'image.jpg';

    // Xóa liên kết ảnh cũ trước
    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id);

    // Chèn liên kết ảnh mới từ ImageKit
    await supabase
      .from('product_images')
      .insert([{
        product_id: id,
        image_url: data.image,
        image_path: `/${fileName}`,
        file_id: 'uploaded_via_frontend',
        is_primary: true,
        position: 0
      }]);
  }

  return mapProduct(p, data.image || '');
}

export async function deleteProduct(id: any): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ============================================================
// Fetch Functions — Blog
// ============================================================

export async function fetchBlogPosts(filters?: {
  featured?: boolean;
  limit?: number;
  topicSlug?: string;
}): Promise<BlogPost[]> {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.topicSlug) {
    query = query.eq('topic_slug', filters.topicSlug);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    topic: b.topic,
    topicSlug: b.topic_slug,
    excerpt: b.excerpt || '',
    content: b.content || '',
    date: b.created_at ? b.created_at.split('T')[0] : '',
    readTime: b.read_time || '',
    image: b.image || '',
    featured: !!b.is_featured,
    status: b.status || 'draft',
  }));
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw new Error('Blog post not found');

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    topic: data.topic,
    topicSlug: data.topic_slug,
    excerpt: data.excerpt || '',
    content: data.content || '',
    date: data.created_at ? data.created_at.split('T')[0] : '',
    readTime: data.read_time || '',
    image: data.image || '',
    featured: !!data.is_featured,
    status: data.status || 'draft',
  };
}

export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const { data: b, error } = await supabase
    .from('blog_posts')
    .insert([{
      title: data.title,
      slug: data.slug,
      topic: data.topic,
      topic_slug: data.topicSlug,
      excerpt: data.excerpt || '',
      content: data.content,
      read_time: data.readTime || '',
      image: data.image || '',
      is_featured: !!data.featured,
      status: data.status || 'draft'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    topic: b.topic,
    topicSlug: b.topic_slug,
    excerpt: b.excerpt || '',
    content: b.content || '',
    date: b.created_at ? b.created_at.split('T')[0] : '',
    readTime: b.read_time || '',
    image: b.image || '',
    featured: !!b.is_featured,
    status: b.status || 'draft',
  };
}

export async function updateBlogPost(
  id: any,
  data: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.topic !== undefined) updateData.topic = data.topic;
  if (data.topicSlug !== undefined) updateData.topic_slug = data.topicSlug;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.readTime !== undefined) updateData.read_time = data.readTime;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.featured !== undefined) updateData.is_featured = !!data.featured;
  if (data.status !== undefined) updateData.status = data.status;

  const { data: b, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    topic: b.topic,
    topicSlug: b.topic_slug,
    excerpt: b.excerpt || '',
    content: b.content || '',
    date: b.created_at ? b.created_at.split('T')[0] : '',
    readTime: b.read_time || '',
    image: b.image || '',
    featured: !!b.is_featured,
    status: b.status || 'draft',
  };
}

export async function deleteBlogPost(id: any): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ============================================================
// Fetch Functions — Admin Stats
// ============================================================

export async function fetchAdminStats(): Promise<AdminStats> {
  // Lấy tổng số lượng bản ghi bằng Supabase API tối ưu
  const [productsCount, categoriesCount, blogsCount, featuredProducts, newProducts, visibleProducts] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_new', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_visible', true),
  ]);

  return {
    totalProducts: productsCount.count || 0,
    totalCategories: categoriesCount.count || 0,
    totalBlogPosts: blogsCount.count || 0,
    featuredProducts: featuredProducts.count || 0,
    newProducts: newProducts.count || 0,
    visibleProducts: visibleProducts.count || 0,
  };
}

// ============================================================
// Fetch Functions — Settings
// ============================================================

export async function fetchSettings(): Promise<SystemSetting> {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    name: data.name,
    tagline: data.tagline || '',
    description: data.description || '',
    phone: data.phone || '',
    zalo: data.zalo || '',
    email: data.email || '',
    address: data.address || '',
    hours: data.hours || '',
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    tiktok: data.tiktok || '',
    googleMapsEmbed: data.google_maps_embed || ''
  };
}

export async function updateSettings(data: SystemSetting): Promise<SystemSetting> {
  const updateData: any = {
    name: data.name,
    tagline: data.tagline || null,
    description: data.description || null,
    phone: data.phone || null,
    zalo: data.zalo || null,
    email: data.email || null,
    address: data.address || null,
    hours: data.hours || null,
    facebook: data.facebook || null,
    instagram: data.instagram || null,
    tiktok: data.tiktok || null,
    google_maps_embed: data.googleMapsEmbed || null
  };

  const { data: settings, error } = await supabase
    .from('system_settings')
    .update(updateData)
    .eq('id', data.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: settings.id,
    name: settings.name,
    tagline: settings.tagline || '',
    description: settings.description || '',
    phone: settings.phone || '',
    zalo: settings.zalo || '',
    email: settings.email || '',
    address: settings.address || '',
    hours: settings.hours || '',
    facebook: settings.facebook || '',
    instagram: settings.instagram || '',
    tiktok: settings.tiktok || '',
    googleMapsEmbed: settings.google_maps_embed || ''
  };
}

// ============================================================
// Fetch Functions — Contact Messages
// ============================================================

export async function submitContactMessage(data: ContactMessage): Promise<{ message: string; data: ContactMessage }> {
  const { data: msg, error } = await supabase
    .from('contact_messages')
    .insert([{
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message,
      is_read: false
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    message: 'Gửi tin nhắn liên hệ thành công!',
    data: {
      id: msg.id,
      name: msg.name,
      phone: msg.phone,
      email: msg.email || undefined,
      message: msg.message,
      sentAt: msg.created_at ? msg.created_at.split('T')[0] : '',
      isRead: !!msg.is_read
    }
  };
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map(msg => ({
    id: msg.id,
    name: msg.name,
    phone: msg.phone,
    email: msg.email || undefined,
    message: msg.message,
    sentAt: msg.created_at ? msg.created_at.split('T')[0] : '',
    isRead: !!msg.is_read
  }));
}

export async function markContactMessageAsRead(id: any): Promise<ContactMessage> {
  const { data: msg, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: msg.id,
    name: msg.name,
    phone: msg.phone,
    email: msg.email || undefined,
    message: msg.message,
    sentAt: msg.created_at ? msg.created_at.split('T')[0] : '',
    isRead: !!msg.is_read
  };
}

// ============================================================
// React Query Hooks — Categories
// ============================================================

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useCategoriesFlat() {
  return useQuery<Category[], Error>({
    queryKey: ['categories-flat'],
    queryFn: fetchCategoriesFlat,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: any; data: Parameters<typeof updateCategory>[1] }) =>
      updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}

// ============================================================
// React Query Hooks — Products
// ============================================================

export function useProducts(filters?: Parameters<typeof fetchProducts>[0]) {
  return useQuery<Product[], Error>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product, Error>({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProductRaw,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: any; data: Parameters<typeof updateProductRaw>[1] }) =>
      updateProductRaw(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

// ============================================================
// React Query Hooks — Blog
// ============================================================

export function useBlogPosts(filters?: Parameters<typeof fetchBlogPosts>[0]) {
  return useQuery<BlogPost[], Error>({
    queryKey: ['blogs', filters],
    queryFn: () => fetchBlogPosts(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery<BlogPost, Error>({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: any; data: Parameters<typeof updateBlogPost>[1] }) =>
      updateBlogPost(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['blogs'] });
      qc.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

// ============================================================
// React Query Hooks — Admin Stats
// ============================================================

export function useAdminStats() {
  return useQuery<AdminStats, Error>({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    staleTime: 60 * 1000, 
  });
}

// ============================================================
// React Query Hooks — Settings
// ============================================================

export function useSettings() {
  return useQuery<SystemSetting, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 10 * 60 * 1000, 
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// ============================================================
// React Query Hooks — Contact Messages
// ============================================================

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: submitContactMessage,
  });
}

export function useContactMessages() {
  return useQuery<ContactMessage[], Error>({
    queryKey: ['contact-messages'],
    queryFn: fetchContactMessages,
    staleTime: 30 * 1000, 
  });
}

export function useMarkContactMessageAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markContactMessageAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });
}

// Export API_BASE_URL placeholder để duy trì tính tương thích với các component UI cũ
export const API_BASE_URL = '/api';
