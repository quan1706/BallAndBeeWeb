import { Link } from 'react-router';
import { Facebook, Instagram } from 'lucide-react';
import { companyInfo } from '../data/mockData';

export function UserFooter() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-[#C8954A] heading mb-3">
              {companyInfo.name}
            </div>
            <p className="text-sm text-white/80 mb-4">{companyInfo.tagline}</p>
            <div className="flex gap-3">
              <a
                href={companyInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên kết</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Trang chủ
              </Link>
              <Link to="/products" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Sản phẩm
              </Link>
              <Link to="/blog" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <div className="flex gap-2">
                <span>📍</span>
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex gap-2">
                <span>📞</span>
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex gap-2">
                <span>📧</span>
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex gap-2">
                <span>🕐</span>
                <span>{companyInfo.hours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Địa chỉ</h3>
            <div className="rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/60">
          © 2026 {companyInfo.name}. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
