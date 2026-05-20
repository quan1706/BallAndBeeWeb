'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { useSettings } from '@/lib/api';
import { companyInfo } from '../data/mockData';

export function UserFooter() {
  const { data: settings } = useSettings();

  // Safe fallback values
  const name = settings?.name || companyInfo.name;
  const tagline = settings?.tagline || companyInfo.tagline;
  const address = settings?.address || companyInfo.address;
  const phone = settings?.phone || companyInfo.phone;
  const email = settings?.email || companyInfo.email;
  const hours = settings?.hours || companyInfo.hours;
  
  const facebook = settings?.facebook || companyInfo.social.facebook;
  const instagram = settings?.instagram || companyInfo.social.instagram;
  const tiktok = settings?.tiktok || companyInfo.social.tiktok;

  const getMapSrc = (embedCode: string) => {
    if (!embedCode) return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s';
    if (embedCode.startsWith('http')) return embedCode;
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : embedCode;
  };
  const mapSrc = getMapSrc(settings?.googleMapsEmbed || '');

  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-[#C8954A] heading mb-3">
              {name}
            </div>
            <p className="text-sm text-white/80 mb-4">{tagline}</p>
            <div className="flex gap-3">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8954A] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#C8954A]">Liên kết</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Trang chủ
              </Link>
              <Link href="/products" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Sản phẩm
              </Link>
              <Link href="/blog" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-[#C8954A] transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#C8954A]">Thông tin liên hệ</h3>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <div className="flex gap-2">
                <span>📍</span>
                <span>{address}</span>
              </div>
              <div className="flex gap-2">
                <span>📞</span>
                <a href={`tel:${phone}`} className="hover:text-[#C8954A] transition-colors">{phone}</a>
              </div>
              <div className="flex gap-2">
                <span>📧</span>
                <a href={`mailto:${email}`} className="hover:text-[#C8954A] transition-colors">{email}</a>
              </div>
              <div className="flex gap-2">
                <span>🕐</span>
                <span>{hours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#C8954A]">Bản đồ</h3>
            {mapSrc && (
              <div className="rounded-lg overflow-hidden border border-white/10">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/60">
          © 2026 {name}. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
