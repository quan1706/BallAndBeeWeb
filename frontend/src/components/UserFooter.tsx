'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, ChevronDown, MapPin, Phone, Mail, Clock, Map } from 'lucide-react';
import { useSettings } from '@/lib/api';
import { companyInfo } from '../data/mockData';

export function UserFooter() {
  const { data: settings } = useSettings();
  
  // Accordion state for Mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    links: false,
    contact: false,
    map: false,
  });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: string) => {
    if (isDesktop) return; // Không làm gì trên màn hình lớn
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Safe fallback values
  const name = "BallAndBee'sHome";
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
    <footer className="relative bg-[#030213] text-white overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C8954A]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#C8954A]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Divider Gradient Vàng Kim Mảnh Mai */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C8954A]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="flex flex-col pr-0 md:pr-4 mb-2 md:mb-0">
            <div className="text-2xl font-bold text-[#C8954A] heading mb-3 tracking-wide font-serif">
              {name}
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed max-w-sm font-sans">{tagline}</p>
            <div className="flex gap-4">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-[#C8954A]/20 hover:border-[#C8954A]/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(200,149,74,0.15)] cursor-pointer"
                  aria-label="Facebook Link"
                >
                  <Facebook className="w-4.5 h-4.5 text-white/80 transition-colors" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-[#C8954A]/20 hover:border-[#C8954A]/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(200,149,74,0.15)] cursor-pointer"
                  aria-label="Instagram Link"
                >
                  <Instagram className="w-4.5 h-4.5 text-white/80 transition-colors" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-[#C8954A]/20 hover:border-[#C8954A]/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(200,149,74,0.15)] cursor-pointer"
                  aria-label="TikTok Link"
                >
                  <svg className="w-4.5 h-4.5 text-white/80 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Cột 2: Các liên kết quan trọng */}
          <div className={`transition-all duration-300 md:border-t-0 p-4 md:p-0 rounded-xl md:rounded-none ${
            !isDesktop ? `bg-white/[0.01] border border-white/[0.04] ${openSections.links ? 'bg-white/[0.03] border-[#C8954A]/25 shadow-[0_4px_25px_rgba(200,149,74,0.03)]' : ''}` : ''
          }`}>
            <button 
              onClick={() => toggleSection('links')}
              className="w-full flex items-center justify-between text-left font-semibold text-[#C8954A] focus:outline-none cursor-pointer md:cursor-default"
            >
              <span className="text-xs tracking-widest uppercase font-sans font-semibold">Liên kết</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 text-white/40 ${openSections.links ? 'rotate-180 text-[#C8954A]' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${
              isDesktop || openSections.links ? 'grid-rows-[1fr] opacity-100 mt-4 md:mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none md:pointer-events-auto md:grid-rows-[1fr] md:opacity-100'
            }`}>
              <nav className="overflow-hidden flex flex-col gap-3.5 text-sm">
                <Link href="/" className="text-white/60 hover:text-[#C8954A] transition-colors py-1 md:py-0 inline-block w-fit">
                  Trang chủ
                </Link>
                <Link href="/products" className="text-white/60 hover:text-[#C8954A] transition-colors py-1 md:py-0 inline-block w-fit">
                  Sản phẩm
                </Link>
                <Link href="/blog" className="text-white/60 hover:text-[#C8954A] transition-colors py-1 md:py-0 inline-block w-fit">
                  Blog
                </Link>
                <Link href="/contact" className="text-white/60 hover:text-[#C8954A] transition-colors py-1 md:py-0 inline-block w-fit">
                  Liên hệ
                </Link>
              </nav>
            </div>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div className={`transition-all duration-300 md:border-t-0 p-4 md:p-0 rounded-xl md:rounded-none ${
            !isDesktop ? `bg-white/[0.01] border border-white/[0.04] ${openSections.contact ? 'bg-white/[0.03] border-[#C8954A]/25 shadow-[0_4px_25px_rgba(200,149,74,0.03)]' : ''}` : ''
          }`}>
            <button 
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between text-left font-semibold text-[#C8954A] focus:outline-none cursor-pointer md:cursor-default"
            >
              <span className="text-xs tracking-widest uppercase font-sans font-semibold">Thông tin liên hệ</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 text-white/40 ${openSections.contact ? 'rotate-180 text-[#C8954A]' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${
              isDesktop || openSections.contact ? 'grid-rows-[1fr] opacity-100 mt-4 md:mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none md:pointer-events-auto md:grid-rows-[1fr] md:opacity-100'
            }`}>
              <div className="overflow-hidden flex flex-col gap-4 text-sm">
                <div className="flex gap-3.5 items-start py-1 md:py-0">
                  <MapPin className="w-4 h-4 text-[#C8954A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-white/60">{address}</span>
                </div>
                <div className="flex gap-3.5 items-center py-1 md:py-0">
                  <Phone className="w-4 h-4 text-[#C8954A] shrink-0" />
                  <a href={`tel:${phone}`} className="text-white/60 hover:text-[#C8954A] transition-colors">{phone}</a>
                </div>
                <div className="flex gap-3.5 items-center py-1 md:py-0">
                  <Mail className="w-4 h-4 text-[#C8954A] shrink-0" />
                  <a href={`mailto:${email}`} className="text-white/60 hover:text-[#C8954A] transition-colors break-all">{email}</a>
                </div>
                <div className="flex gap-3.5 items-center py-1 md:py-0">
                  <Clock className="w-4 h-4 text-[#C8954A] shrink-0" />
                  <span className="text-white/60">{hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 4: Bản đồ */}
          <div className={`transition-all duration-300 md:border-t-0 p-4 md:p-0 rounded-xl md:rounded-none ${
            !isDesktop ? `bg-white/[0.01] border border-white/[0.04] ${openSections.map ? 'bg-white/[0.03] border-[#C8954A]/25 shadow-[0_4px_25px_rgba(200,149,74,0.03)]' : ''}` : ''
          }`}>
            <button 
              onClick={() => toggleSection('map')}
              className="w-full flex items-center justify-between text-left font-semibold text-[#C8954A] focus:outline-none cursor-pointer md:cursor-default"
            >
              <span className="text-xs tracking-widest uppercase font-sans font-semibold">Bản đồ</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 text-white/40 ${openSections.map ? 'rotate-180 text-[#C8954A]' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${
              isDesktop || openSections.map ? 'grid-rows-[1fr] opacity-100 mt-4 md:mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none md:pointer-events-auto md:grid-rows-[1fr] md:opacity-100'
            }`}>
              <div className="overflow-hidden flex flex-col gap-4">
                {mapSrc && (isDesktop || openSections.map) && (
                  <div className="rounded-xl overflow-hidden border border-white/10 mt-1 transition-all duration-300 shadow-md">
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="130"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Google Maps"
                    />
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/[0.02] hover:bg-[#C8954A]/15 border border-white/[0.06] hover:border-[#C8954A]/40 rounded-xl text-xs font-semibold text-white/90 hover:text-[#C8954A] transition-all duration-300 cursor-pointer focus:outline-none"
                >
                  <Map className="w-3.5 h-3.5 text-[#C8954A]" />
                  <span>Mở trong Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-white/40 tracking-widest uppercase">
          © {new Date().getFullYear()} {name}. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}


