import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const API_BASE_URL = 'http://localhost:5000/api';

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  parentId: number | null;
  subcategories?: Category[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  category: string;       // Tên root category (e.g. "Nội thất")
  categorySlug: string;   // Slug root category
  subcategory: string | null; // Tên subcategory nếu có
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
  id: number;
  title: string;
  slug: string;
  topic: string;
  topicSlug: string;
  excerpt: string;
  content: string;
  date: string; // YYYY-MM-DD
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
  id?: number;
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
  id?: number;
  name: string;
  phone: string;
  email?: string;
  message: string;
  sentAt?: string;
  isRead?: boolean;
}

// ============================================================
// Helper: Map backend ProductDto → Frontend Product
// BE trả về: { id, name, price, slug, category, categorySlug, subcategory, ... }
// ============================================================
function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    slug: p.slug,
    category: p.category || '',
    categorySlug: p.categorySlug || '',
    subcategory: p.subcategory || null,
    description: p.description || '',
    material: p.material || '',
    size: p.size || '',
    origin: p.origin || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    featured: !!p.featured,
    isNew: !!p.isNew,
    visible: !!p.visible,
    image: p.image || '',
  };
}

// ============================================================
// Fetch Functions — Categories
// ============================================================

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// Trả về danh sách phẳng (flat) của tất cả categories kể cả subcategories
export async function fetchCategoriesFlat(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const tree: Category[] = await res.json();

  // Flatten tree recursively
  const flatten = (cats: Category[]): Category[] => {
    return cats.reduce<Category[]>((acc, cat) => {
      acc.push({ ...cat, subcategories: [] });
      if (cat.subcategories && cat.subcategories.length > 0) {
        acc.push(...flatten(cat.subcategories));
      }
      return acc;
    }, []);
  };

  return flatten(tree);
}

export async function createCategory(data: {
  name: string;
  slug: string;
  color?: string;
  parentId?: number | null;
}): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create category' }));
    throw new Error(err.message || 'Failed to create category');
  }
  return res.json();
}

export async function updateCategory(
  id: number,
  data: { name: string; slug: string; color?: string; parentId?: number | null }
): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update category' }));
    throw new Error(err.message || 'Failed to update category');
  }
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
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
  const url = new URL(`${API_BASE_URL}/products`);
  if (filters?.categorySlug) url.searchParams.append('categorySlug', filters.categorySlug);
  if (filters?.featured !== undefined) url.searchParams.append('featured', filters.featured.toString());
  if (filters?.search) url.searchParams.append('search', filters.search);
  if (filters?.limit) url.searchParams.append('limit', filters.limit.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return mapProduct(await res.json());
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  // Map frontend shape → backend shape
  const body = {
    name: data.name,
    slug: data.slug || '',
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
    categoryId: 0, // Will be set by caller via categoryId field
  };
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create product' }));
    throw new Error(err.message || 'Failed to create product');
  }
  return mapProduct(await res.json());
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
  categoryId: number;
}): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: '', ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create product' }));
    throw new Error(err.message || 'Failed to create product');
  }
  return mapProduct(await res.json());
}

export async function updateProductRaw(
  id: number,
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
    categoryId: number;
  }
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update product' }));
    throw new Error(err.message || 'Failed to update product');
  }
  return mapProduct(await res.json());
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

// ============================================================
// Fetch Functions — Blog
// ============================================================

export async function fetchBlogPosts(filters?: {
  featured?: boolean;
  limit?: number;
  topicSlug?: string;
}): Promise<BlogPost[]> {
  const url = new URL(`${API_BASE_URL}/blog`);
  if (filters?.featured !== undefined) url.searchParams.append('featured', filters.featured.toString());
  if (filters?.limit) url.searchParams.append('limit', filters.limit.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  const data = await res.json();

  return data
    .map((b: any) => ({
      ...b,
      date: b.date ? b.date.split('T')[0] : '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      readTime: b.readTime || '',
      image: b.image || '',
    }))
    // Filter by topicSlug client-side since BE doesn't support it yet
    .filter((b: BlogPost) => !filters?.topicSlug || b.topicSlug === filters.topicSlug);
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blog/${slug}`);
  if (!res.ok) throw new Error('Blog post not found');
  const b = await res.json();
  return {
    ...b,
    date: b.date ? b.date.split('T')[0] : '',
    excerpt: b.excerpt || '',
    content: b.content || '',
    readTime: b.readTime || '',
    image: b.image || '',
  };
}

export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, slug: data.slug || '' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create blog post' }));
    throw new Error(err.message || 'Failed to create blog post');
  }
  const b = await res.json();
  return { ...b, date: b.date ? b.date.split('T')[0] : '' };
}

export async function updateBlogPost(
  id: number,
  data: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update blog post' }));
    throw new Error(err.message || 'Failed to update blog post');
  }
  const b = await res.json();
  return { ...b, date: b.date ? b.date.split('T')[0] : '' };
}

export async function deleteBlogPost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete blog post');
}

// ============================================================
// Fetch Functions — Admin Stats
// ============================================================

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE_URL}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

// ============================================================
// Fetch Functions — Settings
// ============================================================

export async function fetchSettings(): Promise<SystemSetting> {
  const res = await fetch(`${API_BASE_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch system settings');
  return res.json();
}

export async function updateSettings(data: SystemSetting): Promise<SystemSetting> {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update system settings' }));
    throw new Error(err.message || 'Failed to update system settings');
  }
  return res.json();
}

// ============================================================
// Fetch Functions — Contact Messages
// ============================================================

export async function submitContactMessage(data: ContactMessage): Promise<{ message: string; data: ContactMessage }> {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to submit contact message' }));
    throw new Error(err.message || 'Failed to submit contact message');
  }
  return res.json();
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE_URL}/admin/contacts`);
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return res.json();
}

export async function markContactMessageAsRead(id: number): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE_URL}/admin/contacts/${id}/read`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to mark contact message as read');
  return res.json();
}

// ============================================================
// React Query Hooks — Categories
// ============================================================

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateCategory>[1] }) =>
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
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateProductRaw>[1] }) =>
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
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateBlogPost>[1] }) =>
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
    staleTime: 60 * 1000, // 1 minute
  });
}

// ============================================================
// React Query Hooks — Settings
// ============================================================

export function useSettings() {
  return useQuery<SystemSetting, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    staleTime: 30 * 1000, // 30 seconds
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
