import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { categories, products, blogPosts } from '../data/mockData';

export function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const featuredBlogs = blogPosts.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl bg-black/30 backdrop-blur-sm p-8 rounded-xl">
            <p className="text-[#C8954A] text-xs uppercase tracking-widest mb-3">
              Phong cách sống Việt
            </p>
            <h1 className="heading text-5xl text-white mb-4">
              Không gian sống – Tinh tế từng chi tiết
            </h1>
            <p className="text-white/80 mb-6 leading-relaxed">
              Khám phá những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại,
              tạo nên không gian sống ấm cúng và đầy cảm hứng.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] transition-colors"
              >
                Khám phá sản phẩm
              </Link>
              <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#1E3A5F] transition-colors">
                Về chúng tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading text-3xl text-center text-[#1E3A5F] mb-12">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=600)`,
                }}
              >
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8954A] rounded-xl transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading text-3xl text-[#1E3A5F]">Sản phẩm nổi bật</h2>
            <Link
              to="/products"
              className="text-[#C8954A] flex items-center gap-2 hover:gap-3 transition-all"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-[#C8954A] text-white text-xs px-3 py-1 rounded-full">
                      Nổi bật
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#888888] mb-1">{product.category}</p>
                  <h3 className="font-semibold text-[#1E3A5F] mb-3">{product.name}</h3>
                  <div className="text-[#C8954A] text-sm flex items-center gap-1">
                    Xem chi tiết <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading text-3xl text-center text-[#1E3A5F] mb-12">
            Cảm hứng & Phong cách sống
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block bg-[#E07B54] text-white text-xs px-3 py-1 rounded-full mb-3">
                    {post.topic}
                  </span>
                  <h3 className="heading text-lg text-[#1E3A5F] mb-2 group-hover:text-[#C8954A] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#888888] mb-3 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-[#888888]">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="border-l-4 border-[#C8954A] pl-6">
              <h2 className="heading text-3xl text-[#1E3A5F] mb-4">Về BallAndBee'sHome</h2>
              <p className="text-[#888888] leading-relaxed mb-6">
                Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt
                hiện đại. Mỗi sản phẩm đều được chọn lọc kỹ lưỡng, kết hợp giữa chất lượng cao cấp và
                thiết kế tinh tế, mang đến không gian sống ấm cúng và đầy cảm hứng cho mọi gia đình.
              </p>
              <Link to="/contact" className="text-[#C8954A] flex items-center gap-2 hover:gap-3 transition-all">
                Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"
                alt="About"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
