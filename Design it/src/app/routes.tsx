import { createBrowserRouter, Navigate } from 'react-router';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminBlogForm } from './pages/admin/AdminBlogForm';
import { AdminSettings } from './pages/admin/AdminSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: UserLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'products', Component: ProductsPage },
      { path: 'products/:slug', Component: ProductDetailPage },
      { path: 'blog', Component: BlogPage },
      { path: 'contact', Component: ContactPage },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'products', Component: AdminProducts },
      { path: 'products/new', Component: AdminProductForm },
      { path: 'products/:id', Component: AdminProductForm },
      { path: 'categories', Component: AdminCategories },
      { path: 'blog', Component: AdminBlog },
      { path: 'blog/new', Component: AdminBlogForm },
      { path: 'blog/:id', Component: AdminBlogForm },
      { path: 'settings', Component: AdminSettings },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
